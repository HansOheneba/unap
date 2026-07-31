"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import FadeImage from "@/components/ui/fade-image";
import type { CollectionInfo, ProductSummary } from "@/lib/products";
import { formatPrice } from "@/lib/currency";
import { getBannerOffset, useBannerStore } from "@/lib/stores/banner-store";
import { COLLECTIONS_CONTAINER } from "@/lib/layout/collections";
import { cn } from "@/lib/utils";

const HERO_IMAGES = [
  "/hero/collections/collection1.JPG",
  "/hero/collections/collection2.JPG",
  "/hero/collections/collection3.JPG",
  "/hero/collections/collection4.JPG",
] as const;

const HERO_SLIDE_MS = 4500;

export type CollectionSection = {
  collection: CollectionInfo;
  products: ProductSummary[];
};

export type OverviewCard = {
  id: string;
  label: string;
  img: string;
  description: string;
};

type Props = {
  sections: CollectionSection[];
  overviewCards: OverviewCard[];
};

/**
 * Stretch trailing cards so incomplete last rows look intentional.
 * Layouts: 1 featured · 2 even · 3 → 2-col mobile / 3-col md · 4+ → 2-col mobile / 4-col md
 */
function overviewProductSpanClass(index: number, count: number): string | undefined {
  if (count <= 2) return undefined;

  const isLast = index === count - 1;
  const mobileOrphan = count % 2 === 1;

  if (count === 3) {
    return isLast && mobileOrphan ? "col-span-2 md:col-span-1" : undefined;
  }

  // count >= 4: grid-cols-2 md:grid-cols-4
  const mdRem = count % 4;

  // Rem 2: both trailing cards take half width so the row fills
  if (mdRem === 2 && (index === count - 1 || index === count - 2)) {
    return cn(isLast && mobileOrphan && "col-span-2", "md:col-span-2");
  }

  if (!isLast) return undefined;

  return cn(
    mobileOrphan && "col-span-2",
    mdRem === 1 && "md:col-span-4",
    mdRem === 3 && "md:col-span-2",
    mobileOrphan && mdRem === 0 && "md:col-span-1",
  );
}

