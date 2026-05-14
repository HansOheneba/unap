"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  Check,
  ArrowLeft,
} from "lucide-react";
import type { Product, ColorVariant } from "@/lib/products";
import ProductGallery from "./ProductGallery";
import ProductCard from "./ProductCard";
import { useCartStore } from "@/lib/stores/cart-store";
import { cn } from "@/lib/utils";

type Props = {
  product: Product;
  relatedProducts: Product[];
};

const LIGHT_HEXES = new Set(["#f0f0f0", "#f0e6ce", "#e8dcc8", "#f5f5f5"]);

export default function ProductDetailClient({
  product,
  relatedProducts,
}: Props) {
  const [selectedVariant, setSelectedVariant] = useState<ColorVariant>(
    product.variants[0],
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(() => {
    const sizes = product.variants[0].sizes;
    return sizes.length === 1 ? sizes[0].size : null;
  });
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("description");

  const addItem = useCartStore((s) => s.addItem);

  const selectedSizeData = selectedVariant.sizes.find(
    (s) => s.size === selectedSize,
  );
  const currentStock = selectedSizeData?.stock ?? 0;
  const isLowStock = !!selectedSize && currentStock > 0 && currentStock <= 4;
  const isOutOfStock = !!selectedSize && currentStock === 0;
  const canAdd = !!selectedSize && !isOutOfStock;

  const handleColorChange = (variant: ColorVariant) => {
    setSelectedVariant(variant);
    const sizes = variant.sizes;
    if (sizes.length === 1) {
      setSelectedSize(sizes[0].size);
      setQuantity((q) => Math.min(q, sizes[0].stock));
    } else if (selectedSize) {
      const newSizeData = sizes.find((s) => s.size === selectedSize);
      if (!newSizeData) {
        setSelectedSize(null);
      } else {
        setQuantity((q) => Math.min(q, newSizeData.stock));
      }
    }
  };

  const handleAddToCart = () => {
    if (!canAdd) return;
    addItem({
      id: `${product.id}__${selectedVariant.id}__${selectedSize}`,
      name: `${product.name} — ${selectedVariant.colorName} / ${selectedSize}`,
      price: product.priceDisplay,
      priceNum: product.price,
      img: selectedVariant.images[0],
      category: product.category,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const accordionSections = [
    {
      id: "description",
      label: "Description",
      content: (
        <p className="text-zinc-600 text-sm leading-relaxed">
          {product.description}
        </p>
      ),
    },
    {
      id: "details",
      label: "Product Details",
      content: (
        <ul className="space-y-2">
          {product.details.map((d, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-sm text-zinc-600"
            >
              <span className="w-1 h-1 rounded-full bg-zinc-300 mt-2 flex-shrink-0" />
              {d}
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: "care",
      label: "Care Instructions",
      content: (
        <ul className="space-y-2">
          {product.careInstructions.map((c, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-sm text-zinc-600"
            >
              <span className="w-1 h-1 rounded-full bg-zinc-300 mt-2 flex-shrink-0" />
              {c}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <main className="bg-white text-zinc-900 min-h-screen pb-24 lg:pb-0">
      <div className="max-w-360 mx-auto px-6 md:px-12 lg:px-16">
        {/* ── BREADCRUMB ──────────────────────────────────────────────── */}
        <nav className="flex items-center gap-2 py-7 text-[0.65rem] text-zinc-400 tracking-wide">
          <Link
            href="/collections"
            className="inline-flex items-center gap-1.5 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft size={12} />
            Collections
          </Link>
          <span className="text-zinc-200">/</span>
          <Link
            href={`/collections/${product.category}`}
            className="capitalize hover:text-zinc-900 transition-colors"
          >
            {product.category}
          </Link>
          <span className="text-zinc-200">/</span>
          <span className="text-zinc-600 truncate max-w-[12rem]">
            {product.name}
          </span>
        </nav>

        {/* ── PRODUCT LAYOUT ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 pb-20">
          {/* LEFT — Gallery */}
          <ProductGallery
            images={selectedVariant.images}
            productName={product.name}
          />

          {/* RIGHT — Info (sticky on desktop) */}
          <div className="lg:sticky lg:top-28 lg:self-start space-y-7">
            {/* Tag + Name + Price ─────────────────────────────────── */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-medium tracking-tight leading-tight mt-1 mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-2xl font-semibold">
                  {product.priceDisplay}
                </span>
                {selectedSize && !isOutOfStock && !isLowStock && (
                  <span className="inline-flex items-center gap-1.5 text-[0.65rem] tracking-widest uppercase text-emerald-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    In Stock
                  </span>
                )}
                {isLowStock && (
                  <span className="inline-flex items-center gap-1.5 text-[0.65rem] tracking-widest uppercase text-amber-500 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Only {currentStock} left
                  </span>
                )}
                {isOutOfStock && (
                  <span className="inline-flex items-center gap-1.5 text-[0.65rem] tracking-widest uppercase text-red-500 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            <div className="h-px bg-zinc-100" />

            {/* Color Selection ────────────────────────────────────── */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[0.62rem] font-medium tracking-widest uppercase text-zinc-500">
                  Color
                </p>
                <p className="text-sm text-zinc-900 font-medium">
                  {selectedVariant.colorName}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {product.variants.map((variant) => {
                  const isSelected = variant.id === selectedVariant.id;
                  const isLight = LIGHT_HEXES.has(variant.colorHex);
                  return (
                    <button
                      key={variant.id}
                      onClick={() => handleColorChange(variant)}
                      title={variant.colorName}
                      aria-label={`Select color: ${variant.colorName}`}
                      className={cn(
                        "w-8 h-8 rounded-full transition-all duration-300 ease-out",
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

            {/* Size Selection ─────────────────────────────────────── */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[0.62rem] font-medium tracking-widest uppercase text-zinc-500">
                  Size
                </p>
                {!selectedSize && (
                  <p className="text-[0.62rem] text-zinc-400 tracking-wide">
                    Select a size
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedVariant.sizes.map((s) => {
                  const isSelected = s.size === selectedSize;
                  const unavailable = s.stock === 0;
                  return (
                    <button
                      key={s.size}
                      disabled={unavailable}
                      onClick={() => {
                        setSelectedSize(s.size);
                        setQuantity((q) => Math.min(q, s.stock));
                      }}
                      className={cn(
                        "h-11 px-4 min-w-[3.25rem] border text-sm font-medium transition-all duration-200",
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

            {/* Quantity ───────────────────────────────────────────── */}
            <div className="flex items-center gap-5">
              <p className="text-[0.62rem] font-medium tracking-widest uppercase text-zinc-500">
                Qty
              </p>
              <div className="flex items-center border border-zinc-200">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-medium tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(currentStock, q + 1))
                  }
                  disabled={!selectedSize || quantity >= currentStock}
                  className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Add to Cart ────────────────────────────────────────── */}
            <button
              onClick={handleAddToCart}
              disabled={!canAdd}
              className={cn(
                "w-full py-4 text-[0.68rem] tracking-widest uppercase transition-all duration-300 border font-medium",
                added
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : !canAdd
                    ? "bg-zinc-50 text-zinc-400 border-zinc-200 cursor-not-allowed"
                    : "bg-black text-white border-black hover:bg-white hover:text-black",
              )}
            >
              {added ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Check size={15} /> Added to Cart
                </span>
              ) : !selectedSize ? (
                "Select a Size to Continue"
              ) : isOutOfStock ? (
                "Out of Stock"
              ) : (
                "Add to Cart"
              )}
            </button>

            {/* Accordion ──────────────────────────────────────────── */}
            <div className="border-t border-zinc-100">
              {accordionSections.map((section) => (
                <div key={section.id} className="border-b border-zinc-100">
                  <button
                    onClick={() =>
                      setOpenSection((prev) =>
                        prev === section.id ? null : section.id,
                      )
                    }
                    className="w-full flex items-center justify-between py-4 text-sm font-medium text-zinc-900 hover:text-zinc-500 transition-colors"
                  >
                    {section.label}
                    {openSection === section.id ? (
                      <ChevronUp size={16} className="text-zinc-400 shrink-0" />
                    ) : (
                      <ChevronDown
                        size={16}
                        className="text-zinc-400 shrink-0"
                      />
                    )}
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      openSection === section.id ? "max-h-96 pb-5" : "max-h-0",
                    )}
                  >
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RELATED PRODUCTS ──────────────────────────────────────────── */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-zinc-100 py-16 lg:py-24 bg-zinc-50">
          <div className="max-w-360 mx-auto px-6 md:px-12 lg:px-16">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[0.62rem] tracking-widest uppercase text-zinc-400 mb-1">
                  You Might Also Like
                </p>
                <h2 className="text-2xl font-medium tracking-tight">
                  More from{" "}
                  {product.category.charAt(0).toUpperCase() +
                    product.category.slice(1)}
                </h2>
              </div>
              <Link
                href={`/collections/${product.category}`}
                className="text-[0.62rem] tracking-widest uppercase text-zinc-500 hover:text-zinc-900 transition-colors border-b border-zinc-200 pb-0.5 hidden sm:block"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── STICKY MOBILE CTA ─────────────────────────────────────────── */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-zinc-200 p-4 z-50 transition-transform duration-300",
          canAdd ? "translate-y-0" : "translate-y-full",
        )}
      >
        <button
          onClick={handleAddToCart}
          className={cn(
            "w-full py-4 text-[0.68rem] tracking-widest uppercase transition-all duration-300 border font-medium",
            added
              ? "bg-zinc-900 text-white border-zinc-900"
              : "bg-black text-white border-black hover:bg-zinc-800",
          )}
        >
          {added ? (
            <span className="inline-flex items-center justify-center gap-2">
              <Check size={15} /> Added
            </span>
          ) : (
            `Add to Cart — ${product.priceDisplay}`
          )}
        </button>
      </div>
    </main>
  );
}
