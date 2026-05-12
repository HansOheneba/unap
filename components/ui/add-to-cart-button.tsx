"use client";

import { useState } from "react";
import { useCartStore, type CartItem } from "@/lib/stores/cart-store";

type Props = Omit<CartItem, "quantity">;

export default function AddToCartButton(props: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(props);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full py-2.5 text-[0.6rem] tracking-widest uppercase transition-colors duration-300 ${
        added
          ? "bg-white text-black"
          : "bg-black/60 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-black"
      }`}
    >
      {added ? "Added ✓" : "Add to Cart"}
    </button>
  );
}
