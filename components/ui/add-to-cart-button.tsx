"use client";

import { useRef, useState, useEffect } from "react";
import { useAnimate } from "framer-motion";
import { ShoppingBag, Package, Check } from "lucide-react";
import { useCartStore, type CartItem } from "@/lib/stores/cart-store";

type Props = Omit<CartItem, "quantity">;

type Phase = "idle" | "running" | "done";

export default function AddToCartButton(props: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [phase, setPhase] = useState<Phase>("idle");
  const cartIconRef = useRef<HTMLDivElement>(null);
  const boxIconRef = useRef<HTMLDivElement>(null);
  const [, animate] = useAnimate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (phase !== "idle") return;
    addItem(props);
    setPhase("running");
  };

  useEffect(() => {
    if (phase !== "running") return;
    let timeoutId: ReturnType<typeof setTimeout>;

    const run = async () => {
      if (!cartIconRef.current || !boxIconRef.current) return;

      // Cart slides left → centre → right
      animate(
        cartIconRef.current,
        { x: ["-200%", "0%", "0%", "200%"] },
        { duration: 1.1, times: [0, 0.38, 0.56, 1], ease: "easeInOut" },
      );

      // Box drops from above when cart is at centre, then follows cart right
      await animate(
        boxIconRef.current,
        { x: ["0%", "0%", "200%"], y: ["-260%", "0%", "0%"] },
        { duration: 1.1, times: [0, 0.45, 1], ease: "easeInOut" },
      );

      setPhase("done");
      timeoutId = setTimeout(() => setPhase("idle"), 1500);
    };

    run();
    return () => clearTimeout(timeoutId);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <button
      onClick={handleClick}
      disabled={phase !== "idle"}
      className={`relative w-full py-2.5 overflow-hidden text-[0.6rem] tracking-widest uppercase transition-colors duration-300 ${
        phase === "done"
          ? "bg-white text-black"
          : "bg-black/60 backdrop-blur-sm border border-white/30 text-white"
      }`}
    >
      {/* "Add to Cart" label — visible only in idle */}
      <span
        className={`flex items-center justify-center transition-opacity duration-150 ${
          phase === "idle" ? "opacity-100" : "opacity-0"
        }`}
      >
        Add to Cart
      </span>

      {/* Animated icons — mounted only while running */}
      {phase === "running" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            ref={cartIconRef}
            className="absolute"
            style={{ transform: "translateX(-200%)" }}
          >
            <ShoppingBag size={15} strokeWidth={1.5} />
          </div>
          <div
            ref={boxIconRef}
            className="absolute"
            style={{ transform: "translateX(0%) translateY(-260%)" }}
          >
            <Package size={11} strokeWidth={1.5} />
          </div>
        </div>
      )}

      {/* "Added ✓" — visible only in done */}
      <span
        className={`absolute inset-0 flex items-center justify-center gap-1.5 transition-opacity duration-200 ${
          phase === "done" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <Check size={11} strokeWidth={2.5} />
        Added
      </span>
    </button>
  );
}
