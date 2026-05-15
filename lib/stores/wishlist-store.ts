import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  img: string;
  category: string;
  slug: string;
}

interface WishlistState {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  remove: (id: string) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) => {
        const exists = get().items.some((i) => i.id === item.id);
        set({
          items: exists
            ? get().items.filter((i) => i.id !== item.id)
            : [...get().items, item],
        });
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
    }),
    { name: "unap-wishlist" },
  ),
);
