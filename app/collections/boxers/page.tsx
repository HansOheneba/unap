"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Classic White",
    tag: "Essential",
    price: "US$45",
    img: "/collections/boxers/boxersWhite.jpeg",
  },
  {
    id: 2,
    name: "Midnight Blue",
    tag: "Statement",
    price: "US$45",
    img: "/collections/boxers/boxersBlue.jpg",
  },
  {
    id: 3,
    name: "Bourbon Brown",
    tag: "Signature",
    price: "US$45",
    img: "/collections/boxers/boxersBrown.jpeg",
  },
  {
    id: 4,
    name: "Storm Gray",
    tag: "Classic",
    price: "US$45",
    img: "/collections/boxers/boxersGray.jpg",
  },
  {
    id: 5,
    name: "Ivory",
    tag: "Limited",
    price: "US$45",
    img: "/collections/boxers/boxersCream.jpeg",
  },
  {
    id: 6,
    name: "Monochrome",
    tag: "Bold",
    price: "US$45",
    img: "/collections/boxers/boxersBlackWhite.jpeg",
  },
  {
    id: 7,
    name: "The Full Set",
    tag: "Bundle",
    price: "US$240",
    img: "/collections/boxers/boxersMixed.jpeg",
  },
];

export default function BoxersPage() {
  return (
    <main className="bg-black text-white min-h-screen overflow-x-hidden">
      {/* ── HERO BANNER ────────────────────────────────────────────── */}
      <section className="relative w-full h-[65vh] overflow-hidden">
        <Image
          src="/collections/boxers/boxersMixed.jpeg"
          alt="Beneath the Surface"
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
            Intimates & Boxers
          </motion.p>
          <motion.h1
            className="text-white leading-none"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Beneath the Surface
          </motion.h1>
          <motion.p
            className="text-white/75 max-w-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.25 }}
          >
            Confidence starts where no one else can see.
          </motion.p>
        </div>
      </section>

      {/* ── BREADCRUMB ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-10 pb-2">
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 eyebrow text-white/40 hover:text-white transition-colors duration-300"
        >
          <ArrowLeft size={14} />
          All Collections
        </Link>
      </div>

      {/* ── SIZE CHART NOTE ──────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-8 pb-2">
        <motion.div
          className="relative overflow-hidden border border-white/10 p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <p className="eyebrow text-white mb-2">Size Reference</p>
            <p className="text-white/50 text-sm max-w-sm">
              Our boxers run true to size. S / M / L / XL / XXL available.
              Check the size chart for exact measurements.
            </p>
          </div>
          <div className="relative w-full md:w-64 aspect-video shrink-0">
            <Image
              src="/collections/boxers/boxersSizeChart.jpg"
              alt="Size Chart"
              fill
              className="object-contain"
            />
          </div>
        </motion.div>
      </div>

      {/* ── PRODUCTS GRID ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-10 pb-32">
        <div className="flex items-end justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow text-white/40 mb-2">
              {products.length} Styles
            </p>
            <h3 className="text-white">All Boxers</h3>
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5"
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
              className="group bg-black"
            >
              <div className="relative overflow-hidden aspect-3/4">
                <Image
                  src={product.img}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <span className="absolute top-4 left-4 eyebrow text-white bg-black/40 backdrop-blur-sm px-2 py-1">
                  {product.tag}
                </span>
              </div>
              <div className="p-5 border-t border-white/8">
                <p className="eyebrow text-white/50 mb-2">Boxers</p>
                <h5 className="text-white">{product.name}</h5>
                <p className="text-white/60 mt-2">{product.price}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Model shot strip */}
        <motion.div
          className="mt-px grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative aspect-video bg-black overflow-hidden group">
            <Image
              src="/collections/boxers/boxModel.jpg"
              alt="Boxer Model"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
          <div className="relative aspect-video bg-black overflow-hidden group">
            <Image
              src="/collections/boxers/boxersWhite2.jpeg"
              alt="Boxers White Detail"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
        </motion.div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────────── */}
      <section className="border-t border-white/10 py-32 px-8 flex flex-col items-center text-center gap-8">
        <motion.h4
          className="max-w-lg text-white"
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
