"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getProductsByCategory } from "@/lib/products";
import { formatPrice } from "@/lib/currency";
import CollectionCard from "@/components/products/CollectionCard";

export default function SunglassesPage() {
  const products = getProductsByCategory("sunglasses");

  return (
    <main className="bg-white text-zinc-900 min-h-screen overflow-x-hidden">
      {/* ── HERO BANNER ────────────────────────────────────────────── */}
      <section className="relative w-full h-[65vh] overflow-hidden">
        <Image
          src="/collections/glases/outlawGlasses1.jpg"
          alt="The Eclipse Edit"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 flex flex-col gap-5 p-10 md:p-16 lg:p-20 max-w-2xl">
          <motion.p
            className="eyebrow text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            Sunglasses
          </motion.p>
          <motion.h1
            className="text-white leading-none"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            The Eclipse Edit
          </motion.h1>
          <motion.p
            className="text-white/75 max-w-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.25 }}
          >
            The world looks different when you stop apologizing for the view.
          </motion.p>
        </div>
      </section>

      {/* ── BREADCRUMB ──────────────────────────────────────────────── */}
      <div className="max-w-360 mx-auto px-6 md:px-12 lg:px-16 pt-10 pb-2">
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 eyebrow text-zinc-400 hover:text-zinc-900 transition-colors duration-300"
        >
          <ArrowLeft size={14} />
          All Collections
        </Link>
      </div>

      {/* ── PRODUCTS GRID ────────────────────────────────────────────── */}
      <section className="max-w-360 mx-auto px-6 md:px-12 lg:px-16 pt-10 pb-32">
        <div className="flex items-end justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow text-zinc-400 mb-2">
              {products.length} Styles
            </p>
            <h3 className="text-zinc-900">All Sunglasses</h3>
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-100"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07 } },
          }}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="bg-white"
            >
              <CollectionCard
                product={product}
                categoryLabel="Sunglasses"
                imageSizes="(max-width: 768px) 50vw, 25vw"
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────────── */}
      <section className="border-t border-zinc-100 py-32 px-8 flex flex-col items-center text-center gap-8">
        <motion.h4
          className="max-w-lg text-zinc-900"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          Explore More Collections
        </motion.h4>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Link href="/collections" className={buttonVariants()}>
            Shop All
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
