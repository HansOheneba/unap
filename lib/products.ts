// ─────────────────────────────────────────────────────────────────────────────
// Storefront product layer — thin adapter over the real catalog API
// (`lib/api/catalog.ts`). No mock data: every export here fetches from
// `https://api.unapologeticnm.com` (via the same-origin proxy in the browser).
// ─────────────────────────────────────────────────────────────────────────────

import { cache } from "react";
import {
  getCatalog,
  getCollection as fetchCollection,
  getProduct as fetchProduct,
  getRelatedProducts as fetchRelatedProducts,
  searchProducts as fetchSearchProducts,
  type ApiGender,
  type ApiProductDetail,
  type ApiProductSummary,
  type ApiProductVariant,
  type ApiReview,
} from "@/lib/api/catalog";
import { logPricing } from "@/lib/api/pricing-log";
import {
  resolveImageUrl,
  STOREFRONT_FALLBACK_IMAGE as FALLBACK_IMAGE,
} from "@/lib/media/resolve-image-url";

/**
 * The API currently serializes `product.collectionId` as an internal UUID while
 * routing uses the public collection slug (e.g. `"freedom"`).
 *
 * Prefer a single `GET /catalog` to build the map. Only fall back to per-
 * collection detail fetches when product UUIDs are not present on collection rows.
 */
const getCollectionSlugLookup = cache(
  async (): Promise<Map<string, string>> => {
    const { collections, products } = await getCatalog();
    const lookup = new Map<string, string>();
    for (const collection of collections) {
      lookup.set(collection.id, collection.slug);
      lookup.set(collection.slug, collection.slug);
    }

    const needsBridge = products.some(
      (product) =>
        Boolean(product.collectionId) && !lookup.has(product.collectionId),
    );
    if (!needsBridge) return lookup;

    const withProducts = collections.filter((c) => c.productCount > 0);
    const details = await Promise.all(
      withProducts.map((c) => fetchCollection(c.slug)),
    );
    for (const detail of details) {
      if (!detail) continue;
      for (const product of detail.products ?? []) {
        if (product.collectionId) {
          lookup.set(product.collectionId, detail.slug);
        }
      }
    }

    return lookup;
  },
);

export type SizeStock = {
  size: string;
  stock: number;
};

/** Auto-select when a variant has only one size option. */
export function getDefaultSelectedSize(sizes: SizeStock[]): string | null {
  return sizes.length === 1 ? sizes[0].size : null;
}

export type ColorVariant = {
  id: string;
  colorName: string;
  colorHex: string;
  images: string[];
  sizes: SizeStock[];
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  date: string;
  body: string;
  verified: boolean;
};

/** Full product detail — used on the PDP and inside the Quick Add modal. */
export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  gender: ApiGender;
  /** Collection slug, used for routing (`/collections/{category}/{slug}`). */
  category: string;
  subcategory?: string;
  tag: string;
  variants: ColorVariant[];
  details: string[];
  careInstructions: string[];
  reviewSummary: { average: number; count: number };
};

/** Lightweight product row — used on collection grids, search, and previews. */
export type ProductSummary = {
  id: string;
  slug: string;
  name: string;
  price: number;
  gender: ApiGender;
  category: string;
  subcategory?: string;
  tag: string;
  image: string;
};

function toColorVariants(variants: ApiProductVariant[]): ColorVariant[] {
  if (!variants || variants.length === 0) {
    return [
      {
        id: "default",
        colorName: "Default",
        colorHex: "#1a1a1a",
        images: [FALLBACK_IMAGE],
        sizes: [],
      },
    ];
  }
  return variants.map((v, i) => ({
    id: v.id || v.colorName?.toLowerCase().replace(/\s+/g, "-") || `variant-${i}`,
    colorName: v.colorName || "Default",
    colorHex: v.colorHex || "#1a1a1a",
    images: v.imageUrls?.length
      ? v.imageUrls.map((url) => resolveImageUrl(url))
      : [FALLBACK_IMAGE],
    sizes: v.sizes ?? [],
  }));
}

