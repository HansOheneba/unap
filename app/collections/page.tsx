"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import AddToCartButton from "@/components/ui/add-to-cart-button";

const parsePrice = (p: string) => parseInt(p.replace(/[^0-9]/g, ""), 10);

// ── TYPES ─────────────────────────────────────────────────────────────────────

type Product = {
  id: number;
  name: string;
  tag: string;
  price: string;
  img: string;
  href: string;
};

type Collection = {
  id: string;
  subtitle: string;
  title: string;
  tagline: string;
  featured: string;
  align: "left" | "right";
  href: string;
  cols: 3 | 4;
  products: Product[];
};

// ── DATA ──────────────────────────────────────────────────────────────────────

const overviewCards = [
  {
    id: "sunglasses",
    label: "Sunglasses",
    img: "/collections/glases/outlawGlasses1.jpg",
  },
  {
    id: "headwear",
    label: "Head Wears",
    img: "/collections/headwear/boldSocietyCapBlack.jpeg",
  },
  {
    id: "tops",
    label: "Tops",
    img: "/collections/men_shirt/shirtCollection.jpeg",
  },
  {
    id: "intimates",
    label: "Boxers",
    img: "/collections/boxers/boxersMixed.jpeg",
  },
  {
    id: "tracks",
    label: "Tracks",
    img: "/collections/tracks/track.jpg",
  },
  {
    id: "hoodies",
    label: "Hoodies",
    img: "/collections/hoodies/hoodieBlackMan.jpg",
  },
  {
    id: "lingerie",
    label: "Lingerie",
    img: "/collections/female_undergarments/lingerie.jpeg",
  },
];

