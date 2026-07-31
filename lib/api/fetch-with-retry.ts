/**
 * Resilient fetch for upstream API calls from Vercel/Node.
 *
 * `UND_ERR_SOCKET` / "other side closed" is common when undici reuses a
 * keep-alive connection the origin already dropped. Brief retries absorb
 * those blips without failing the whole SSR render.
 */

const TRANSIENT_CODES = new Set([
  "UND_ERR_SOCKET",
  "UND_ERR_CONNECT_TIMEOUT",
  "UND_ERR_HEADERS_TIMEOUT",
  "UND_ERR_BODY_TIMEOUT",
  "ECONNRESET",
  "ETIMEDOUT",
  "ECONNREFUSED",
  "EPIPE",
  "EAI_AGAIN",
  "ENOTFOUND",
]);

function errorCode(err: unknown): string | undefined {
  if (!err || typeof err !== "object") return undefined;
  const direct = (err as { code?: unknown }).code;
  if (typeof direct === "string") return direct;
  const cause = (err as { cause?: unknown }).cause;
  if (cause && typeof cause === "object") {
    const nested = (cause as { code?: unknown }).code;
    if (typeof nested === "string") return nested;
  }
  return undefined;
}

export function isTransientFetchError(err: unknown): boolean {
  const code = errorCode(err);
  if (code && TRANSIENT_CODES.has(code)) return true;

  if (!(err instanceof Error)) return false;
  const message = err.message.toLowerCase();
  const causeMessage =
    err.cause instanceof Error ? err.cause.message.toLowerCase() : "";

  return (
    message.includes("fetch failed") ||
    message.includes("other side closed") ||
    message.includes("socket") ||
    causeMessage.includes("other side closed") ||
    causeMessage.includes("socket")
  );
}

type RetryOptions = {
  /** Extra attempts after the first try. Default 2 (3 attempts total). */
  retries?: number;
  baseDelayMs?: number;
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
  options: RetryOptions = {},
): Promise<Response> {
  const retries = options.retries ?? 2;
  const baseDelayMs = options.baseDelayMs ?? 175;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetch(input, init);
    } catch (err) {
      lastError = err;
      if (
        attempt >= retries ||
        init?.signal?.aborted ||
        !isTransientFetchError(err)
      ) {
        throw err;
      }
      await delay(baseDelayMs * 2 ** attempt + Math.random() * 75);
    }
  }

  throw lastError;
}
