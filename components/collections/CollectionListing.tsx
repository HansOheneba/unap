"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { CollectionInfo, ProductSummary } from "@/lib/products";
import { formatPrice } from "@/lib/currency";
import CollectionCard from "@/components/products/CollectionCard";
import BoxerSizeGuide, {
  isBoxerCollection,
} from "@/components/products/BoxerSizeGuide";
import FadeImage from "@/components/ui/fade-image";
import { COLLECTIONS_CONTAINER } from "@/lib/layout/collections";
import { cn } from "@/lib/utils";

type Props = {
  collectionId: string;
  collection: CollectionInfo;
  products: ProductSummary[];
};

const ACCESSORY_SUBCATEGORY_SECTIONS = [
  { key: "caps", label: "Caps" },
  { key: "beanies", label: "Beanies" },
  { key: "socks", label: "Socks" },
] as const;

/**
 * Groups accessories by known subcategory. Products without a matching
 * subcategory still render (under their subcategory label, or "More") so
 * API-backed items aren't silently dropped from /collections/accessories.
 */
function groupAccessories(
  products: ProductSummary[],
): { label: string; products: ProductSummary[] }[] {
  const remaining = new Set(products);
  const sections: { label: string; products: ProductSummary[] }[] = [];

  for (const { key, label } of ACCESSORY_SUBCATEGORY_SECTIONS) {
    const group = products.filter(
      (p) => p.subcategory?.trim().toLowerCase() === key,
    );
    if (group.length === 0) continue;
    for (const product of group) remaining.delete(product);
    sections.push({ label, products: group });
  }

  if (remaining.size === 0) return sections;

  const ungrouped = [...remaining];
  const byLabel = new Map<string, ProductSummary[]>();
  for (const product of ungrouped) {
    const raw = product.subcategory?.trim();
    const label = raw
      ? raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase()
      : "All Accessories";
    const bucket = byLabel.get(label);
    if (bucket) bucket.push(product);
    else byLabel.set(label, [product]);
  }

  for (const [label, group] of byLabel) {
    sections.push({ label, products: group });
  }

  return sections;
}

