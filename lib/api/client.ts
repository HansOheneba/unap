/**
 * Shared storefront API client. All browser requests go through our own
 * same-origin proxy (`/api/backend/*`), which:
 *   - avoids CORS (the real API has no Access-Control-Allow-Origin)
 *   - attaches the Bearer token server-side from an httpOnly cookie
 *   - never exposes access/refresh tokens to client JavaScript
 *
 * Responses use { success, data, errors } — always check `success`, not only HTTP status.
 */

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status = 400, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export function getApiBase(): string {
  // Browser must use the same-origin proxy — the API does not allow CORS from localhost.
  if (typeof window !== "undefined") {
    return "/api/backend";
  }

  const base =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "https://api.unapologeticnm.com";
  return base;
}

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string;
  status?: number;
  errors?: unknown;
  error?: { code?: string; message?: string; details?: unknown };
};

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: HeadersInit;
  cache?: RequestCache;
  /** Next.js Data Cache TTL (seconds). Server-side only; ignored in the browser. */
  revalidate?: number | false;
  signal?: AbortSignal;
};

function extractErrorMessage(body: ApiEnvelope<unknown>, fallback: string) {
  if (body.error?.message) return body.error.message;
  if (typeof body.message === "string" && body.message) return body.message;
  if (Array.isArray(body.errors) && body.errors.length > 0) {
    const first = body.errors[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object" && "message" in first) {
      return String((first as { message: unknown }).message);
    }
  }
  return fallback;
}

/**
 * Unwraps Nest envelope `{ success, data }` when present; otherwise returns the body as-is.
 * `data: null` is treated as "no payload" so callers still get the top-level fields
 * (e.g. OTP send returns `{ success, message, expiresInSeconds }` with no `data`).
 */
export function unwrapData<T>(body: ApiEnvelope<T> | T): T {
  if (
    body &&
    typeof body === "object" &&
    "data" in body &&
    (body as ApiEnvelope<T>).data != null
  ) {
    return (body as ApiEnvelope<T>).data as T;
  }
  return body as T;
}

/**
 * List endpoints often return either a bare array or a paginated object
 * (`{ data: T[], meta }`). After `unwrapData`, either shape can land here —
 * always normalize to an array so callers can safely `.map`.
 */
export function asList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as T[];
    if (Array.isArray(obj.items)) return obj.items as T[];
  }
  return [];
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, headers, cache, revalidate, signal } = options;
  const url = `${getApiBase()}${path}`;

  const res = await fetch(url, {
    method,
    signal,
    // Same-origin cookies (httpOnly session) travel automatically — no token
    // handling needed here at all.
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...(revalidate !== undefined
      ? { next: { revalidate } }
      : cache
        ? { cache }
        : {}),
  }).catch((err: unknown) => {
    const message =
      err instanceof Error && err.message
        ? err.message
        : "Failed to reach the API";
    throw new ApiError(
      message.includes("fetch")
        ? "Could not reach the server. Check your connection and try again."
        : message,
      0,
    );
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  let parsed: ApiEnvelope<T> | null = null;
  if (text) {
    try {
      parsed = JSON.parse(text) as ApiEnvelope<T>;
    } catch {
      throw new ApiError("Unexpected response from server", res.status);
    }
  }

  if (parsed && parsed.success === false) {
    const details = parsed.errors ?? parsed.error?.details ?? parsed;
    throw new ApiError(
      extractErrorMessage(parsed, "Request failed"),
      parsed.status ?? res.status,
      attachDebugMeta(details, parsed),
    );
  }

  if (!res.ok) {
    throw new ApiError(
      parsed
        ? extractErrorMessage(parsed, res.statusText || "Request failed")
        : res.statusText || "Request failed",
      res.status,
      attachDebugMeta(
        parsed?.errors ?? parsed?.error?.details ?? parsed,
        parsed,
      ),
    );
  }

  if (!parsed) return undefined as T;
  return unwrapData(parsed);
}

/** Keeps `_debug` reachable on ApiError.details when the envelope used a different errors field. */
function attachDebugMeta(
  details: unknown,
  parsed: ApiEnvelope<unknown> | null,
): unknown {
  if (!parsed || typeof parsed !== "object") return details;
  const topDebug =
    "_debug" in parsed
      ? (parsed as ApiEnvelope<unknown> & { _debug?: unknown })._debug
      : undefined;
  const data = parsed.data;
  const nestedDebug =
    data &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    "_debug" in data
      ? (data as { _debug?: unknown })._debug
      : undefined;
  const debug = topDebug ?? nestedDebug;
  if (debug === undefined) return details;
  if (details && typeof details === "object" && !Array.isArray(details)) {
    return { ...(details as Record<string, unknown>), _debug: debug };
  }
  return { value: details, _debug: debug };
}
