// ─────────────────────────────────────────────────────────────────────────────
// Currency configuration — change this to update across the entire app.
// ─────────────────────────────────────────────────────────────────────────────

export const CURRENCY = {
  code: "GHS",
  symbol: "₵",
  locale: "en-GH",
} as const;

/**
 * Format a numeric price for display.
 * e.g. formatPrice(145) → "₵145"
 *      formatPrice(1500) → "₵1,500"
 */
export function formatPrice(amount: number): string {
  return `${CURRENCY.symbol}${amount.toLocaleString(CURRENCY.locale)}`;
}