export default function CollectionListing({
  collectionId,
  collection,
  products,
}: Props) {
  const maleProducts = products.filter((p) => p.gender === "male");
  const femaleProducts = products.filter((p) => p.gender === "female");
  const hasGenderSplit = maleProducts.length > 0 && femaleProducts.length > 0;

  const accessoryGroups =
    collectionId === "accessories"
      ? groupAccessories(products)
      : null;

  return (
    <main className="bg-white text-zinc-900 min-h-screen overflow-x-hidden">
      <section className="relative w-full h-[65vh] overflow-hidden">
        <FadeImage
          src={collection.featured}
          alt={collection.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute inset-x-0 bottom-0">
          <div
            className={cn(COLLECTIONS_CONTAINER, "pb-10 md:pb-16 lg:pb-20")}
          >
        <div className="flex flex-col gap-5 max-w-2xl">
          <motion.p
            className="eyebrow text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {collection.subtitle}
          </motion.p>
          <motion.h1
            className="text-white leading-none"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {collection.title}
          </motion.h1>
          <motion.p
            className="text-white/75 max-w-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.25 }}
          >
            {collection.tagline}
          </motion.p>
        </div>
          </div>
        </div>
      </section>

      <div className={cn(COLLECTIONS_CONTAINER, "pt-10 pb-2")}>
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 eyebrow text-zinc-500 hover:text-zinc-900 transition-colors duration-300"
        >
          <ArrowLeft size={14} />
          All Collections
        </Link>
      </div>

      {isBoxerCollection(collectionId) && (
        <div className={cn(COLLECTIONS_CONTAINER, "pt-6")}>
          <div className="flex flex-col gap-4 border border-zinc-100 bg-zinc-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="eyebrow text-zinc-500 mb-1">Fit</p>
              <p className="text-sm text-zinc-700 leading-relaxed max-w-md">
                Waist sizes run S through XXXL. Check the boxers size chart
                before you add to bag.
              </p>
            </div>
            <BoxerSizeGuide />
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div
          className={cn(
            COLLECTIONS_CONTAINER,
            "pt-16 pb-32 flex flex-col items-center text-center gap-3",
          )}
        >
          <p className="text-zinc-900 text-lg font-light">
            Nothing here yet.
          </p>
          <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
            New pieces for {collection.subtitle} are on the way. Check back
            soon.
          </p>
        </div>
      ) : accessoryGroups ? (
        <div className="flex flex-col gap-12 md:gap-16 pb-32">
          {accessoryGroups.map(({ label, products: group }) => (
            <ProductSection
              key={label}
              label={label}
              count={group.length}
              products={group}
              categoryLabel={collection.subtitle}
            />
          ))}
        </div>
      ) : hasGenderSplit ? (
        <div className="flex flex-col gap-12 md:gap-16 pb-32">
          <ProductSection
            label="Mens"
            count={maleProducts.length}
            products={maleProducts}
            categoryLabel={collection.subtitle}
          />
          <ProductSection
            label="Womens"
            count={femaleProducts.length}
            products={femaleProducts}
            categoryLabel={collection.subtitle}
          />
        </div>
      ) : (
        <div className="pb-32">
          <ProductSection
            label={`All ${collection.subtitle}`}
            count={products.length}
            products={products}
            categoryLabel={collection.subtitle}
            large={collectionId === "tracksuits"}
          />
        </div>
      )}
    </main>
  );
}

/** Grid that fills the wall even when a section only has 1–2 styles. */
function productGridClass(count: number, large: boolean): string {
  if (count === 1) {
    // One piece → centered featured card (not a lonely cell in a 3-col grid)
    return "grid grid-cols-1 max-w-md md:max-w-xl mx-auto gap-px bg-zinc-100";
  }
  if (count === 2 || large) {
    return "grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-100";
  }
  return "grid grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-100";
}

function productImageSizes(count: number, large: boolean): string {
  if (count === 1) return "(max-width: 448px) 100vw, 36rem";
  if (count === 2 || large) return "(max-width: 768px) 100vw, 50vw";
  return "(max-width: 1024px) 50vw, 33vw";
}

/**
 * Stretch the last card so an incomplete final row reads as intentional.
 * - 2-col (mobile / large): orphan → full width
 * - 3-col (lg): rem 1 → full width; rem 2 → last spans 2
 */
function productSpanClass(
  index: number,
  count: number,
  large: boolean,
): string | undefined {
  if (count <= 1 || index !== count - 1) return undefined;

  // large / pair layout: md:grid-cols-2
  if (count === 2 || large) {
    return count % 2 === 1 ? "md:col-span-2" : undefined;
  }

  // Default: grid-cols-2 lg:grid-cols-3
  const mobileOrphan = count % 2 === 1;
  const desktopRem = count % 3;
  if (!mobileOrphan && desktopRem === 0) return undefined;

  return cn(
    mobileOrphan && "col-span-2",
    desktopRem === 1 && "lg:col-span-3",
    desktopRem === 2 && "lg:col-span-2",
    mobileOrphan && desktopRem === 0 && "lg:col-span-1",
  );
}

function ProductSection({
  label,
  count,
  products,
  categoryLabel,
  className,
  large = false,
}: {
  label: string;
  count: number;
  products: ProductSummary[];
  categoryLabel: string;
  className?: string;
  large?: boolean;
}) {
  // Single-style sections use the large card treatment so the drop feels intentional
  const useLargeCard = large || count === 1;
  const styleLabel = count === 1 ? "1 Style" : `${count} Styles`;

  return (
    <section className={cn("pt-10", className)}>
      <div
        className={cn(
          COLLECTIONS_CONTAINER,
          "flex items-end justify-between mb-8 md:mb-10",
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow text-zinc-500 mb-2">{styleLabel}</p>
          <h3 className="text-zinc-900">{label}</h3>
        </motion.div>
        <p className="eyebrow text-zinc-600 hidden md:block">
          From {formatPrice(Math.min(...products.map((p) => p.price)))}
        </p>
      </div>

      {/* Near full-bleed photography wall within the site content width */}
      <div className="max-w-360 mx-auto">
        <div className={productGridClass(count, large)}>
          {products.map((product, index) => (
            <CollectionCard
              key={product.slug}
              product={product}
              categoryLabel={categoryLabel}
              large={useLargeCard}
              imageSizes={productImageSizes(count, large)}
              className={productSpanClass(index, count, large)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
