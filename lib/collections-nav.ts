import type { ApiCollection } from "@/lib/api/catalog";

export type CollectionNavItem = {
  label: string;
  href: string;
};

/** Active collections as header/search nav items, sorted by API `sortOrder`. */
export function toCollectionNavItems(
  collections: ApiCollection[],
): CollectionNavItem[] {
  return [...collections]
    .filter((c) => c.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((c) => ({
      label: c.subtitle,
      href: `/collections/${c.slug}`,
    }));
}

/** Slug from a nav href like `/collections/boxers`. */
export function collectionSlugFromHref(href: string): string | null {
  const match = /^\/collections\/([^/]+)$/.exec(href);
  return match?.[1] ?? null;
}