const collections: Collection[] = [
  {
    id: "sunglasses",
    subtitle: "Sunglasses",
    title: "The Eclipse Edit",
    tagline:
      "The world looks different when you stop apologizing for the view.",
    featured: "/collections/glases/outlawGlasses1.jpg",
    align: "left",
    href: "/collections/sunglasses",
    cols: 4,
    products: [
      {
        id: 1,
        name: "Eclipse Shades",
        tag: "Signature",
        price: "US$145",
        img: "/collections/glases/outlawGlasses1.jpg",
        href: "/collections/sunglasses",
      },
      {
        id: 2,
        name: "Obsidian Lens",
        tag: "Statement",
        price: "US$160",
        img: "/collections/glases/outlawGlasses3.jpg",
        href: "/collections/sunglasses",
      },
      {
        id: 3,
        name: "Outlaw I",
        tag: "Classic",
        price: "US$135",
        img: "/collections/glases/outlawGlases4.jpg",
        href: "/collections/sunglasses",
      },
      {
        id: 4,
        name: "Outlaw II",
        tag: "Limited",
        price: "US$150",
        img: "/collections/glases/outlawGlasses5.jpg",
        href: "/collections/sunglasses",
      },
    ],
  },
  {
    id: "headwear",
    subtitle: "Head Wears",
    title: "Bold Society",
    tagline:
      "A statement for those who stopped asking for a seat at the table.",
    featured: "/collections/headwear/boldSocietyCapBlack.jpeg",
    align: "right",
    href: "/collections/headwear",
    cols: 4,
    products: [
      {
        id: 5,
        name: "Bold Society Black",
        tag: "Signature",
        price: "US$65",
        img: "/collections/headwear/boldSocietyCapBlack.jpeg",
        href: "/collections/headwear",
      },
      {
        id: 6,
        name: "Bold Society Cream",
        tag: "Classic",
        price: "US$65",
        img: "/collections/headwear/boldSocietyCapCream.jpeg",
        href: "/collections/headwear",
      },
      {
        id: 7,
        name: "Bold Society Red",
        tag: "Bold",
        price: "US$65",
        img: "/collections/headwear/boldSocietyCapRed.jpeg",
        href: "/collections/headwear",
      },
      {
        id: 8,
        name: "Suede Cap Black",
        tag: "Premium",
        price: "US$75",
        img: "/collections/headwear/suedeCapBlack.jpg",
        href: "/collections/headwear",
      },
    ],
  },
  {
    id: "tops",
    subtitle: "Tops",
    title: "The Anti-Uniform",
    tagline: "Move in silence. Let the fabric do the talking.",
    featured: "/collections/men_shirt/shirtCollection.jpeg",
    align: "left",
    href: "/collections/tops",
    cols: 3,
    products: [
      {
        id: 9,
        name: "Revolt Oversized Tee",
        tag: "Mens",
        price: "US$85",
        img: "/collections/men_shirt/shirtCollection.jpeg",
        href: "/collections/tops",
      },
      {
        id: 10,
        name: "Phantom Long Sleeve",
        tag: "Womens",
        price: "US$110",
        img: "/collections/female_shirts/shirtBrown.jpeg",
        href: "/collections/tops",
      },
      {
        id: 11,
        name: "Sovereign Crop",
        tag: "Womens",
        price: "US$95",
        img: "/collections/female_shirts/shirtCream.jpeg",
        href: "/collections/tops",
      },
    ],
  },
  {
    id: "intimates",
    subtitle: "Intimates & Boxers",
    title: "Beneath The Surface",
    tagline: "Confidence starts where no one else can see.",
    featured: "/collections/boxers/boxersMixed.jpeg",
    align: "right",
    href: "/collections/boxers",
    cols: 4,
    products: [
      {
        id: 12,
        name: "Classic White",
        tag: "Essential",
        price: "US$45",
        img: "/collections/boxers/boxersWhite.jpeg",
        href: "/collections/boxers",
      },
      {
        id: 13,
        name: "Midnight Blue",
        tag: "Statement",
        price: "US$45",
        img: "/collections/boxers/boxersBlue.jpg",
        href: "/collections/boxers",
      },
      {
        id: 14,
        name: "Bourbon Brown",
        tag: "Signature",
        price: "US$45",
        img: "/collections/boxers/boxersBrown.jpeg",
        href: "/collections/boxers",
      },
      {
        id: 15,
        name: "Storm Gray",
        tag: "Classic",
        price: "US$45",
        img: "/collections/boxers/boxersGray.jpg",
        href: "/collections/boxers",
      },
    ],
  },
  {
    id: "tracks",
    subtitle: "Tracks",
    title: "In Motion",
    tagline:
      "Movement is not optional. Neither is the standard you carry while doing it.",
    featured: "/collections/tracks/track.jpg",
    align: "left",
    href: "/collections/tracks",
    cols: 3,
    products: [
      {
        id: 16,
        name: "Sovereign Track",
        tag: "Signature",
        price: "US$120",
        img: "/collections/tracks/track.jpg",
        href: "/collections/tracks",
      },
      {
        id: 17,
        name: "Sovereign Track II",
        tag: "Limited",
        price: "US$120",
        img: "/collections/tracks/track2.jpg",
        href: "/collections/tracks",
      },
    ],
  },
  {
    id: "hoodies",
    subtitle: "Hoodies",
    title: "Sovereign Warmth",
    tagline: "The weight on your back should feel like armor, not obligation.",
    featured: "/collections/hoodies/hoodieBlackMan.jpg",
    align: "right",
    href: "/collections/hoodies",
    cols: 3,
    products: [
      {
        id: 18,
        name: "Sovereign Hoodie",
        tag: "Signature",
        price: "US$135",
        img: "/collections/hoodies/hoodieBlackMan.jpg",
        href: "/collections/hoodies",
      },
      {
        id: 19,
        name: "Spectrum Hoodie",
        tag: "Statement",
        price: "US$135",
        img: "/collections/hoodies/hoodieColors.jpg",
        href: "/collections/hoodies",
      },
      {
        id: 20,
        name: "Rebel Hoodie",
        tag: "Limited",
        price: "US$140",
        img: "/collections/hoodies/hoodieManXMan.jpg",
        href: "/collections/hoodies",
      },
    ],
  },
  {
    id: "lingerie",
    subtitle: "Lingerie",
    title: "Soft Power",
    tagline: "What you wear beneath says everything about how you carry yourself.",
    featured: "/collections/female_undergarments/lingerie.jpeg",
    align: "left",
    href: "/collections/lingerie",
    cols: 3,
    products: [
      {
        id: 21,
        name: "Soft Power Set",
        tag: "Signature",
        price: "US$95",
        img: "/collections/female_undergarments/lingerie.jpeg",
        href: "/collections/lingerie",
      },
    ],
  },
];

const navItems = [
  { id: "sunglasses", label: "Sunglasses" },
  { id: "headwear", label: "Head Wears" },
  { id: "tops", label: "Tops" },
  { id: "intimates", label: "Intimates" },
  { id: "tracks", label: "Tracks" },
  { id: "hoodies", label: "Hoodies" },
  { id: "lingerie", label: "Lingerie" },
];

// ── PAGE ──────────────────────────────────────────────────────────────────────