export default function CollectionsOverview({
  sections,
  overviewCards,
}: Props) {
  const bannerVisible = useBannerStore((s) => s.visible);
  // Sticky top ignores scrollHidden so Safari can't loop on layout shifts.
  const stickyTop = getBannerOffset(bannerVisible) + 56 + 44;
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, HERO_SLIDE_MS);
    return () => window.clearInterval(id);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navItems = sections.map((s) => ({
    id: s.collection.id,
    label: s.collection.subtitle,
  }));

  return (
    <main className="bg-white text-zinc-900 min-h-screen overflow-x-hidden">
      {/* ── IMAGE STRIP ─────────────────────────────────────────────────── */}
      <section className="relative w-full h-[52vh] overflow-hidden bg-black">
        {HERO_IMAGES.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            className={cn(
              "object-cover transition-opacity duration-1000 ease-in-out",
              index === heroIndex ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/70" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className={cn(COLLECTIONS_CONTAINER, "flex flex-col items-center")}>
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
        </div>
      </section>

      {/* ── STICKY NAV ──────────────────────────────────────────────────── */}
      <nav
        style={{ top: stickyTop }}
        className="sticky z-30 bg-white/90 backdrop-blur-md border-b border-zinc-200"
      >
        <div
          className={cn(
            COLLECTIONS_CONTAINER,
            "h-14 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
        >
          <div className="flex items-center justify-center gap-8 w-max min-w-full h-full">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="eyebrow text-zinc-700 hover:text-zinc-900 transition-colors duration-300 whitespace-nowrap shrink-0 cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ── COLLECTION OVERVIEW CARDS ────────────────────────────────────── */}
      <section className={cn(COLLECTIONS_CONTAINER, "pt-16 pb-20")}>
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

        <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-zinc-100">
          {overviewCards.map((card, i) => {
            const isLastOddOnMobile =
              overviewCards.length % 2 === 1 && i === overviewCards.length - 1;

            return (
              <button
                key={i}
                onClick={() => scrollTo(card.id)}
                className={cn(
                  "group relative bg-white overflow-hidden aspect-3/4 cursor-pointer text-left",
                  isLastOddOnMobile && "col-span-2 md:col-span-1",
                )}
              >
                <FadeImage
                  src={card.img}
                  alt={card.label}
                  fill
                  sizes={
                    isLastOddOnMobile
                      ? "(max-width: 768px) 100vw, 20vw"
                      : "(max-width: 768px) 50vw, 20vw"
                  }
                  className="object-cover duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <p className="eyebrow text-white mb-1">{card.label}</p>
                  <span className="eyebrow text-white/60 group-hover:text-white transition-colors duration-300">
                    Shop →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <div className="w-full h-px bg-zinc-100" />

      {/* ── COLLECTION SECTIONS ──────────────────────────────────────────── */}
      {sections.map(({ collection: col, products }, i) => (
        <section key={col.id} id={col.id}>
          {/* Cinematic featured banner */}
          <div className="relative w-full h-[78vh] overflow-hidden">
            <FadeImage
              src={col.featured}
              alt={col.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority={i < 2}
            />
            {i % 2 === 0 ? (
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

            {i % 2 === 0 && (
              <div className="absolute inset-x-0 bottom-0">
                <div
                  className={cn(
                    COLLECTIONS_CONTAINER,
                    "pb-10 md:pb-16 lg:pb-20",
                  )}
                >
              <div className="flex flex-col gap-5 max-w-2xl">
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
                </div>
              </div>
            )}

            {i % 2 !== 0 && (
              <div className="absolute inset-x-0 bottom-0">
                <div
                  className={cn(
                    COLLECTIONS_CONTAINER,
                    "pb-10 md:pb-16 lg:pb-20",
                  )}
                >
              <div className="flex flex-col gap-5 max-w-2xl ml-auto items-end text-right">
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
                </div>
              </div>
            )}
          </div>

          {/* Product grid — adapt columns so sparse collections don’t look unfinished */}
          <div className={cn(COLLECTIONS_CONTAINER, "pt-14 pb-24")}>
            {products.length === 0 ? (
              <p className="text-zinc-400 text-sm text-center py-16">
                New pieces for {col.subtitle} are on the way.
              </p>
            ) : (
              <div
                className={cn(
                  "grid gap-px bg-zinc-100",
                  products.length === 1 && "grid-cols-1 max-w-lg mx-auto",
                  products.length === 2 && "grid-cols-2",
                  products.length === 3 && "grid-cols-2 md:grid-cols-3",
                  products.length >= 4 && "grid-cols-2 md:grid-cols-4",
                )}
              >
                {products.map((product, index) => {
                  const spanClass = overviewProductSpanClass(
                    index,
                    products.length,
                  );

                  return (
                    <div
                      key={product.slug}
                      className={cn("group bg-white", spanClass)}
                    >
                      <Link
                        href={`/collections/${col.id}/${product.slug}`}
                        className="block"
                      >
                        <div
                          className={cn(
                            "relative overflow-hidden",
                            products.length === 1 ? "aspect-4/5" : "aspect-3/4",
                          )}
                        >
                          <FadeImage
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes={
                              products.length === 1
                                ? "(max-width: 512px) 100vw, 32rem"
                                : products.length === 2
                                  ? "50vw"
                                  : spanClass
                                    ? "(max-width: 768px) 100vw, 50vw"
                                    : "(max-width: 768px) 50vw, 25vw"
                            }
                            className="object-cover duration-700 group-hover:scale-[1.04]"
                          />
                        </div>

                        <div className="p-5 border-t border-zinc-100">
                          <p className="eyebrow text-zinc-500 mb-2">
                            {col.subtitle}
                          </p>
                          {products.length === 1 ? (
                            <h4 className="text-zinc-900">{product.name}</h4>
                          ) : (
                            <h5 className="text-zinc-900">{product.name}</h5>
                          )}
                          <p className="text-zinc-600 mt-2">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-center mt-10 md:hidden">
              <Link
                href={col.href}
                className={buttonVariants({ variant: "outline" })}
              >
                View All {col.subtitle}
              </Link>
            </div>
          </div>

          {i < sections.length - 1 && (
            <div className="w-full h-px bg-zinc-100" />
          )}
        </section>
      ))}

      {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
      <section className="border-t border-zinc-100 py-40">
        <div
          className={cn(
            COLLECTIONS_CONTAINER,
            "flex flex-col items-center text-center gap-8",
          )}
        >
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
        </div>
      </section>
    </main>
  );
}
