"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getProductsByCategory } from "@/lib/products";
import { formatPrice } from "@/lib/currency";

export default function TracksPage() {
  const products = getProductsByCategory("tracks");

  return (
    <main className="bg-white text-zinc-900 min-h-screen overflow-x-hidden">
      {/* ── HERO BANNER ────────────────────────────────────────────── */}
      <section className="relative w-full h-[65vh] overflow-hidden">
        <Image
          src="/collections/tracks/track.jpg"
          alt="In Motion"
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
            Tracks
          </motion.p>
          <motion.h1
            className="text-white leading-none"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            In Motion
          </motion.h1>
          <motion.p
            className="text-white/75 max-w-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.25 }}
          >
            Movement is not optional. Neither is the standard you carry while
            doing it.
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

      {/* ── PRODUCTS — cinematic two-col layout ──────────────────────── */}
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
            <h3 className="text-zinc-900">All Tracks</h3>
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-100"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
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
              className="group bg-white"
            >
              <Link
                href={`/collections/tracks/${product.slug}`}
                className="block"
              >
                <div className="relative overflow-hidden aspect-3/4">
                  <Image
                    src={product.variants[0].images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-6 border-t border-zinc-100 flex flex-col gap-3">
                  <p className="eyebrow text-zinc-500">Tracks</p>
                  <h4 className="text-zinc-900">{product.name}</h4>
                  <p className="text-zinc-600 mt-1">{formatPrice(product.price)}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── EDITORIAL STRIP ──────────────────────────────────────────── */}
      <section className="relative w-full h-[50vh] overflow-hidden">
        <Image
          src="/home/track.jpg"
          alt="Tracks in motion"
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
          <motion.h3
            className="text-white max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            Built for the ones who never stopped.
          </motion.h3>
        </div>
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
