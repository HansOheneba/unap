import { cache } from "react";
import { apiRequest, asList, ApiError } from "@/lib/api/client";

/** Matches the `Gender` enum used across the storefront. */
export type ApiGender = "male" | "female" | null;

/** Row shape returned by `GET /collections` and inside `GET /catalog`. */
export type ApiCollection = {
  id: string;
  slug: string;
  subtitle: string;
  title: string;
  tagline: string;
  featuredImageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
};

/** Lightweight product row used in listings, search, catalog and related. */
export type ApiProductSummary = {
  id: string;
  slug: string;
  name: string;
  price: number;
  gender: ApiGender;
  collectionId: string;
  subcategory: string | null;
  tag: string | null;
  imageUrl: string | null;
  isActive: boolean;
  /** When true, item is sold before warehouse stock arrives. */
  isPreorder?: boolean;
  /** Expected availability / ship date (ISO). Required by API when isPreorder. */
  availableDate?: string | null;
};

/** `GET /collections/:slug` returns the collection with its products nested. */
export type ApiCollectionDetail = ApiCollection & {
  products: ApiProductSummary[];
};

export type ApiProductVariant = {
  id: string;
  colorName: string;
  colorHex: string;
  imageUrls: string[];
  sizes: { size: string; stock: number }[];
};

export type ApiProductDetail = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  gender: ApiGender;
  collectionId: string;
  subcategory: string | null;
  tag: string | null;
  details: string[];
  careInstructions: string[];
  isActive: boolean;
  isPreorder?: boolean;
  availableDate?: string | null;
  variants: ApiProductVariant[];
  reviewSummary: { average: number; count: number };
};

export type ApiReview = {
  id: string;
  author: string;
  rating: number;
  body: string;
  verified: boolean;
  createdAt: string;
};

export type PaginatedResult<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type ApiPage<T> = {
  data: T[];
  meta?: { page?: number; limit?: number; total?: number; totalPages?: number };
};

/**
 * Short in-process TTL + Next revalidate for catalog GETs.
 * Absorbs rapid refreshes / layout remounts without going stale for long
 * after admin creates collections or products. In-flight coalescing ensures
 * parallel callers for the same path share one upstream request.
 */
const CATALOG_REVALIDATE_SECONDS = 20;
const CATALOG_TTL_MS = CATALOG_REVALIDATE_SECONDS * 1000;

type TtlEntry = { expiresAt: number; value: unknown };
const catalogTtlCache = new Map<string, TtlEntry>();
const catalogInflight = new Map<string, Promise<unknown>>();

async function catalogGet<T>(path: string): Promise<T> {
  const hit = catalogTtlCache.get(path);
  if (hit && hit.expiresAt > Date.now()) {
    return hit.value as T;
  }

  const pending = catalogInflight.get(path);
  if (pending) return pending as Promise<T>;

  const request = apiRequest<T>(path, {
    revalidate: CATALOG_REVALIDATE_SECONDS,
  })
    .then((value) => {
      catalogTtlCache.set(path, {
        value,
        expiresAt: Date.now() + CATALOG_TTL_MS,
      });
      catalogInflight.delete(path);
      return value;
    })
    .catch((err: unknown) => {
      catalogInflight.delete(path);
      throw err;
    });

  catalogInflight.set(path, request);
  return request;
}

/** Drop cached catalog reads (e.g. after an admin write once wired up). */
export function clearCatalogCache(): void {
  catalogTtlCache.clear();
}

function toPaginated<T>(payload: unknown, fallbackLimit = 20): PaginatedResult<T> {
  if (payload && typeof payload === "object" && "meta" in payload) {
    const { data, meta } = payload as ApiPage<T>;
    return {
      items: Array.isArray(data) ? data : [],
      page: meta?.page ?? 1,
      limit: meta?.limit ?? fallbackLimit,
      total: meta?.total ?? (Array.isArray(data) ? data.length : 0),
      totalPages: meta?.totalPages ?? 1,
    };
  }
  const items = asList<T>(payload);
  return { items, page: 1, limit: fallbackLimit, total: items.length, totalPages: 1 };
}

