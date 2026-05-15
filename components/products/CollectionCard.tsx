"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/products";
import QuickAddModal from "./QuickAddModal";
import WishlistButton from "@/components/ui/wishlist-button";
import { useWishlistStore } from "@/lib/stores/wishlist-store";

type Props = {
  product: Product;
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
  const [modalOpen, setModalOpen] = useState(false);
  const href = `/collections/${product.category}/${product.slug}`;
  const isWishlisted = useWishlistStore((s) =>
    s.items.some((i) => i.id === product.id),
  );
  const wishlistItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    img: product.variants[0].images[0],
    category: product.category,
    slug: product.slug,
  };

  return (
    <div className="group bg-white">
      {/* ── Image area ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden aspect-3/4">
        {/* Clicking the image navigates to the product */}
        <Link href={href} className="absolute inset-0 z-0" tabIndex={-1}>
          <Image
            src={product.variants[0].images[0]}
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
          onClick={() => setModalOpen(true)}
          className="absolute bottom-3 inset-x-3 z-20 py-2.5 bg-black/70 backdrop-blur-sm text-white text-[0.6rem] tracking-widest uppercase opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
        >
          Quick Add
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

      <QuickAddModal
        product={product}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
