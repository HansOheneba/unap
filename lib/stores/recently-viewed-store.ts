import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export type RecentlyViewedItem = {
  id: string;
  slug: string;
  name: string;
  img: string;
  price: number;
  category: string;
};

type RecentlyViewedState = {
  items: RecentlyViewedItem[];
  addItem: (item: RecentlyViewedItem) => void;
  clear: () => void;
};

const MAX_ITEMS = 6;

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  devtools(
    persist(
      (set) => ({
        items: [],
        addItem: (item) =>
          set((state) => {
            const filtered = state.items.filter((i) => i.id !== item.id);
            return { items: [item, ...filtered].slice(0, MAX_ITEMS) };
          }),
        clear: () => set({ items: [] }),
      }),
      { name: "unap-recently-viewed" },
    ),
    { name: "RecentlyViewedStore" },
  ),
);
