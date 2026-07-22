import { apiRequest, asList } from "@/lib/api/client";

/** Matches the `WishlistItem` schema in docs/frontend-api-spec.json. */
export type ApiWishlistItem = {
  id: string;
  productId?: string | null;
  slug?: string | null;
  name: string;
  price: number;
  imageUrl?: string | null;
  category: string;
};

export async function getWishlist(): Promise<ApiWishlistItem[]> {
  const payload = await apiRequest<unknown>("/wishlist", { cache: "no-store" });
  return asList<ApiWishlistItem>(payload);
}

export async function addToWishlist(
  productId: string,
): Promise<ApiWishlistItem> {
  const payload = await apiRequest<unknown>("/wishlist", {
    method: "POST",
    body: { productId },
  });
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    // Some responses nest the created row: `{ data: WishlistItem }`.
    if (
      obj.data &&
      typeof obj.data === "object" &&
      !Array.isArray(obj.data) &&
      ("id" in (obj.data as object) || "productId" in (obj.data as object))
    ) {
      return obj.data as ApiWishlistItem;
    }
    return payload as ApiWishlistItem;
  }
  return { id: productId, name: "", price: 0, category: "", productId };
}

export async function removeFromWishlist(productId: string): Promise<void> {
  await apiRequest<void>(`/wishlist/${encodeURIComponent(productId)}`, {
    method: "DELETE",
  });
}

export async function mergeWishlist(
  productIds: string[],
): Promise<ApiWishlistItem[]> {
  const payload = await apiRequest<unknown>("/wishlist/merge", {
    method: "POST",
    body: { productIds },
  });
  return asList<ApiWishlistItem>(payload);
}
