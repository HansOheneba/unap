import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/products";

type ProductCardProps = {
  product: Product;
};

const LIGHT_HEXES = new Set(["#f0f0f0", "#f0e6ce", "#e8dcc8", "#f5f5f5"]);

export default function ProductCard({ product }: ProductCardProps) {
  const defaultVariant = product.variants[0];
  const primaryImage = defaultVariant.images[0];
  const hoverImage = defaultVariant.images[1] ?? defaultVariant.images[0];

  return (
    <Link
      href={`/collections/${product.category}/${product.slug}`}
      className="group block focus-visible:outline-none"
    >
      <article className="rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100 transition-shadow duration-500 hover:shadow-2xl hover:shadow-black/10">
        {/* ── IMAGE AREA ─────────────────────────────────────────────── */}
        <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100">
          {/* Primary image — scales up and fades on hover */}
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-0"
          />
          {/* Hover image — fades in */}
          <Image
            src={hoverImage}
            alt={`${product.name} alternate view`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover absolute inset-0 opacity-0 scale-105 transition-all duration-700 ease-out group-hover:opacity-100"
          />
          {/* Hover overlay + CTA */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500 z-10" />
          <div className="absolute bottom-3 left-3 right-3 z-20 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out">
            <span className="block w-full py-2.5 bg-white text-black text-[0.58rem] tracking-widest uppercase text-center">
              View Product
            </span>
          </div>
        </div>

        {/* ── CARD INFO ──────────────────────────────────────────────── */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="text-sm font-medium text-zinc-900 leading-snug">
              {product.name}
            </h3>
            <span className="text-sm font-semibold text-zinc-900 shrink-0">
              {product.priceDisplay}
            </span>
          </div>

          {/* Color swatches */}
          <div className="flex items-center gap-1.5">
            {product.variants.slice(0, 6).map((v) => (
              <div
                key={v.id}
                className={cn(
                  "w-3.5 h-3.5 rounded-full border transition-transform duration-200 hover:scale-125",
                  LIGHT_HEXES.has(v.colorHex)
                    ? "border-zinc-300"
                    : "border-transparent",
                )}
                style={{ backgroundColor: v.colorHex }}
                title={v.colorName}
              />
            ))}
            {product.variants.length > 6 && (
              <span className="text-[0.6rem] text-zinc-400 ml-0.5">
                +{product.variants.length - 6}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
