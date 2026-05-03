"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";

const categories = ["All", "Tops", "Head Wears", "Pants", "Sunglasses"] as const;
type Category = (typeof categories)[number];

type Product = {
  id: number;
  name: string;
  tagline: string;
  price: number;
  category: Exclude<Category, "All">;
  href: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Revolt Oversized Tee",
    tagline: "The anti-uniform. Oversized silhouette for those who refuse to conform.",
    price: 85,
    category: "Tops",
    href: "/collections/tops",
  },
  {
    id: 2,
    name: "Phantom Long Sleeve",
    tagline: "Move in silence. Engineered for those who let the fabric do the talking.",
    price: 110,
    category: "Tops",
    href: "/collections/tops",
  },
  {
    id: 3,
    name: "Sovereign Hoodie",
    tagline: "Worn by those who rule their own world. Zero compromise on presence.",
    price: 165,
    category: "Tops",
    href: "/collections/tops",
  },
  {
    id: 4,
    name: "Shadow Cargo",
    tagline: "Technical construction. Statement silhouette. Built for the unapologetic.",
    price: 195,
    category: "Pants",
    href: "/collections/pants",
  },
  {
    id: 5,
    name: "Void Wide Leg",
    tagline: "Space is not given — it is taken. Wear accordingly.",
    price: 175,
    category: "Pants",
    href: "/collections/pants",
  },
  {
    id: 6,
    name: "Refusal Brim",
    tagline: "A cap for those who stopped asking for a seat at the table.",
    price: 65,
    category: "Head Wears",
    href: "/collections/head-wears",
  },
  {
    id: 7,
    name: "Signal Beanie",
    tagline: "Quiet on the outside. Everything on the inside.",
    price: 55,
    category: "Head Wears",
    href: "/collections/head-wears",
  },
  {
    id: 8,
    name: "Eclipse Shades",
    tagline: "The world looks different when you stop apologizing for the view.",
    price: 145,
    category: "Sunglasses",
    href: "/collections/sunglasses",
  },
  {
    id: 9,
    name: "Obsidian Lens",
    tagline: "Worn by those who have already decided. The rest is just scenery.",
    price: 160,
    category: "Sunglasses",
    href: "/collections/sunglasses",
  },
];

const categoryHrefs: Record<Category, string> = {
  All: "/collections",
  Tops: "/collections/tops",
  "Head Wears": "/collections/head-wears",
  Pants: "/collections/pants",
  Sunglasses: "/collections/sunglasses",
};

export default function CollectionsPage() {
  const [active, setActive] = useState<Category>("All");

  const filtered =
    active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <main className="bg-black text-white min-h-screen">
      {/* ── HEADER ── */}
      <section className="pt-48 pb-20 px-8 md:px-20 text-center flex flex-col items-center gap-6">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          003 | The Symbols
        </motion.p>
        <motion.h1
          className="max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          Not Products. Symbols of Identity.
        </motion.h1>
        <motion.p
          className="text-white/45 max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Every piece carries meaning. Every thread tells a story.
        </motion.p>
      </section>

      {/* ── FILTER TABS ── */}
      <div className="flex items-center justify-center gap-3 flex-wrap px-8 pb-20">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`text-[0.7rem] tracking-widest uppercase px-6 py-2.5 border transition-colors duration-300 ${
              active === cat
                ? "border-white bg-white text-black"
                : "border-white/20 text-white/50 hover:border-white/50 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── PRODUCT GRID ── */}
      <div className="px-8 md:px-20 max-w-7xl mx-auto pb-32">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="group bg-black"
              >
                {/* Image */}
                <Link href={product.href} className="block relative aspect-3/4 overflow-hidden">
                  <Image
                    src="/creed/creed.jpg"
                    alt={product.name}
                    fill
                    className="object-cover brightness-75 group-hover:brightness-100 transition-[filter] duration-700"
                  />
                  {/* category pill */}
                  <span className="absolute top-5 left-5 eyebrow text-white/60">
                    {product.category}
                  </span>
                </Link>

                {/* Info */}
                <div className="p-7 flex flex-col gap-3 border-t border-white/5">
                  <h5 className="text-white">{product.name}</h5>
                  <p className="text-white/45 text-sm leading-relaxed">{product.tagline}</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-white text-sm tracking-wider">${product.price}</span>
                    <Link
                      href={product.href}
                      className="eyebrow text-white/40 hover:text-white transition-colors duration-300"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Collection CTA — shown when a specific category is active */}
        <AnimatePresence>
          {active !== "All" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-5 pt-20 text-center"
            >
              <p className="eyebrow text-white/40">
                Viewing {active}
              </p>
              <h4 className="text-white max-w-sm">
                Everything in {active}
              </h4>
              <Link href={categoryHrefs[active]} className={buttonVariants()}>
                Shop All {active}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── BOTTOM CTA ── */}
      <section className="border-t border-white/10 py-40 px-8 flex flex-col items-center text-center gap-8">
        <p className="eyebrow text-white/40">The Full Collection</p>
        <h3 className="max-w-lg text-white">
          Every Piece Is a Decision. Make Yours.
        </h3>
        <p className="text-white/40 max-w-sm">
          Browse the full range or start with what calls to you. There is no wrong entry point into who you are.
        </p>
        <Link href="/collections" className={buttonVariants()}>
          View Everything
        </Link>
      </section>
    </main>
  );
}
