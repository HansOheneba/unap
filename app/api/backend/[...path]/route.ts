/**
 * Authenticated reverse proxy to the real API (https://api.unapologeticnm.com).
 *
 * Why this exists instead of a plain `next.config.ts` rewrite:
 * 1. CORS — the upstream API has no Access-Control-Allow-Origin, so the browser
 *    must always talk to our own origin.
 * 2. Token custody — the access/refresh tokens are attached here, server-side,
 *    from httpOnly cookies. The browser's JavaScript never holds a bearer token,
 *    so it cannot be exfiltrated by an XSS bug (unlike localStorage/Zustand persist).
 * 3. Silent refresh — a request that hits an expired access token gets one
 *    transparent retry after rotating the refresh token, so the client never has
 *    to manage token lifecycle itself.
 */
import { NextRequest, NextResponse } from "next/server";
import {
  API_ORIGIN,
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
  refreshAccessToken,
  setAuthCookies,
} from "@/lib/api/server-auth";
import { fetchWithRetry } from "@/lib/api/fetch-with-retry";
import { isDebugMode } from "@/lib/debug";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
// The only two upstream endpoints that ever return raw tokens in their JSON body.
const TOKEN_MINTING_PATHS = new Set(["auth/otp/verify", "auth/refresh"]);

type Envelope = {
  success?: boolean;
  data?: unknown;
  [key: string]: unknown;
};

/** Defense-in-depth CSRF check. SameSite=Lax already blocks cross-site cookie-bearing
 *  fetches, but we also reject mismatched Origin headers on state-changing requests. */
function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.nextUrl.host;
  } catch {
    return false;
  }
}

async function readEnvelope(res: Response): Promise<Envelope | null> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as Envelope;
  } catch {
    return null;
  }
}

type TokenBag = {
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
};

/** Pull tokens from either Nest `{ data: { accessToken } }` or a flat verify body. */
function extractTokens(body: Envelope | null): TokenBag | null {
  if (!body) return null;
  const nested =
    body.data && typeof body.data === "object" && !Array.isArray(body.data)
      ? (body.data as TokenBag)
      : null;
  if (nested?.accessToken && nested?.refreshToken) return nested;
  const flat = body as Envelope & TokenBag;
  if (flat.accessToken && flat.refreshToken) {
    return {
      accessToken: flat.accessToken,
      refreshToken: flat.refreshToken,
      expiresIn: flat.expiresIn,
    };
  }
  return null;
}

/** Strips accessToken/refreshToken out of a response body before it reaches the browser. */
function stripTokens(body: Envelope | null): Envelope | null {
  if (!body) return body;
  const next: Envelope = { ...body };
  if (next.data && typeof next.data === "object" && !Array.isArray(next.data)) {
    const { accessToken: _a, refreshToken: _r, ...rest } = next.data as Record<
      string,
      unknown
    >;
    next.data = rest;
  }
  delete next.accessToken;
  delete next.refreshToken;
  return next;
}

async function forwardOnce(
  request: NextRequest,
  path: string,
  bodyText: string | undefined,
  accessToken: string | null,
): Promise<Response> {
  const headers = new Headers({
    Accept: "application/json",
    // Origin often drops idle keep-alive sockets; close avoids UND_ERR_SOCKET.
    Connection: "close",
  });
  if (bodyText !== undefined) headers.set("Content-Type", "application/json");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  return fetchWithRetry(
    `${API_ORIGIN}/${path}${request.nextUrl.search}`,
    {
      method: request.method,
      headers,
      body: bodyText,
      cache: "no-store",
    },
    { retries: 2 },
  );
}

