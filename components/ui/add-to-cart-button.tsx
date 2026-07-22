"use client";

import { useState } from "react";
import { getProductBySlug, type Product } from "@/lib/products";
import QuickAddModal from "@/components/products/QuickAddModal";
import { toast } from "@/lib/stores/toast-store";
import { cn } from "@/lib/utils";

type Props = {
  slug: string;
  className?: string;
  label?: string;
};

export default function AddToCartButton({
  slug,
  className,
  label = "Quick Add",
}: Props) {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    try {
      const resolved = await getProductBySlug(slug);
      if (!resolved) {
        toast.error(
          "Product unavailable",
          "This piece is no longer in our catalog.",
        );
        return;
      }
      setProduct(resolved);
      setOpen(true);
    } catch (err) {
      toast.error(
        "Could not load product",
        err instanceof Error ? err.message : "Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={cn(
          "w-full text-[0.6rem] tracking-widest uppercase border border-zinc-900 text-zinc-900 py-2.5 hover:bg-zinc-900 hover:text-white transition-colors disabled:opacity-50",
          className,
        )}
      >
        {loading ? "Loading..." : label}
      </button>
      {product && (
        <QuickAddModal
          product={product}
          open={open}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
