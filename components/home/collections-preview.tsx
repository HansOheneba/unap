"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/currency";
import { CATALOG_PRODUCTS } from "@/lib/data/catalog";

const featured = [
  CATALOG_PRODUCTS.find((p) => p.slug === "street-sovereign-track-set"),
  CATALOG_PRODUCTS.find((p) => p.slug === "shadow-cargo-pant"),
  CATALOG_PRODUCTS.find((p) => p.slug === "outlaw-i"),
  CATALOG_PRODUCTS.find((p) => p.slug === "bold-society-cap"),
].filter(Boolean) as typeof CATALOG_PRODUCTS;

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function CollectionsPreview() {
  const hero = featured[0];

  return (
    <section className="bg-white text-zinc-900 py-32 px-8 md:px-20">
      <div className="max-w-360 mx-auto flex flex-col gap-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <FadeIn>
            <p className="eyebrow mb-4">The Collection</p>
            <h2 className="max-w-lg">Peices of Rebellion</h2>
          </FadeIn>
          <FadeIn delay={0.15} className="shrink-0">
            <Link href="/collections" className={buttonVariants()}>
              Shop All
            </Link>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-zinc-100">
          {hero && (
            <FadeIn className="md:col-span-7 bg-white group">
              <Link
                href={`/collections/${hero.collectionId}/${hero.slug}`}
                className="block relative w-full"
                style={{ aspectRatio: "3/4" }}
              >
                <Image
                  src={hero.images[0]}
                  alt={hero.name}
                  fill
                  className="object-cover brightness-90 group-hover:brightness-100 transition-[filter] duration-700"
                />
                <span className="absolute top-6 left-6 eyebrow text-white/70 capitalize">
                  {hero.collectionId.replace("-", " ")}
                </span>
              </Link>
              <div className="flex items-center justify-between px-6 py-5 bg-white border-t border-zinc-100">
                <h5 className="text-zinc-900">{hero.name}</h5>
                <span className="text-base font-semibold text-zinc-900 tabular-nums shrink-0">
                  {formatPrice(hero.price)}
                </span>
              </div>
            </FadeIn>
          )}

          <div className="md:col-span-5 flex flex-col gap-px bg-zinc-100">
            {featured.slice(1).map((product, i) => (
              <FadeIn
                key={product.slug}
                delay={0.1 * (i + 1)}
                className="bg-white group"
              >
                <Link
                  href={`/collections/${product.collectionId}/${product.slug}`}
                  className="block relative w-full"
                  style={{ aspectRatio: "4/3" }}
                >
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover brightness-85 group-hover:brightness-100 transition-[filter] duration-700"
                  />
                  <span className="absolute top-4 left-4 eyebrow text-white/70 capitalize">
                    {product.collectionId.replace("-", " ")}
                  </span>
                </Link>
                <div className="flex items-center justify-between px-5 py-4 bg-white border-t border-zinc-100">
                  <h5 className="text-zinc-900 text-sm">{product.name}</h5>
                  <span className="text-sm font-semibold text-zinc-900 tabular-nums shrink-0">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        <FadeIn delay={0.2}>
          <p className="text-zinc-500 text-center text-sm tracking-wider uppercase">
            Every piece carries intention. None of it is accidental.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