/** `true` for a 404 from the catalog API (product/collection not found). */
export function isNotFoundError(err: unknown): boolean {
  return err instanceof ApiError && err.status === 404;
}

function parseCatalogPayload(payload: unknown): {
  collections: ApiCollection[];
  products: ApiProductSummary[];
} {
  // Upstream wraps as `{ success, data: { data: { collections, products }, meta } }`.
  // After `apiRequest` unwraps once we get `{ data: { collections, products }, meta }`.
  // Tolerate a flat `{ collections, products }` shape as well.
  const root =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : {};
  const nested =
    root.data && typeof root.data === "object" && !Array.isArray(root.data)
      ? (root.data as Record<string, unknown>)
      : null;

  const collections = Array.isArray(root.collections)
    ? (root.collections as ApiCollection[])
    : Array.isArray(nested?.collections)
      ? (nested.collections as ApiCollection[])
      : [];
  const products = Array.isArray(root.products)
    ? (root.products as ApiProductSummary[])
    : Array.isArray(nested?.products)
      ? (nested.products as ApiProductSummary[])
      : [];

  return { collections, products };
}

export const getCatalog = cache(async (): Promise<{
  collections: ApiCollection[];
  products: ApiProductSummary[];
}> => {
  const payload = await catalogGet<unknown>("/catalog");
  return parseCatalogPayload(payload);
});

export const listCollections = cache(async (): Promise<ApiCollection[]> => {
  const payload = await catalogGet<unknown>("/collections");
  return asList<ApiCollection>(payload);
});

/** Returns `null` (not throw) when the collection slug doesn't exist. */
export const getCollection = cache(
  async (slug: string): Promise<ApiCollectionDetail | null> => {
    try {
      return await catalogGet<ApiCollectionDetail>(
        `/collections/${encodeURIComponent(slug)}`,
      );
    } catch (err) {
      if (isNotFoundError(err)) return null;
      throw err;
    }
  },
);

export const searchProducts = cache(
  async (params: {
    q?: string;
    collectionId?: string;
    gender?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<ApiProductSummary>> => {
    const query = new URLSearchParams();
    if (params.q) query.set("q", params.q);
    if (params.collectionId) query.set("collectionId", params.collectionId);
    if (params.gender) query.set("gender", params.gender);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    const path = `/products/search${qs ? `?${qs}` : ""}`;
    const payload = await catalogGet<unknown>(path);
    return toPaginated<ApiProductSummary>(payload, params.limit ?? 20);
  },
);

/** Returns `null` (not throw) when the product slug doesn't exist. */
export const getProduct = cache(
  async (slug: string): Promise<ApiProductDetail | null> => {
    try {
      return await catalogGet<ApiProductDetail>(
        `/products/${encodeURIComponent(slug)}`,
      );
    } catch (err) {
      if (isNotFoundError(err)) return null;
      throw err;
    }
  },
);

export const getRelatedProducts = cache(
  async (slug: string): Promise<ApiProductSummary[]> => {
    const payload = await catalogGet<unknown>(
      `/products/${encodeURIComponent(slug)}/related`,
    );
    return asList<ApiProductSummary>(payload);
  },
);

export async function listProductReviews(
  slug: string,
  params?: { page?: number; limit?: number },
): Promise<PaginatedResult<ApiReview>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString();
  // Reviews change with user submissions — do not share a long catalog TTL.
  const payload = await apiRequest<unknown>(
    `/products/${encodeURIComponent(slug)}/reviews${qs ? `?${qs}` : ""}`,
    { cache: "no-store" },
  );
  return toPaginated<ApiReview>(payload, params?.limit ?? 10);
}

export async function submitReview(
  slug: string,
  payload: { rating: number; body: string },
): Promise<ApiReview> {
  return apiRequest<ApiReview>(`/products/${encodeURIComponent(slug)}/reviews`, {
    method: "POST",
    body: payload,
  });
}
