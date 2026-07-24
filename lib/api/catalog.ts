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

export async function getCatalog(): Promise<{
  collections: ApiCollection[];
  products: ApiProductSummary[];
}> {
  // Upstream wraps as `{ success, data: { data: { collections, products }, meta } }`.
  // After `apiRequest` unwraps once we get `{ data: { collections, products }, meta }`.
  // Tolerate a flat `{ collections, products }` shape as well.
  const payload = await apiRequest<unknown>("/catalog", { cache: "no-store" });
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

export async function listCollections(): Promise<ApiCollection[]> {
  const payload = await apiRequest<unknown>("/collections", { cache: "no-store" });
  return asList<ApiCollection>(payload);
}

/** Returns `null` (not throw) when the collection slug doesn't exist. */
export async function getCollection(
  slug: string,
): Promise<ApiCollectionDetail | null> {
  try {
    return await apiRequest<ApiCollectionDetail>(
      `/collections/${encodeURIComponent(slug)}`,
      { cache: "no-store" },
    );
  } catch (err) {
    if (isNotFoundError(err)) return null;
    throw err;
  }
}

export async function searchProducts(params: {
  q?: string;
  collectionId?: string;
  gender?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResult<ApiProductSummary>> {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.collectionId) query.set("collectionId", params.collectionId);
  if (params.gender) query.set("gender", params.gender);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  const qs = query.toString();
  const payload = await apiRequest<unknown>(
    `/products/search${qs ? `?${qs}` : ""}`,
    { cache: "no-store" },
  );
  return toPaginated<ApiProductSummary>(payload, params.limit ?? 20);
}

/** Returns `null` (not throw) when the product slug doesn't exist. */
export async function getProduct(slug: string): Promise<ApiProductDetail | null> {
  try {
    return await apiRequest<ApiProductDetail>(
      `/products/${encodeURIComponent(slug)}`,
      { cache: "no-store" },
    );
  } catch (err) {
    if (isNotFoundError(err)) return null;
    throw err;
  }
}

export async function getRelatedProducts(
  slug: string,
): Promise<ApiProductSummary[]> {
  const payload = await apiRequest<unknown>(
    `/products/${encodeURIComponent(slug)}/related`,
    { cache: "no-store" },
  );
  return asList<ApiProductSummary>(payload);
}

export async function listProductReviews(
  slug: string,
  params?: { page?: number; limit?: number },
): Promise<PaginatedResult<ApiReview>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString();
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
