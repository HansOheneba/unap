/**
 * Temporary diagnostics for location-based / dynamic pricing.
 * Logs at each step from product → cart → checkout → order completion
 * so we can see the API shape before wiring the UI.
 */
export function logPricing(stage: string, payload: unknown): void {
  console.log(`[pricing:${stage}]`, payload);
}