/**
 * Builds the full `Product` shape from the API detail response.
 * `categorySlug` overrides the (currently unreliable) `collectionId` field
 * when the caller already knows the collection from route context.
 */
function toProduct(detail: ApiProductDetail, categorySlug?: string): Product {
  return {
    id: detail.id,
    slug: detail.slug,
    name: detail.name,
    description: detail.description || "",
    price: detail.price,
    gender: detail.gender,
    category: categorySlug || detail.collectionId,
    subcategory: detail.subcategory ?? undefined,
    tag: detail.tag ?? "",
    variants: toColorVariants(detail.variants),
    details: (detail.details ?? []).filter(Boolean),
    careInstructions: (detail.careInstructions ?? []).filter(Boolean),
    reviewSummary: detail.reviewSummary ?? { average: 0, count: 0 },
  };
}

function toSummary(
  product: ApiProductSummary,
  categorySlug?: string,
): ProductSummary {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    gender: product.gender,
    category: categorySlug || product.collectionId,
    subcategory: product.subcategory ?? undefined,
    tag: product.tag ?? "",
    image: resolveImageUrl(product.imageUrl),
  };
}

/** Fetches a single product. `categorySlug` should be passed when already
 *  known from the route (e.g. `/collections/[collection]/[productId]`). */
export async function getProductBySlug(
  slug: string,
  categorySlug?: string,
): Promise<Product | null> {
  const detail = await fetchProduct(slug);
  if (!detail) return null;
  // Log the raw product payload so we can see any location/currency pricing fields.
  logPricing("product.detail.response", detail);
  if (categorySlug) return toProduct(detail, categorySlug);
  const lookup = await getCollectionSlugLookup();
  return toProduct(detail, lookup.get(detail.collectionId));
}

/** "Related" products from the API, assumed to share the current product's
 *  collection for routing purposes. */
export async function getRelatedProducts(
  product: Pick<Product, "slug" | "category">,
  limit = 4,
): Promise<ProductSummary[]> {
  const related = await fetchRelatedProducts(product.slug);
  return related.slice(0, limit).map((p) => toSummary(p, product.category));
}

export type CollectionInfo = {
  /** Collection slug — also used as the routing segment. */
  id: string;
  subtitle: string;
  title: string;
  tagline: string;
  featured: string;
  href: string;
};

/** Fetches a collection (by slug) with its products nested. Returns `null`
 *  when the collection doesn't exist so callers can call `notFound()`. */
export async function getCollectionWithProducts(slug: string): Promise<{
  collection: CollectionInfo;
  products: ProductSummary[];
} | null> {
  const detail = await fetchCollection(slug);
  if (!detail) return null;
  const products = (detail.products ?? [])
    .filter((p) => p.isActive !== false)
    .map((p) => toSummary(p, detail.slug));
  return {
    collection: {
      id: detail.slug,
      subtitle: detail.subtitle,
      title: detail.title,
      tagline: detail.tagline,
      featured: resolveImageUrl(detail.featuredImageUrl),
      href: `/collections/${detail.slug}`,
    },
    products,
  };
}

/** All active collections with their products, in `sortOrder`. Used by the
 *  "browse everything" page. Prefers a single `GET /catalog` when product
 *  `collectionId` values match collection ids; otherwise falls back to
 *  per-collection detail fetches. */
export async function getAllCollectionsWithProducts(): Promise<
  { collection: CollectionInfo; products: ProductSummary[] }[]
