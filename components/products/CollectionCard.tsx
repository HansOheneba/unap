"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { getProductBySlug, type Product, type ProductSummary } from "@/lib/products";
import QuickAddModal from "./QuickAddModal";
import WishlistButton from "@/components/ui/wishlist-button";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { toast } from "@/lib/stores/toast-store";
import { useRequireLogin } from "@/lib/use-require-login";

type Props = {
  product: ProductSummary;
  /** Label shown above the product name, e.g. "Boxers", "Head Wears" */
  categoryLabel: string;
  /** Extra Tailwind classes applied to the <Image> element, e.g. "object-top" */
  imageClassName?: string;
  /** Tailwind sizes attr for the image, defaults to 25vw-based responsive set */
  imageSizes?: string;
  /** Use h4 + extra padding for large 2-col cards (e.g. Tracks) */
  large?: boolean;
};

export default function CollectionCard({
  product,
  categoryLabel,
  imageClassName,
  imageSizes = "(max-width: 768px) 50vw, 25vw",
  large = false,
}: Props) {
  const requireLogin = useRequireLogin();
  const [modalOpen, setModalOpen] = useState(false);
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [loadingQuickAdd, setLoadingQuickAdd] = useState(false);
  const href = `/collections/${product.category}/${product.slug}`;
  const isWishlisted = useWishlistStore((s) =>
    s.has(product.id, product.slug),
  );
  const wishlistItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    img: product.image,
    category: product.category,
    slug: product.slug,
  };

  const handleQuickAdd = async () => {
    if (loadingQuickAdd) return;
    if (!requireLogin()) return;
    setLoadingQuickAdd(true);
    try {
      const resolved = await getProductBySlug(product.slug, product.category);
      if (!resolved) {
        toast.error(
          "Product unavailable",
          "This piece is no longer in our catalog.",
        );
        return;
      }
      setQuickAddProduct(resolved);
      setModalOpen(true);
    } finally {
      setLoadingQuickAdd(false);
    }
  };

  return (
    <div className="group bg-white">
      {/* ── Image area ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden aspect-3/4">
        {/* Clicking the image navigates to the product */}
        <Link href={href} className="absolute inset-0 z-0" tabIndex={-1}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes={imageSizes}
            className={cn(
              "object-cover transition-transform duration-700 group-hover:scale-[1.04]",
              imageClassName,
            )}
          />
        </Link>

        {/* Hover overlay */}
        <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 z-10" />

        {/* Wishlist button — top right corner */}
        <div
          className={cn(
            "absolute top-3 right-3 z-20 transition-opacity duration-300",
            isWishlisted ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
        >
          <WishlistButton item={wishlistItem} />
        </div>

        {/* Quick Add button — slides up on hover */}
        <button
          onClick={handleQuickAdd}
          disabled={loadingQuickAdd}
          className="absolute bottom-3 inset-x-3 z-20 py-2.5 bg-black/70 backdrop-blur-sm text-white text-[0.6rem] tracking-widest uppercase opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 disabled:opacity-50"
        >
          {loadingQuickAdd ? (
            <Loader2 size={14} className="mx-auto animate-spin" aria-hidden />
          ) : (
            "Quick Add"
          )}
        </button>
      </div>

      {/* ── Info ───────────────────────────────────────────────────── */}
      <Link
        href={href}
        className={cn(
          "block border-t border-zinc-100",
          large ? "p-6 flex flex-col gap-3" : "p-5",
        )}
      >
        <p className="eyebrow text-zinc-500 mb-2">{categoryLabel}</p>
        {large ? (
          <h4 className="text-zinc-900">{product.name}</h4>
        ) : (
          <h5 className="text-zinc-900">{product.name}</h5>
        )}
        <p className={cn("text-zinc-600", large ? "mt-1" : "mt-2")}>
          {formatPrice(product.price)}
        </p>
      </Link>

      {quickAddProduct && (
        <QuickAddModal
          product={quickAddProduct}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
