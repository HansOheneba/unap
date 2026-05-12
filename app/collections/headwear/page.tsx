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
    name: "Bold Society Black",
    tag: "Signature",
    price: "US$65",
    img: "/collections/headwear/boldSocietyCapBlack.jpeg",
    extraImgs: [
      "/collections/headwear/boldSocietyCapBlack2.jpeg",
      "/collections/headwear/boldSocietyCapBlack3.jpeg",
    ],
  },
  {
    id: 2,
    name: "Bold Society Cream",
    tag: "Classic",
    price: "US$65",
    img: "/collections/headwear/boldSocietyCapCream.jpeg",
    extraImgs: [
      "/collections/headwear/boldSocietyCapCream2.jpeg",
      "/collections/headwear/boldSocietyCapCream3.jpeg",
    ],
  },
  {
    id: 3,
    name: "Bold Society Red",
    tag: "Bold",
    price: "US$65",
    img: "/collections/headwear/boldSocietyCapRed.jpeg",
    extraImgs: [
      "/collections/headwear/boldSocietyCapRed2.jpeg",
      "/collections/headwear/boldSocietyCapRed3.jpeg",
      "/collections/headwear/boldSocietyCapRed4.jpeg",
      "/collections/headwear/boldSocietyCapRed5.jpeg",
    ],
  },
  {
    id: 4,
    name: "Suede Cap Black",
    tag: "Premium",
    price: "US$75",
    img: "/collections/headwear/suedeCapBlack.jpg",
    extraImgs: ["/collections/headwear/suedeCapBlack2.jpeg"],
  },
  {
    id: 5,
    name: "Sovereign Beanie",
    tag: "Essential",
    price: "US$55",
    img: "/collections/headwear/beanie.jpg",
    extraImgs: [],
  },
  {
    id: 6,
    name: "Sovereign Beanie Red",
    tag: "Bold",
    price: "US$55",
    img: "/collections/headwear/beanieRed.jpg",
    extraImgs: ["/collections/headwear/beanieRed2.jpg"],
  },
];

export default function HeadwearPage() {
  return (
    <main className="bg-black text-white min-h-screen overflow-x-hidden">
      {/* ── HERO BANNER ────────────────────────────────────────────── */}
      <section className="relative w-full h-[65vh] overflow-hidden">
        <Image
          src="/collections/headwear/boldSocietyCapBlack.jpeg"
          alt="Bold Society"
          fill
          priority
          className="object-cover object-top"
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
            Head Wears
          </motion.p>
          <motion.h1
            className="text-white leading-none"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Bold Society
          </motion.h1>
          <motion.p
            className="text-white/75 max-w-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.25 }}
          >
            A statement for those who stopped asking for a seat at the table.
          </motion.p>
        </div>
      </section>

      {/* ── BREADCRUMB ──────────────────────────────────────────────── */}
      <div className="max-w-360 mx-auto px-6 md:px-12 lg:px-16 pt-10 pb-2">
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 eyebrow text-white/40 hover:text-white transition-colors duration-300"
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
            <p className="eyebrow text-white/40 mb-2">
              {products.length} Styles
            </p>
            <h3 className="text-white">All Head Wears</h3>
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-px bg-white/5"
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
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <span className="absolute top-4 left-4 eyebrow text-white bg-black/40 backdrop-blur-sm px-2 py-1">
                  {product.tag}
                </span>
              </div>
              <div className="p-5 border-t border-white/8">
                <p className="eyebrow text-white/50 mb-2">Head Wears</p>
                <h5 className="text-white">{product.name}</h5>
                <p className="text-white/60 mt-2">{product.price}</p>
                <div className="mt-3">
                  <AddToCartButton
                    id={`headwear-${product.id}`}
                    name={product.name}
                    price={product.price}
                    priceNum={parsePrice(product.price)}
                    img={product.img}
                    category="Head Wears"
                  />
                </div>
              </div>
            </motion.div>
          ))}
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