export default function CollectionsPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="bg-white text-zinc-900 min-h-screen overflow-x-hidden">
      {/* ── VIDEO STRIP ─────────────────────────────────────────────────── */}
      <section className="relative w-full h-[52vh] overflow-hidden">
        <video
          ref={videoRef}
          src="/hero/hero_vid2.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/70" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.p
            className="eyebrow text-white mb-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            The Full Collection
          </motion.p>
          <motion.h1
            className="text-white max-w-4xl"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Not Products.
            <br />
            Symbols of Identity.
          </motion.h1>
          <motion.p
            className="text-white/70 mt-5 max-w-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            Every piece carries meaning. Every thread tells a story.
          </motion.p>
        </div>
      </section>

      {/* ── STICKY NAV ──────────────────────────────────────────────────── */}
      <nav className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-360 mx-auto px-8 md:px-16 flex items-center gap-10 h-14 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="eyebrow text-zinc-500 hover:text-zinc-900 transition-colors duration-300 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── COLLECTION OVERVIEW CARDS ────────────────────────────────────── */}
      <section className="max-w-360 mx-auto px-6 md:px-12 lg:px-16 pt-16 pb-20">
        <div className="flex items-end justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow text-zinc-500 mb-3">Shop By Category</p>
            <h3 className="text-zinc-900">Everything We Make</h3>
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-5 gap-px bg-zinc-100"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07 } },
          }}
        >
          {overviewCards.map((card, i) => (
            <motion.button
              key={i}
              onClick={() => scrollTo(card.id)}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="group relative bg-white overflow-hidden aspect-3/4 cursor-pointer text-left"
            >
              <Image
                src={card.img}
                alt={card.label}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <p className="eyebrow text-white mb-1">{card.label}</p>
                <span className="eyebrow text-white/60 group-hover:text-white transition-colors duration-300">
                  Shop →
                </span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </section>

      <div className="w-full h-px bg-zinc-100" />

      {/* ── COLLECTION SECTIONS ──────────────────────────────────────────── */}
      {collections.map((col, i) => (
        <section key={col.id} id={col.id}>
          {/* Cinematic featured banner */}
          <div className="relative w-full h-[78vh] overflow-hidden">
            <Image
              src={col.featured}
              alt={col.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority={i < 2}
            />
            {col.align === "left" ? (
              <>
                <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-linear-to-l from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
              </>
            )}

            {col.align === "left" && (
              <div className="absolute bottom-0 left-0 flex flex-col gap-5 p-10 md:p-16 lg:p-20 max-w-2xl">
                <motion.p
                  className="eyebrow text-white"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  {col.subtitle}
                </motion.p>
                <motion.h2
                  className="text-white leading-none"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1,
                    delay: 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {col.title}
                </motion.h2>
                <motion.p
                  className="text-white/75 max-w-sm"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.25 }}
                >
                  {col.tagline}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Link href={col.href} className={buttonVariants()}>
                    Shop {col.subtitle}
                  </Link>
                </motion.div>
              </div>
            )}

            {col.align === "right" && (
              <div className="absolute bottom-0 right-0 flex flex-col gap-5 p-10 md:p-16 lg:p-20 max-w-2xl items-end text-right">
                <motion.p
                  className="eyebrow text-white"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  {col.subtitle}
                </motion.p>
                <motion.h2
                  className="text-white leading-none"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1,
                    delay: 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {col.title}
                </motion.h2>
                <motion.p
                  className="text-white/75 max-w-sm"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.25 }}
                >
                  {col.tagline}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Link href={col.href} className={buttonVariants()}>
                    Shop {col.subtitle}
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Product grid */}
          <div className="max-w-360 mx-auto px-6 md:px-12 lg:px-16 pt-14 pb-24">
            <motion.div
              className={`grid gap-px bg-zinc-100 ${
                col.cols === 3
                  ? "grid-cols-2 md:grid-cols-3"
                  : "grid-cols-2 md:grid-cols-4"
              }`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } },
              }}
            >
              {col.products.map((product) => (
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
                  <Link href={product.href} className="block">
                    <div className="relative overflow-hidden aspect-3/4">
                      <Image
                        src={product.img}
                        alt={product.name}
                        fill
                        sizes={
                          col.cols === 3
                            ? "(max-width: 768px) 50vw, 33vw"
                            : "(max-width: 768px) 50vw, 25vw"
                        }
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                      <span className="absolute top-4 left-4 eyebrow text-white bg-black/40 backdrop-blur-sm px-2 py-1">
                        {product.tag}
                      </span>
                    </div>

                    <div className="p-5 border-t border-zinc-100">
                      <p className="eyebrow text-zinc-500 mb-2">
                        {col.subtitle}
                      </p>
                      <h5 className="text-zinc-900">{product.name}</h5>
                      <p className="text-zinc-600 mt-2">{product.price}</p>
                    </div>
                  </Link>
                  <div className="px-5 pb-5">
                    <AddToCartButton
                      id={`${col.id}-${product.id}`}
                      name={product.name}
                      price={product.price}
                      priceNum={parsePrice(product.price)}
                      img={product.img}
                      category={col.subtitle}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className="flex justify-center mt-10 md:hidden">
              <Link
                href={col.href}
                className={buttonVariants({ variant: "outline" })}
              >
                View All {col.subtitle}
              </Link>
            </div>
          </div>

          {i < collections.length - 1 && (
            <div className="w-full h-px bg-zinc-100" />
          )}
        </section>
      ))}

      {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
      <section className="border-t border-zinc-100 py-40 px-8 flex flex-col items-center text-center gap-8">
        <motion.p
          className="eyebrow text-zinc-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          The Full Collection
        </motion.p>
        <motion.h3
          className="max-w-lg text-zinc-900"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          Every Piece Is a Decision. Make Yours.
        </motion.h3>
        <motion.p
          className="text-zinc-500 max-w-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Browse the full range or start with what calls to you. There is no
          wrong entry point into who you are.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link href="/collections" className={buttonVariants()}>
            View Everything
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
