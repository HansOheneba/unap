"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Check, ArrowRight, ShoppingBag, Package } from "lucide-react";
import { useAnimate } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { useCartStore } from "@/lib/stores/cart-store";
import { formatPrice } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { Product, ColorVariant } from "@/lib/products";

const LIGHT_HEXES = new Set(["#f0f0f0", "#f0e6ce", "#e8dcc8", "#f5f5f5"]);

type Phase = "idle" | "running" | "done";

type Props = {
  product: Product;
  open: boolean;
  onClose: () => void;
};

export default function QuickAddModal({ product, open, onClose }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [selectedVariant, setSelectedVariant] = useState<ColorVariant>(
    product.variants[0],
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const cartIconRef = useRef<HTMLDivElement>(null);
  const boxIconRef = useRef<HTMLDivElement>(null);
  const [, animate] = useAnimate();

  // Reset when modal opens (handles re-opening for same or different product)
  useEffect(() => {
    if (!open) return;
    setSelectedVariant(product.variants[0]);
    setSelectedSize(null);
    setPhase("idle");
  }, [open, product.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleColorChange = (variant: ColorVariant) => {
    setSelectedVariant(variant);
    // Clear size if it's OOS in the newly selected color
    if (selectedSize) {
      const stillAvailable = variant.sizes.some(
        (s) => s.size === selectedSize && s.stock > 0,
      );
      if (!stillAvailable) setSelectedSize(null);
    }
  };

  // Per color+size stock info
  const sizeData = selectedVariant.sizes.find((s) => s.size === selectedSize);
  const currentStock = sizeData?.stock ?? 0;
  const isOutOfStock = !!selectedSize && currentStock === 0;
  const isLowStock = !!selectedSize && currentStock > 0 && currentStock <= 4;
  const canAdd = !!selectedSize && !isOutOfStock && phase === "idle";

  // Cart animation (same choreography as AddToCartButton)
  useEffect(() => {
    if (phase !== "running") return;
    let timeoutId: ReturnType<typeof setTimeout>;

    const run = async () => {
      if (!cartIconRef.current || !boxIconRef.current) return;

      animate(
        cartIconRef.current,
        { x: ["-200%", "0%", "0%", "200%"] },
        { duration: 1.0, times: [0, 0.38, 0.56, 1], ease: "easeInOut" },
      );
      await animate(
        boxIconRef.current,
        { x: ["0%", "0%", "200%"], y: ["-260%", "0%", "0%"] },
        { duration: 1.0, times: [0, 0.45, 1], ease: "easeInOut" },
      );

      setPhase("done");
      timeoutId = setTimeout(() => {
        onClose();
        setPhase("idle");
      }, 900);
    };

    run();
    return () => clearTimeout(timeoutId);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddToCart = () => {
    if (!canAdd) return;
    addItem({
      id: `${product.id}__${selectedVariant.id}__${selectedSize}`,
      name: `${product.name} — ${selectedVariant.colorName} / ${selectedSize}`,
      price: product.price,
      img: selectedVariant.images[0],
      category: product.category,
    });
    setPhase("running");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent
        className="max-w-md w-full p-0 overflow-hidden rounded-none border-zinc-200"
        showCloseButton={false}
      >
        {/* ── Product image (changes with color) ───────────────────── */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-100">
          <Image
            src={selectedVariant.images[0]}
            alt={`${product.name} — ${selectedVariant.colorName}`}
            fill
            className="object-cover transition-opacity duration-300"
            sizes="448px"
          />
          <DialogClose
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-black/50 backdrop-blur-sm text-white hover:bg-black/80 transition-colors"
            aria-label="Close"
          >
            <X size={14} />
          </DialogClose>
        </div>

        {/* ── Selector area ─────────────────────────────────────────── */}
        <div className="p-6 space-y-5">
          {/* Name + price */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow text-zinc-400 mb-1 capitalize">
                {product.category}
              </p>
              <h4 className="text-zinc-900 font-semibold leading-snug">
                {product.name}
              </h4>
            </div>
            <span className="text-lg font-semibold text-zinc-900 shrink-0">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Color picker */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[0.6rem] font-medium tracking-widest uppercase text-zinc-500">
                Color
              </p>
              <p className="text-xs text-zinc-700 font-medium">
                {selectedVariant.colorName}
              </p>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              {product.variants.map((variant) => {
                const isSelected = variant.id === selectedVariant.id;
                const isLight = LIGHT_HEXES.has(variant.colorHex);
                return (
                  <button
                    key={variant.id}
                    onClick={() => handleColorChange(variant)}
                    title={variant.colorName}
                    aria-label={`Select ${variant.colorName}`}
                    className={cn(
                      "w-7 h-7 rounded-full transition-all duration-200",
                      isSelected
                        ? "ring-2 ring-offset-2 ring-zinc-900 scale-110"
                        : "hover:scale-110",
                      isLight
                        ? "border-2 border-zinc-300"
                        : "border-2 border-transparent",
                    )}
                    style={{ backgroundColor: variant.colorHex }}
                  />
                );
              })}
            </div>
          </div>

          {/* Size picker */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[0.6rem] font-medium tracking-widest uppercase text-zinc-500">
                Size
              </p>
              {!selectedSize && (
                <p className="text-[0.6rem] text-zinc-400 tracking-wide">
                  Select a size
                </p>
              )}
              {isLowStock && (
                <p className="text-[0.6rem] tracking-wide text-amber-500 font-medium">
                  Only {currentStock} left
                </p>
              )}
              {isOutOfStock && (
                <p className="text-[0.6rem] tracking-wide text-red-500 font-medium">
                  Out of stock
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedVariant.sizes.map((s) => {
                const unavailable = s.stock === 0;
                const isSelected = s.size === selectedSize;
                return (
                  <button
                    key={s.size}
                    disabled={unavailable}
                    onClick={() => setSelectedSize(s.size)}
                    className={cn(
                      "h-10 px-3 min-w-[3rem] border text-sm font-medium transition-all duration-150",
                      isSelected
                        ? "bg-zinc-900 text-white border-zinc-900"
                        : unavailable
                          ? "bg-zinc-50 text-zinc-300 border-zinc-200 cursor-not-allowed line-through"
                          : "bg-white text-zinc-900 border-zinc-300 hover:border-zinc-900 hover:bg-zinc-50",
                    )}
                  >
                    {s.size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={!canAdd}
            className={cn(
              "relative w-full py-3.5 overflow-hidden text-[0.65rem] tracking-widest uppercase transition-colors duration-300 font-medium border",
              phase === "done"
                ? "bg-zinc-900 text-white border-zinc-900"
                : !canAdd
                  ? "bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed"
                  : "bg-zinc-900 text-white border-zinc-900 hover:bg-white hover:text-zinc-900",
            )}
          >
            {/* Idle label */}
            <span
              className={cn(
                "flex items-center justify-center transition-opacity duration-150",
                phase === "idle" ? "opacity-100" : "opacity-0",
              )}
            >
              {!selectedSize
                ? "Select a Size"
                : isOutOfStock
                  ? "Out of Stock"
                  : "Add to Cart"}
            </span>

            {/* Running animation icons */}
            {phase === "running" && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  ref={cartIconRef}
                  className="absolute"
                  style={{ transform: "translateX(-200%)" }}
                >
                  <ShoppingBag size={16} strokeWidth={1.5} />
                </div>
                <div
                  ref={boxIconRef}
                  className="absolute"
                  style={{ transform: "translateX(0%) translateY(-260%)" }}
                >
                  <Package size={12} strokeWidth={1.5} />
                </div>
              </div>
            )}

            {/* Done */}
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center gap-1.5 transition-opacity duration-200",
                phase === "done"
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none",
              )}
            >
              <Check size={13} strokeWidth={2.5} /> Added
            </span>
          </button>

          {/* View full product page link */}
          <Link
            href={`/collections/${product.category}/${product.slug}`}
            onClick={onClose}
            className="flex items-center justify-center gap-1.5 text-[0.6rem] tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            View Full Details <ArrowRight size={10} />
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
