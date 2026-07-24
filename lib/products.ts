// ─────────────────────────────────────────────────────────────────────────────
// Storefront product layer — thin adapter over the real catalog API
// (`lib/api/catalog.ts`). No mock data: every export here fetches from
// `https://api.unapologeticnm.com` (via the same-origin proxy in the browser).
// ─────────────────────────────────────────────────────────────────────────────

import {
  getCollection as fetchCollection,
  getProduct as fetchProduct,
  getRelatedProducts as fetchRelatedProducts,
  listCollections as fetchCollections,
  searchProducts as fetchSearchProducts,
  type ApiGender,
  type ApiProductDetail,
  type ApiProductSummary,
  type ApiProductVariant,
  type ApiReview,
} from "@/lib/api/catalog";
import { BRAND_PLACEHOLDER } from "@/lib/data/placeholders";

const FALLBACK_IMAGE = BRAND_PLACEHOLDER.textile;

/**
 * The API currently serializes `product.collectionId` as an internal UUID while
 * `collection.id` / `collection.slug` are public slugs (e.g. `"freedom"`).
 * Search filters and PDP routes need the slug. Build a lookup from both.
 */
async function getCollectionSlugLookup(): Promise<Map<string, string>> {
  const collections = await fetchCollections();
  const details = await Promise.all(
    collections.map((c) => fetchCollection(c.slug)),
  );
  const lookup = new Map<string, string>();
  for (let i = 0; i < collections.length; i++) {
    const collection = collections[i];
    const detail = details[i];
    lookup.set(collection.id, collection.slug);
    lookup.set(collection.slug, collection.slug);
    for (const product of detail?.products ?? []) {
      if (product.collectionId) {
        lookup.set(product.collectionId, collection.slug);
      }
    }
  }
  return lookup;
}

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
    images: v.imageUrls?.length ? v.imageUrls : [FALLBACK_IMAGE],
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
    image: product.imageUrl || FALLBACK_IMAGE,
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
      featured: detail.featuredImageUrl || FALLBACK_IMAGE,
      href: `/collections/${detail.slug}`,
    },
    products,
  };
}

/** All active collections with their products, in `sortOrder`. Used by the
 *  "browse everything" page. Skips a collection if its detail fetch fails. */
export async function getAllCollectionsWithProducts(): Promise<
  { collection: CollectionInfo; products: ProductSummary[] }[]
> {
  const collections = await fetchCollections();
  const sorted = [...collections]
    .filter((c) => c.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const results = await Promise.all(
    sorted.map((c) => getCollectionWithProducts(c.slug)),
  );
  return results.filter(
    (r): r is { collection: CollectionInfo; products: ProductSummary[] } =>
      r !== null,
  );
}

/** First N active products across the whole catalog, for home page previews. */
export async function getFeaturedProducts(limit = 4): Promise<ProductSummary[]> {
  // Prefer collection-detail nesting so `category` is the public slug, not the
  // internal UUID currently returned on `product.collectionId`.
  const sections = await getAllCollectionsWithProducts();
  return sections.flatMap((s) => s.products).slice(0, limit);
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
