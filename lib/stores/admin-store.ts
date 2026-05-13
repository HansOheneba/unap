import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { DEFAULT_COLLECTIONS } from "@/lib/data/collections";
import type { Collection, Product } from "@/lib/data/types";

interface AdminState {
  collections: Collection[];

  // Collection actions
  addCollection: (col: Omit<Collection, "products">) => void;
  updateCollection: (
    id: string,
    updates: Partial<Omit<Collection, "id" | "products">>,
  ) => void;
  removeCollection: (id: string) => void;

  // Product actions
  addProduct: (collectionId: string, product: Product) => void;
  updateProduct: (
    productId: string,
    updates: Partial<Omit<Product, "id" | "collectionId">>,
  ) => void;
  removeProduct: (productId: string) => void;

  // Selectors (computed helpers)
  getCollection: (id: string) => Collection | undefined;
  getProduct: (productId: string) => Product | undefined;
  allProducts: () => Product[];
}

export const useAdminStore = create<AdminState>()(
  devtools(
    persist(
      (set, get) => ({
        collections: DEFAULT_COLLECTIONS,

        // ── Collections ────────────────────────────────────────────────────
        addCollection: (col) =>
          set({
            collections: [...get().collections, { ...col, products: [] }],
          }),

        updateCollection: (id, updates) =>
          set({
            collections: get().collections.map((c) =>
              c.id === id ? { ...c, ...updates } : c,
            ),
          }),

        removeCollection: (id) =>
          set({
            collections: get().collections.filter((c) => c.id !== id),
          }),

        // ── Products ───────────────────────────────────────────────────────
        addProduct: (collectionId, product) =>
          set({
            collections: get().collections.map((c) =>
              c.id === collectionId
                ? { ...c, products: [...c.products, product] }
                : c,
            ),
          }),

        updateProduct: (productId, updates) =>
          set({
            collections: get().collections.map((c) => ({
              ...c,
              products: c.products.map((p) =>
                p.id === productId ? { ...p, ...updates } : p,
              ),
            })),
          }),

        removeProduct: (productId) =>
          set({
            collections: get().collections.map((c) => ({
              ...c,
              products: c.products.filter((p) => p.id !== productId),
            })),
          }),

        // ── Selectors ──────────────────────────────────────────────────────
        getCollection: (id) => get().collections.find((c) => c.id === id),

        getProduct: (productId) => {
          for (const col of get().collections) {
            const p = col.products.find((p) => p.id === productId);
            if (p) return p;
          }
          return undefined;
        },

        allProducts: () => get().collections.flatMap((c) => c.products),
      }),
      { name: "unap-admin" },
    ),
    { name: "AdminStore" },
  ),
);