async function handle(
  request: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  const { path: segments } = await ctx.params;
  const path = segments.join("/");

  if (MUTATING_METHODS.has(request.method) && !isSameOrigin(request)) {
    return NextResponse.json(
      { success: false, message: "Cross-site request blocked" },
      { status: 403 },
    );
  }

  const hasBody = !["GET", "HEAD"].includes(request.method);
  const rawBody = hasBody ? await request.text() : undefined;
  const bodyText = rawBody && rawBody.length > 0 ? rawBody : undefined;
  const debug = isDebugMode();
  const isOrders = path === "orders" || path.startsWith("orders/");
  const isPlaceOrder = path === "orders" && request.method === "POST";
  let ordersPayload: unknown = null;
  if (isOrders && bodyText) {
    try {
      ordersPayload = JSON.parse(bodyText);
    } catch {
      ordersPayload = bodyText;
    }
  }

  if (debug && isOrders) {
    console.log("\n========== [orders] REQUEST ==========");
    console.log(
      JSON.stringify(
        {
          method: request.method,
          path,
          search: request.nextUrl.search || undefined,
          payload: ordersPayload,
        },
        null,
        2,
      ),
    );
    console.log("======================================\n");
  }

  // ── Logout: always use OUR httpOnly refresh token, always drop the local session ──
  if (path === "auth/logout" && request.method === "POST") {
    const [accessToken, refreshToken] = await Promise.all([
      getAccessToken(),
      getRefreshToken(),
    ]);
    try {
      await forwardOnce(
        request,
        path,
        JSON.stringify(refreshToken ? { refreshToken } : {}),
        accessToken,
      );
    } catch {
      // Even if the upstream call fails, still drop the local session below.
    } finally {
      await clearAuthCookies();
    }
    return NextResponse.json({ success: true });
  }

  let accessToken = await getAccessToken();
  let res: Response;
  try {
    res = await forwardOnce(request, path, bodyText, accessToken);
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Could not reach the server. Check your connection and try again.",
      },
      { status: 502 },
    );
  }

  // ── One silent refresh-and-retry when the access token has expired ──
  if (res.status === 401 && !TOKEN_MINTING_PATHS.has(path)) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      accessToken = refreshed;
      try {
        res = await forwardOnce(request, path, bodyText, accessToken);
      } catch {
        return NextResponse.json(
          {
            success: false,
            message:
              "Could not reach the server. Check your connection and try again.",
          },
          { status: 502 },
        );
      }
    }
  }

  if (res.status === 204) {
    if (debug && isOrders) {
      console.log("\n========== [orders] RESPONSE ==========");
      console.log(JSON.stringify({ status: 204, body: null }, null, 2));
      console.log("=======================================\n");
    }
    return new NextResponse(null, { status: 204 });
  }

  const body = await readEnvelope(res);

  if (debug && isOrders) {
    console.log("\n========== [orders] RESPONSE ==========");
    console.log(JSON.stringify({ status: res.status, body }, null, 2));
    console.log("=======================================\n");
  }

  // ── Mint httpOnly cookies from token-bearing responses; the browser never sees a token ──
  if (TOKEN_MINTING_PATHS.has(path) && res.ok) {
    const tokens = extractTokens(body);
    if (tokens?.accessToken && tokens?.refreshToken) {
      await setAuthCookies({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      });
    }
  }

  const responseBody = TOKEN_MINTING_PATHS.has(path) ? stripTokens(body) : body;

  // Debug-only: attach bearer + request/response so the browser can log them on
  // place-order. Never included when NEXT_PUBLIC_DEBUG_MODE / DEBUG_MODE is off.
  if (debug && isPlaceOrder && responseBody && typeof responseBody === "object") {
    const orderDebug = {
      bearerToken: accessToken,
      request: {
        method: request.method,
        path: `/${path}`,
        payload: ordersPayload,
      },
      response: { status: res.status, body },
    };
    const envelope = responseBody as Envelope;
    if (
      envelope.data &&
      typeof envelope.data === "object" &&
      !Array.isArray(envelope.data)
    ) {
      return NextResponse.json(
        {
          ...envelope,
          data: {
            ...(envelope.data as Record<string, unknown>),
            _debug: orderDebug,
          },
        },
        { status: res.status },
      );
    }
    return NextResponse.json(
      { ...responseBody, _debug: orderDebug },
      { status: res.status },
    );
  }

  return NextResponse.json(responseBody ?? {}, { status: res.status });
}

export {
  handle as GET,
  handle as POST,
  handle as PUT,
  handle as PATCH,
  handle as DELETE,
};
