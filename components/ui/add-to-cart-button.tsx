"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { getProductBySlug, type Product } from "@/lib/products";
import QuickAddModal from "@/components/products/QuickAddModal";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/stores/toast-store";
import { cn } from "@/lib/utils";

type Props = {
  slug: string;
  className?: string;
  label?: string;
  /** Compact text CTA with a leading + (used in cart upsells). */
  variant?: "button" | "inline";
};

export default function AddToCartButton({
  slug,
  className,
  label = "Quick Add",
  variant = "button",
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
      {variant === "inline" ? (
        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          className={cn(
            "inline-flex items-center gap-2 text-[0.65rem] tracking-widest uppercase text-zinc-900 transition-opacity duration-150 ease-out hover:opacity-70 active:scale-[0.97] disabled:opacity-50",
            className,
          )}
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin" aria-hidden />
          ) : (
            <>
              <span className="flex h-5 w-5 items-center justify-center border border-zinc-900">
                <Plus size={11} strokeWidth={2} />
              </span>
              {label}
            </>
          )}
        </button>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={loading}
          className={cn("w-full py-2.5 text-[0.6rem]", className)}
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin" aria-hidden />
          ) : (
            label
          )}
        </Button>
      )}
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
