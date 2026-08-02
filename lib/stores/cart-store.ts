import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { logPricing } from "@/lib/api/pricing-log";

export interface CartItem {
  id: string; // `${productId}__${variantId}__${size}`
  name: string;
  price: number; // raw number — format with formatPrice() for display
  img: string;
  category: string;
  quantity: number;
  /** Catalog stock for this variant/size. Caps quantity. */
  stock: number;
  /** Product slug — used to revalidate stock from the API. */
  slug: string;
}

export interface CartToast {
  key: number;
  item: Omit<CartItem, "quantity">;
  /** Quantity added in this action (not the cart line total). */
  quantity: number;
}

export type AddItemResult = {
  added: number;
  quantityInCart: number;
  stock: number;
};

type CartItemInput = Omit<CartItem, "quantity">;

interface CartState {
  items: CartItem[];
  toast: CartToast | null;
  addItem: (item: CartItemInput, quantity?: number) => AddItemResult;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  /** Refresh stock from catalog and clamp quantity (removes line if stock is 0). */
  setItemStock: (
    id: string,
    stock: number,
    slug?: string,
  ) => {
    previousQuantity: number;
    quantity: number;
    removed: boolean;
  } | null;
  /** Apply server-quoted unit price (location / catalog pricing). */
  setItemPrice: (id: string, price: number) => void;
  clearCart: () => void;
  dismissToast: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  getLineQuantity: (id: string) => number;
}

function normalizeStock(stock: number): number {
  if (!Number.isFinite(stock)) return 0;
  return Math.max(0, Math.floor(stock));
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        toast: null,

        addItem: (item, quantity = 1) => {
          const stock = normalizeStock(item.stock);
          const requested = Math.max(1, Math.floor(quantity));
          const existing = get().items.find((i) => i.id === item.id);
          const currentQty = existing?.quantity ?? 0;
          const nextQty = Math.min(stock, currentQty + requested);
          const added = Math.max(0, nextQty - currentQty);

          const line: CartItemInput = {
            ...item,
            stock,
            slug: item.slug,
          };

          if (added <= 0) {
            if (existing) {
              set({
                items: get().items.map((i) =>
                  i.id === item.id
                    ? { ...i, stock, slug: item.slug, img: item.img, name: item.name, price: item.price }
                    : i,
                ),
              });
            }
            return { added: 0, quantityInCart: currentQty, stock };
          }

          if (existing) {
            set({
              items: get().items.map((i) =>
                i.id === item.id
                  ? {
                      ...i,
                      ...line,
                      quantity: nextQty,
                    }
                  : i,
              ),
              toast: { key: Date.now(), item: line, quantity: added },
            });
          } else {
            set({
              items: [...get().items, { ...line, quantity: nextQty }],
              toast: { key: Date.now(), item: line, quantity: added },
            });
          }

          const cartItems = get().items;
          logPricing("cart.add", {
            line: {
              id: line.id,
              name: line.name,
              price: line.price,
              category: line.category,
              slug: line.slug,
              stock: line.stock,
            },
            requested,
            added,
            quantityInCart: nextQty,
            cartSubtotal: cartItems.reduce(
              (sum, i) => sum + i.price * i.quantity,
              0,
            ),
            lines: cartItems.map((i) => ({
              id: i.id,
              price: i.price,
              quantity: i.quantity,
            })),
          });

          return { added, quantityInCart: nextQty, stock };
        },

        removeItem: (id) =>
          set({ items: get().items.filter((i) => i.id !== id) }),

        updateQuantity: (id, quantity) => {
          const item = get().items.find((i) => i.id === id);
          if (!item) return;

          if (quantity < 1) {
            set({ items: get().items.filter((i) => i.id !== id) });
            return;
          }

          const stock =
            typeof item.stock === "number" && Number.isFinite(item.stock)
              ? normalizeStock(item.stock)
              : quantity;
          const next = Math.min(Math.floor(quantity), stock);

          if (next < 1) {
            set({ items: get().items.filter((i) => i.id !== id) });
            return;
          }

          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity: next } : i,
            ),
          });
        },

        setItemStock: (id, stock, slug) => {
          const item = get().items.find((i) => i.id === id);
          if (!item) return null;

          const nextStock = normalizeStock(stock);
          const previousQuantity = item.quantity;
          const nextQty = Math.min(item.quantity, nextStock);
          const nextSlug = slug || item.slug;

          if (nextStock <= 0 || nextQty < 1) {
            set({ items: get().items.filter((i) => i.id !== id) });
            return { previousQuantity, quantity: 0, removed: true };
          }

          set({
            items: get().items.map((i) =>
              i.id === id
                ? { ...i, stock: nextStock, quantity: nextQty, slug: nextSlug }
                : i,
            ),
          });

          return {
            previousQuantity,
            quantity: nextQty,
            removed: false,
          };
        },

        setItemPrice: (id, price) => {
          if (!Number.isFinite(price) || price < 0) return;
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, price } : i,
            ),
          });
        },

        clearCart: () => set({ items: [] }),

        dismissToast: () => set({ toast: null }),

        totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

        totalPrice: () =>
          get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

        getLineQuantity: (id) =>
          get().items.find((i) => i.id === id)?.quantity ?? 0,
      }),
      {
        name: "unap-cart",
        partialize: (state) => ({ items: state.items }),
        merge: (persisted, current) => {
          const persistedState = persisted as Partial<CartState> | undefined;
          const rawItems = persistedState?.items ?? [];
          // Backfill stock/slug for carts saved before stock awareness.
          const items: CartItem[] = rawItems.map((item) => ({
            ...item,
            stock:
              typeof item.stock === "number" && Number.isFinite(item.stock)
                ? normalizeStock(item.stock)
                : Number.MAX_SAFE_INTEGER,
            slug: typeof item.slug === "string" ? item.slug : "",
          }));
          return { ...current, ...persistedState, items };
        },
      },
    ),
    { name: "CartStore" },
  ),
);
