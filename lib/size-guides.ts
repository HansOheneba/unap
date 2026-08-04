/**
 * Product-specific size guides.
 * Resolve by product name / slug / collection — specific product matches
 * win over collection-level fallbacks (e.g. boxers).
 */

export type SizeGuideKey =
  | "boxers"
  | "core-compression-top"
  | "standard-issue-tee"
  | "resolve-tee"
  | "untamed-bikini";

export type SizeGuidePanel = {
  id: string;
  label: string;
  /** Official chart image under /public/size-guide */
  image: string;
  imageAlt: string;
  /** Approximate intrinsic aspect for layout (width / height). */
  aspectRatio: number;
};

export type SizeGuideDefinition = {
  key: SizeGuideKey;
  title: string;
  eyebrow: string;
  note: string;
  /** Interactive waist chart (boxers only). */
  kind: "boxers-table" | "image";
  panels: SizeGuidePanel[];
};

export const SIZE_GUIDES: Record<SizeGuideKey, SizeGuideDefinition> = {
  boxers: {
    key: "boxers",
    title: "Size Chart",
    eyebrow: "Intimates & Boxers",
    note: "Wrap a soft tape around your natural waist. Between sizes? Size up for comfort.",
    kind: "boxers-table",
    panels: [],
  },
  "core-compression-top": {
    key: "core-compression-top",
    title: "Size Chart",
    eyebrow: "Core Compression Top",
    note: "Garment measurements in cm. Due to manual measurement, a deviation of 1-2cm is normal.",
    kind: "image",
    panels: [
      {
        id: "chart",
        label: "Chart",
        image: "/size-guide/core-compression-top.png",
        imageAlt: "Core Compression Top size guide",
        aspectRatio: 1536 / 1024,
      },
    ],
  },
  "standard-issue-tee": {
    key: "standard-issue-tee",
    title: "Size Chart",
    eyebrow: "Standard Issue Tee",
    note: "Garment measurements in cm. Due to manual measurement, a deviation of 1-2cm is normal.",
    kind: "image",
    panels: [
      {
        id: "chart",
        label: "Chart",
        image: "/size-guide/standard-issue-tee.png",
        imageAlt: "Standard Issue Tee size guide",
        aspectRatio: 1717 / 916,
      },
    ],
  },
  "resolve-tee": {
    key: "resolve-tee",
    title: "Size Chart",
    eyebrow: "Resolve Tee",
    note: "Measurements are of the garment laid flat. Due to manual measurement, a deviation of 1-2cm is normal.",
    kind: "image",
    panels: [
      {
        id: "chart",
        label: "Chart",
        image: "/size-guide/resolve-tee.png",
        imageAlt: "Resolve Tee size guide",
        aspectRatio: 1402 / 1122,
      },
    ],
  },
  "untamed-bikini": {
    key: "untamed-bikini",
    title: "Size Chart",
    eyebrow: "Untamed Bikini Set",
    note: "Measurements are of the garment laid flat. Due to manual measurement, a deviation of 1-2cm is normal.",
    kind: "image",
    panels: [
      {
        id: "bra",
        label: "Bra",
        image: "/size-guide/untamed-bikini-bra.png",
        imageAlt: "Untamed Bikini Set bra size guide",
        aspectRatio: 1123 / 1401,
      },
      {
        id: "panties",
        label: "Panties",
        image: "/size-guide/untamed-bikini-panties.png",
        imageAlt: "Untamed Bikini Set panties size guide",
        aspectRatio: 1122 / 1402,
      },
    ],
  },
};

/** Ordered for the public /size-guide page. */
export const SIZE_GUIDE_LIST: SizeGuideDefinition[] = [
  SIZE_GUIDES.boxers,
  SIZE_GUIDES["standard-issue-tee"],
  SIZE_GUIDES["resolve-tee"],
  SIZE_GUIDES["core-compression-top"],
  SIZE_GUIDES["untamed-bikini"],
];

export function isBoxerCollection(categoryOrSlug: string): boolean {
  const key = categoryOrSlug.toLowerCase();
  return (
    key === "boxers" ||
    key === "underwear" ||
    key === "intimates" ||
    key.includes("boxer")
  );
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

type ResolveInput = {
  name?: string;
  slug?: string;
  category?: string;
};

/**
 * Pick the best size guide for a product or collection context.
 * Product-specific keywords beat collection fallbacks.
 */
export function resolveSizeGuide(input: ResolveInput): SizeGuideKey | null {
  const haystack = normalize(
    [input.name, input.slug, input.category].filter(Boolean).join(" "),
  );
  if (!haystack) return null;

  if (
    haystack.includes("untamed") ||
    haystack.includes("bikini") ||
    haystack.includes("lingerie set")
  ) {
    return "untamed-bikini";
  }

  if (
    haystack.includes("core compression") ||
    (haystack.includes("compression") && haystack.includes("top"))
  ) {
    return "core-compression-top";
  }

  if (haystack.includes("standard issue")) {
    return "standard-issue-tee";
  }

  if (
    haystack.includes("resolve tee") ||
    (haystack.includes("resolve") && haystack.includes("tee"))
  ) {
    return "resolve-tee";
  }

  // Slug-only resolve tee (e.g. "resolve-tee")
  const slug = normalize(input.slug ?? "");
  if (slug === "resolve tee" || slug.startsWith("resolve ")) {
    return "resolve-tee";
  }

  if (
    isBoxerCollection(input.category ?? "") ||
    haystack.includes("boxer") ||
    haystack.includes("trunk") ||
    haystack.includes("brief")
  ) {
    // Lace / bikini sets already handled above; keep briefs/trunks on boxers chart
    if (haystack.includes("bikini") || haystack.includes("bodysuit")) {
      return null;
    }
    return "boxers";
  }

  return null;
}

export function getSizeGuide(
  key: SizeGuideKey | null | undefined,
): SizeGuideDefinition | null {
  if (!key) return null;
  return SIZE_GUIDES[key] ?? null;
}
