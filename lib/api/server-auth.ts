/**
 * Server-only session helpers (Route Handlers only — never import from client components).
 *
 * Access + refresh tokens issued by the real API are stored exclusively as httpOnly,
 * Secure, SameSite=Lax cookies set by our own Next.js server. The browser's JavaScript
 * never sees a token, so an XSS bug cannot steal a session by reading localStorage/
 * document.cookie (httpOnly cookies are invisible to JS). This mirrors OWASP guidance
 * for SPA/token-based auth and the Next.js "Backend for Frontend" pattern.
 */
import { cookies } from "next/headers";

export const ACCESS_TOKEN_COOKIE = "unap_at";
export const REFRESH_TOKEN_COOKIE = "unap_rt";

const isProd = process.env.NODE_ENV === "production";

const baseCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax" as const,
  path: "/",
};

const DEFAULT_ACCESS_TOKEN_TTL = 60 * 60; // 1 hour fallback if API omits expiresIn
const REFRESH_TOKEN_TTL = 60 * 60 * 24 * 30; // 30 days — industry-standard refresh lifetime

export const API_ORIGIN = (
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.unapologeticnm.com"
).replace(/\/$/, "");

export async function getAccessToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(REFRESH_TOKEN_COOKIE)?.value ?? null;
}

export async function setAuthCookies(tokens: {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}): Promise<void> {
  const store = await cookies();
  store.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    ...baseCookieOptions,
    maxAge:
      tokens.expiresIn && tokens.expiresIn > 0
        ? tokens.expiresIn
        : DEFAULT_ACCESS_TOKEN_TTL,
  });
  store.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
    ...baseCookieOptions,
    maxAge: REFRESH_TOKEN_TTL,
  });
}

export async function clearAuthCookies(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_TOKEN_COOKIE);
  store.delete(REFRESH_TOKEN_COOKIE);
}

type Envelope<T = unknown> = {
  success?: boolean;
  data?: T;
  message?: string;
  [key: string]: unknown;
};

async function readEnvelope<T>(res: Response): Promise<Envelope<T> | null> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as Envelope<T>;
  } catch {
    return null;
  }
}

/**
 * Exchanges the httpOnly refresh cookie for a new access token, rotating both
 * cookies on success. Returns null (and clears cookies) if the refresh token
 * is missing, invalid, or expired.
 */
export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  const res = await fetch(`${API_ORIGIN}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });

  const body = await readEnvelope<{
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
  }>(res);
  const data = body?.data ?? (body as Record<string, unknown> | null);
  const accessToken = (data as { accessToken?: string } | null)?.accessToken;
  const newRefreshToken = (data as { refreshToken?: string } | null)
    ?.refreshToken;
  const expiresIn = (data as { expiresIn?: number } | null)?.expiresIn;

  if (!res.ok || !accessToken || !newRefreshToken) {
    await clearAuthCookies();
    return null;
  }

  await setAuthCookies({ accessToken, refreshToken: newRefreshToken, expiresIn });
  return accessToken;
}

/** Calls /auth/me with the current access token, refreshing once if it has expired. */
export async function fetchCurrentUser(): Promise<Record<string, unknown> | null> {
  let accessToken = await getAccessToken();
  if (!accessToken) return null;

  const call = (token: string) =>
    fetch(`${API_ORIGIN}/auth/me`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

  let res = await call(accessToken);
  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) return null;
    accessToken = refreshed;
    res = await call(accessToken);
  }

  if (!res.ok) return null;
  const body = await readEnvelope<{ user?: Record<string, unknown> }>(res);
  const data = body?.data ?? (body as Record<string, unknown> | null);
  const user = (data as { user?: Record<string, unknown> } | null)?.user ?? data;
  return (user as Record<string, unknown> | null) ?? null;
}
