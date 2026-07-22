import { create } from "zustand";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  type ApiWishlistItem,
} from "@/lib/api/wishlist";
import { toast } from "@/lib/stores/toast-store";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  img: string;
  category: string;
  slug: string;
}

/** Catalog product key sent to the API (`productId` = slug). */
function productKey(item: Pick<WishlistItem, "id" | "slug">): string {
  return item.slug || item.id;
}

function isSameProduct(
  a: Pick<WishlistItem, "id" | "slug">,
  b: Pick<WishlistItem, "id" | "slug">,
): boolean {
  return (
    a.id === b.id ||
    a.id === b.slug ||
    a.slug === b.id ||
    (!!a.slug && !!b.slug && a.slug === b.slug)
  );
}

function fromApi(item: ApiWishlistItem): WishlistItem {
  // Live API may return a row UUID as `id` and the catalog slug as
  // `productId`/`slug`. Always key the UI by the catalog product id.
  const id = item.productId || item.slug || item.id;
  return {
    id,
    name: item.name,
    price: typeof item.price === "number" ? item.price : 0,
    img: item.imageUrl || "",
    category: item.category || "",
    slug: item.slug || item.productId || item.id,
  };
}

interface WishlistState {
  items: WishlistItem[];
  hydrated: boolean;
  hydrating: boolean;
  pending: number;
  /** Bumps on every local mutation so an in-flight GET cannot clobber newer state. */
  mutationEpoch: number;
  hydrate: () => Promise<void>;
  toggle: (item: WishlistItem) => void;
  remove: (id: string) => void;
  has: (productId: string, slug?: string) => boolean;
}

/**
 * Authenticated wishlist cache. Mutations are optimistic; an in-flight
 * `hydrate()` must never wipe a just-added item (that was the "adds then
 * instantly unadds" bug).
 */
export const useWishlistStore = create<WishlistState>()((set, get) => ({
  items: [],
  hydrated: false,
  hydrating: false,
  pending: 0,
  mutationEpoch: 0,

  has: (productId, slug) =>
    get().items.some(
      (i) =>
        i.id === productId ||
        i.slug === productId ||
        (!!slug && (i.id === slug || i.slug === slug)),
    ),

  hydrate: async () => {
    if (get().hydrated || get().hydrating) return;
    set({ hydrating: true });
    const epochAtStart = get().mutationEpoch;
    try {
      const apiItems = await getWishlist();
      // Stale GET: user toggled while this request was in flight (including
      // the case where the mutation already finished and pending is back to 0).
      if (
        get().pending > 0 ||
        get().mutationEpoch !== epochAtStart
      ) {
        set({ hydrating: false, hydrated: true });
        return;
      }
      set({
        items: apiItems.map(fromApi),
        hydrating: false,
        hydrated: true,
      });
    } catch {
      set({ hydrating: false, hydrated: true });
    }
  },

  toggle: (item) => {
    const key = productKey(item);
    const exists = get().items.some((i) => isSameProduct(i, item));

    set({
      pending: get().pending + 1,
      mutationEpoch: get().mutationEpoch + 1,
      items: exists
        ? get().items.filter((i) => !isSameProduct(i, item))
        : [...get().items.filter((i) => !isSameProduct(i, item)), item],
    });

    const request = exists ? removeFromWishlist(key) : addToWishlist(key);

    void request
      .then((result) => {
        if (!exists && result && typeof result === "object") {
          const normalized = fromApi(result as ApiWishlistItem);
          set((state) => ({
            pending: Math.max(0, state.pending - 1),
            items: [
              ...state.items.filter((i) => !isSameProduct(i, item)),
              { ...item, ...normalized, id: key, slug: item.slug || key },
            ],
          }));
          return;
        }
        set((state) => ({ pending: Math.max(0, state.pending - 1) }));
      })
      .catch((err: unknown) => {
        set((state) => ({
          pending: Math.max(0, state.pending - 1),
          mutationEpoch: state.mutationEpoch + 1,
          items: exists
            ? [...state.items.filter((i) => !isSameProduct(i, item)), item]
            : state.items.filter((i) => !isSameProduct(i, item)),
        }));
        toast.error(
          exists
            ? "Could not remove from wishlist"
            : "Could not save to wishlist",
          err instanceof Error ? err.message : "Please try again.",
        );
      });
  },

  remove: (id) => {
    const removed = get().items.find((i) => i.id === id || i.slug === id);
    if (!removed) return;
    const key = productKey(removed);
    set({
      pending: get().pending + 1,
      mutationEpoch: get().mutationEpoch + 1,
      items: get().items.filter((i) => !isSameProduct(i, removed)),
    });
    void removeFromWishlist(key)
      .then(() => {
        set((state) => ({ pending: Math.max(0, state.pending - 1) }));
      })
      .catch((err: unknown) => {
        set((state) => ({
          pending: Math.max(0, state.pending - 1),
          mutationEpoch: state.mutationEpoch + 1,
          items: [...state.items, removed],
        }));
        toast.error(
          "Could not remove from wishlist",
          err instanceof Error ? err.message : "Please try again.",
        );
      });
  },
}));
