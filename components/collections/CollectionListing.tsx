"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { CollectionInfo, ProductSummary } from "@/lib/products";
import { formatPrice } from "@/lib/currency";
import CollectionCard from "@/components/products/CollectionCard";
import BoxerSizeGuide, {
  isBoxerCollection,
} from "@/components/products/BoxerSizeGuide";
import { COLLECTIONS_CONTAINER } from "@/lib/layout/collections";
import { cn } from "@/lib/utils";

type Props = {
  collectionId: string;
  collection: CollectionInfo;
  products: ProductSummary[];
};

export default function CollectionListing({
  collectionId,
  collection,
  products,
}: Props) {
  const maleProducts = products.filter((p) => p.gender === "male");
  const femaleProducts = products.filter((p) => p.gender === "female");
  const hasGenderSplit = maleProducts.length > 0 && femaleProducts.length > 0;

  const accessoryGroups = collectionId === "accessories"
    ? {
        caps: products.filter((p) => p.subcategory === "caps"),
        beanies: products.filter((p) => p.subcategory === "beanies"),
        socks: products.filter((p) => p.subcategory === "socks"),
      }
    : null;

  return (
    <main className="bg-white text-zinc-900 min-h-screen overflow-x-hidden">
      <section className="relative w-full h-[65vh] overflow-hidden">
        <Image
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
          className="inline-flex items-center gap-2 eyebrow text-zinc-400 hover:text-zinc-900 transition-colors duration-300"
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
          <p className="text-zinc-400 text-sm max-w-xs leading-relaxed">
            New pieces for {collection.subtitle} are on the way. Check back
            soon.
          </p>
        </div>
      ) : accessoryGroups ? (
        <div
          className={cn(
            COLLECTIONS_CONTAINER,
            "pt-10 pb-32 flex flex-col gap-16",
          )}
        >
          {(
            [
              ["Caps", accessoryGroups.caps],
              ["Beanies", accessoryGroups.beanies],
              ["Socks", accessoryGroups.socks],
            ] as const
          ).map(
            ([label, group]) =>
              group.length > 0 && (
                <ProductSection
                  key={label}
                  className=""
                  label={label}
                  count={group.length}
                  products={group}
                  categoryLabel={collection.subtitle}
                />
              ),
          )}
        </div>
      ) : hasGenderSplit ? (
        <div
          className={cn(
            COLLECTIONS_CONTAINER,
            "pt-10 pb-32 flex flex-col gap-16",
          )}
        >
          <ProductSection
            className=""
            label="Mens"
            count={maleProducts.length}
            products={maleProducts}
            categoryLabel={collection.subtitle}
          />
          <ProductSection
            className=""
            label="Womens"
            count={femaleProducts.length}
            products={femaleProducts}
            categoryLabel={collection.subtitle}
          />
        </div>
      ) : (
        <ProductSection
          className={cn(COLLECTIONS_CONTAINER, "pt-10 pb-32")}
          label={`All ${collection.subtitle}`}
          count={products.length}
          products={products}
          categoryLabel={collection.subtitle}
          large={collectionId === "tracksuits"}
        />
      )}
    </main>
  );
}

function ProductSection({
  label,
  count,
  products,
  categoryLabel,
  className = COLLECTIONS_CONTAINER,
  large = false,
}: {
  label: string;
  count: number;
  products: ProductSummary[];
  categoryLabel: string;
  className?: string;
  large?: boolean;
}) {
  return (
    <section className={className}>
      <div className="flex items-end justify-between mb-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow text-zinc-400 mb-2">{count} Styles</p>
          <h3 className="text-zinc-900">{label}</h3>
        </motion.div>
        <p className="eyebrow text-zinc-400 hidden md:block">
          From {formatPrice(Math.min(...products.map((p) => p.price)))}
        </p>
      </div>

      <div
        className={
          large
            ? "grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-100"
            : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-zinc-100"
        }
      >
        {products.map((product, i) => (
          <motion.div
            key={product.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: i * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <CollectionCard
              product={product}
              categoryLabel={categoryLabel}
              large={large}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
