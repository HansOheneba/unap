"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AddToCartButton from "@/components/ui/add-to-cart-button";

const parsePrice = (p: string) => parseInt(p.replace(/[^0-9]/g, ""), 10);

const products = [
  {
    id: 1,
    name: "Outlaw I",
    tag: "Signature",
    price: "US$145",
    img: "/collections/glases/outlawGlasses1.jpg",
    gender: "Unisex",
  },
  {
    id: 2,
    name: "Outlaw II",
    tag: "Statement",
    price: "US$145",
    img: "/collections/glases/outlawGlasses3.jpg",
    gender: "Unisex",
  },
  {
    id: 3,
    name: "Outlaw III",
    tag: "Classic",
    price: "US$135",
    img: "/collections/glases/outlawGlases4.jpg",
    gender: "Unisex",
  },
  {
    id: 4,
    name: "Eclipse",
    tag: "Limited",
    price: "US$150",
    img: "/collections/glases/outlawGlasses5.jpg",
    gender: "Unisex",
  },
  {
    id: 5,
    name: "Sovereign",
    tag: "Womens",
    price: "US$125",
    img: "/collections/glases/shadesFemale.jpg",
    gender: "Womens",
  },
  {
    id: 6,
    name: "Sovereign II",
    tag: "Womens",
    price: "US$125",
    img: "/collections/glases/shadesFemale2.jpg",
    gender: "Womens",
  },
  {
    id: 7,
    name: "Obsidian",
    tag: "Womens",
    price: "US$135",
    img: "/collections/glases/shadesFemale3.jpg",
    gender: "Womens",
  },
  {
    id: 8,
    name: "Eclipse (Womens)",
    tag: "Womens",
    price: "US$135",
    img: "/collections/glases/shadesFemale4.jpg",
    gender: "Womens",
  },
];

export default function SunglassesPage() {
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
              className="group bg-white"
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
              <div className="p-5 border-t border-zinc-100">
                <p className="eyebrow text-zinc-500 mb-2">{product.gender}</p>
                <h5 className="text-zinc-900">{product.name}</h5>
                <p className="text-zinc-600 mt-2">{product.price}</p>
                <div className="mt-3">
                  <AddToCartButton
                    id={`sunglasses-${product.id}`}
                    name={product.name}
                    price={product.price}
                    priceNum={parsePrice(product.price)}
                    img={product.img}
                    category="Sunglasses"
                  />
                </div>
              </div>
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
