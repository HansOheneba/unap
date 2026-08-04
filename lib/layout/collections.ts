/** Shared content width for all collection pages and chrome. */
export const COLLECTIONS_CONTAINER =
  "max-w-360 mx-auto px-6 md:px-12 lg:px-16";

/**
 * Pick a desktop column count that keeps cards at normal size.
 * Prefer layouts with no leftover of 1 — a lone orphan must not stretch
 * full-width (aspect-ratio cards become absurdly tall when they do).
 */
export function productGridColumns(
  count: number,
  options?: { maxCols?: 3 | 4 },
): 1 | 2 | 3 | 4 {
  const maxCols = options?.maxCols ?? 4;

  if (count <= 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  if (maxCols === 3) {
    // Avoid rem 1 when possible (4 → 2-col, 5 → 3-col with rem 2)
    if (count % 3 === 1) return 2;
    return 3;
  }

  // Prefer 4, then 3, then 2 — skip any option that leaves a single orphan
  for (const cols of [4, 3, 2] as const) {
    if (count % cols !== 1) return cols;
  }
  return 3;
}
