/**
 * Pre-order helpers.
 *
 * API: `isPreorder` + `availableDate` on product summaries/details.
 * Pre-order sizes may report 0 stock (item not in warehouse yet) but remain buyable.
 * Checkout requires online payment (Paystack) for any cart that includes a pre-order.
 */

/** Cap when the catalog reports 0 stock on a pre-order size. */
export const PREORDER_FALLBACK_MAX_QTY = 10;

export function getOrderableStock(stock: number, isPreorder: boolean): number {
  const normalized =
    Number.isFinite(stock) && stock > 0 ? Math.floor(stock) : 0;
  if (normalized > 0) return normalized;
  return isPreorder ? PREORDER_FALLBACK_MAX_QTY : 0;
}

/** e.g. "20 Aug 2026" — null when missing/invalid. */
export function formatAvailableDate(
  availableDate: string | null | undefined,
): string | null {
  if (!availableDate) return null;
  const date = new Date(availableDate);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function preorderShipsLabel(
  availableDate: string | null | undefined,
): string {
  const formatted = formatAvailableDate(availableDate);
  return formatted ? `Ships from ${formatted}` : "Ships when available";
}
