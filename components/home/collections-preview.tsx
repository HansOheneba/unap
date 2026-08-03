"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { buttonVariants } from "@/components/ui/button";
import CollectionCard from "@/components/products/CollectionCard";
import type { ProductSummary } from "@/lib/products";
import { cn } from "@/lib/utils";

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

type Props = {
  products: ProductSummary[];
};

function previewGridClass(count: number): string {
  if (count === 1) return "grid grid-cols-1 max-w-lg mx-auto gap-px bg-zinc-100";
  if (count === 2) return "grid grid-cols-2 gap-px bg-zinc-100";
  if (count === 3) return "grid grid-cols-2 md:grid-cols-3 gap-px bg-zinc-100";
  return "grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-100";
}

function previewImageSizes(count: number): string {
  if (count === 1) return "(max-width: 512px) 100vw, 32rem";
  if (count === 2) return "50vw";
  if (count === 3) return "(max-width: 768px) 50vw, 33vw";
  return "(max-width: 768px) 50vw, 25vw";
}

export default function CollectionsPreview({ products }: Props) {
  if (products.length === 0) return null;

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

        <FadeIn delay={0.1}>
          <div className={cn(previewGridClass(products.length))}>
            {products.map((product) => (
              <CollectionCard
                key={product.slug}
                product={product}
                categoryLabel={product.category.replace("-", " ")}
                imageSizes={previewImageSizes(products.length)}
                large={products.length === 1}
              />
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.2} className="flex justify-center">
          <Link href="/collections" className={buttonVariants({ variant: "outline" })}>
            View All Collections
          </Link>
        </FadeIn>

        <FadeIn delay={0.25}>
          <p className="text-zinc-500 text-center text-sm tracking-wider uppercase">
            Every piece carries intention. None of it is accidental.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
