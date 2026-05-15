import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export interface CartItem {
  id: string; // e.g. "sunglasses-1"
  name: string;
  price: number; // raw number — format with formatPrice() for display
  img: string;
  category: string;
  quantity: number;
}

export interface CartToast {
  key: number;
  item: Omit<CartItem, "quantity">;
}

interface CartState {
  items: CartItem[];
  toast: CartToast | null;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  dismissToast: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        toast: null,

        addItem: (item) => {
          const existing = get().items.find((i) => i.id === item.id);
          if (existing) {
            set({
              items: get().items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
              ),
              toast: { key: Date.now(), item },
            });
          } else {
            set({
              items: [...get().items, { ...item, quantity: 1 }],
              toast: { key: Date.now(), item },
            });
          }
        },

        removeItem: (id) =>
          set({ items: get().items.filter((i) => i.id !== id) }),

        updateQuantity: (id, quantity) => {
          if (quantity < 1) {
            set({ items: get().items.filter((i) => i.id !== id) });
          } else {
            set({
              items: get().items.map((i) =>
                i.id === id ? { ...i, quantity } : i,
              ),
            });
          }
        },

        clearCart: () => set({ items: [] }),

        dismissToast: () => set({ toast: null }),

        totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

        totalPrice: () =>
          get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      }),
      { name: "unap-cart", partialize: (state) => ({ items: state.items }) },
    ),
    { name: "CartStore" },
  ),
);
