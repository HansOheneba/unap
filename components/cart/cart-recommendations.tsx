"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getFeaturedProducts, type ProductSummary } from "@/lib/products";
import { formatPrice } from "@/lib/currency";
import AddToCartButton from "@/components/ui/add-to-cart-button";

type Props = {
  /** Product ids already in the cart (without variant/size suffix). */
  excludeProductIds: string[];
};

export default function CartRecommendations({ excludeProductIds }: Props) {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const excludeKey = useMemo(
    () => [...excludeProductIds].sort().join(","),
    [excludeProductIds],
  );

  useEffect(() => {
    let cancelled = false;
    getFeaturedProducts(8)
      .then((all) => {
        if (cancelled) return;
        const exclude = new Set(excludeProductIds);
        setProducts(all.filter((p) => !exclude.has(p.id)).slice(0, 3));
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      });
    return () => {
      cancelled = true;
    };
    // excludeKey is a stable serialization of excludeProductIds
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excludeKey]);

  if (products.length === 0) return null;

  return (
    <section className="mt-14 border-t border-zinc-100 pt-12">
      <p className="eyebrow text-zinc-500 mb-2">Before You Check Out</p>
      <h2 className="text-2xl font-light tracking-tight mb-8">
        Recommended for you
      </h2>

      <ul className="flex flex-col divide-y divide-zinc-100 border border-zinc-100">
        {products.map((product) => (
          <li
            key={product.id}
            className="flex items-start gap-4 bg-white p-4 md:gap-5 md:p-5"
          >
            <Link
              href={`/collections/${product.category}/${product.slug}`}
              className="relative shrink-0 w-20 h-20 md:w-24 md:h-24 overflow-hidden bg-zinc-100"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <div className="min-w-0">
                <Link
                  href={`/collections/${product.category}/${product.slug}`}
                  className="block"
                >
                  <h3 className="text-sm font-medium text-zinc-900 leading-snug">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 capitalize">
                    {product.tag || product.category}
                  </p>
                </Link>
                <div className="mt-3">
                  <AddToCartButton
                    slug={product.slug}
                    variant="inline"
                    label="Add to your order"
                  />
                </div>
              </div>

              <p className="shrink-0 text-sm font-medium text-zinc-900 sm:pt-0.5">
                {formatPrice(product.price)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
