/**
 * Debug flag for local diagnostics (e.g. order request/response logging).
 * Prefer NEXT_PUBLIC_DEBUG_MODE so the browser bundle can read it;
 * DEBUG_MODE is still accepted on the server.
 */
export function isDebugMode(): boolean {
  return (
    process.env.NEXT_PUBLIC_DEBUG_MODE === "true" ||
    process.env.DEBUG_MODE === "true"
  );
}