> {
  const { collections, products } = await getCatalog();
  const sorted = [...collections]
    .filter((c) => c.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const byCollectionId = new Map<string, ApiProductSummary[]>();
  for (const product of products) {
    if (product.isActive === false || !product.collectionId) continue;
    const bucket = byCollectionId.get(product.collectionId);
    if (bucket) bucket.push(product);
    else byCollectionId.set(product.collectionId, [product]);
  }

  const catalogGroupsCleanly =
    products.length === 0 ||
    sorted.some(
      (c) =>
        (byCollectionId.get(c.id)?.length ?? 0) > 0 ||
        (byCollectionId.get(c.slug)?.length ?? 0) > 0,
    );

  if (catalogGroupsCleanly) {
    return sorted.map((c) => {
      const rows =
        byCollectionId.get(c.id) ?? byCollectionId.get(c.slug) ?? [];
      return {
        collection: {
          id: c.slug,
          subtitle: c.subtitle,
          title: c.title,
          tagline: c.tagline,
          featured: resolveImageUrl(c.featuredImageUrl),
          href: `/collections/${c.slug}`,
        },
        products: rows.map((p) => toSummary(p, c.slug)),
      };
    });
  }

  const results = await Promise.all(
    sorted.map(async (c) => {
      if (c.productCount === 0) {
        return {
          collection: {
            id: c.slug,
            subtitle: c.subtitle,
            title: c.title,
            tagline: c.tagline,
            featured: resolveImageUrl(c.featuredImageUrl),
            href: `/collections/${c.slug}`,
          },
          products: [] as ProductSummary[],
        };
      }
      return getCollectionWithProducts(c.slug);
    }),
  );
  return results.filter(
    (r): r is { collection: CollectionInfo; products: ProductSummary[] } =>
      r !== null,
  );
}

/** First N active products across the whole catalog, for home page previews.
 *  Uses `GET /catalog` (one call) instead of fetching every collection detail. */
/** Fixed homepage preview order. First four slots stay constant. */
const HOMEPAGE_PINNED_SLUGS = [
  "premium-cotton-boxer-brief-3-mixed",
  "bigband-boxer-briefs-mixed-pack",
  "standard-issue-tee",
  "untamed-bikini",
] as const;

export async function getFeaturedProducts(limit = 4): Promise<ProductSummary[]> {
  const [{ products }, lookup] = await Promise.all([
    getCatalog(),
    getCollectionSlugLookup(),
  ]);

  const active = products.filter((p) => p.isActive !== false);
  const bySlug = new Map(active.map((p) => [p.slug, p]));

  const pinned = HOMEPAGE_PINNED_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (p): p is NonNullable<typeof p> => p != null,
  );
  const pinnedSlugs = new Set(pinned.map((p) => p.slug));
  const rest = active.filter((p) => !pinnedSlugs.has(p.slug));

  // Homepage (limit 4) is always the pinned set. Higher limits (e.g. cart)
  // append other active products after the pins.
  return [...pinned, ...rest]
    .slice(0, limit)
    .map((p) => toSummary(p, lookup.get(p.collectionId)));
}

export function toReview(review: ApiReview): Review {
  return {
    id: review.id,
    author: review.author || "Anonymous",
    rating: review.rating,
    date: review.createdAt
      ? new Date(review.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "",
    body: review.body,
    verified: review.verified,
  };
}

export async function searchProductSummaries(params: {
  q?: string;
  collectionId?: string;
  gender?: string;
  page?: number;
  limit?: number;
}): Promise<{ items: ProductSummary[]; total: number; totalPages: number }> {
  // `GET /products/search?collectionId=` matches the internal UUID, not the
  // public slug the UI passes (e.g. `"freedom"`). Scope via collection detail.
  if (params.collectionId) {
    const section = await getCollectionWithProducts(params.collectionId);
    if (!section) return { items: [], total: 0, totalPages: 0 };

    const query = params.q?.trim().toLowerCase();
    let items = section.products;
    if (query) {
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.slug.toLowerCase().includes(query) ||
          p.tag.toLowerCase().includes(query),
      );
    }
    if (params.gender) {
      items = items.filter((p) => p.gender === params.gender);
    }

    const total = items.length;
    const limit = params.limit ?? total;
    const page = params.page ?? 1;
    const start = (page - 1) * limit;
    return {
      items: items.slice(start, start + limit),
      total,
      totalPages: limit > 0 ? Math.max(1, Math.ceil(total / limit)) : 1,
    };
  }

  const [result, lookup] = await Promise.all([
    fetchSearchProducts(params),
    getCollectionSlugLookup(),
  ]);
  return {
    items: result.items.map((p) =>
      toSummary(p, lookup.get(p.collectionId)),
    ),
    total: result.total,
    totalPages: result.totalPages,
  };
}
