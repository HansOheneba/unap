"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { buttonVariants } from "@/components/ui/button";

const featured = [
  {
    id: 1,
    name: "Sovereign Hoodie",
    category: "Tops",
    price: "$165",
    href: "/collections",
    size: "large",
  },
  {
    id: 2,
    name: "Shadow Cargo",
    category: "Pants",
    price: "$195",
    href: "/collections",
    size: "small",
  },
  {
    id: 3,
    name: "Eclipse Shades",
    category: "Sunglasses",
    price: "$145",
    href: "/collections",
    size: "small",
  },
  {
    id: 4,
    name: "Refusal Brim",
    category: "Head Wears",
    price: "$65",
    href: "/collections",
    size: "small",
  },
];

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
  return (
    <section className="bg-black text-white py-32 px-8 md:px-20">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <FadeIn>
            <p className="eyebrow mb-4">The Collection</p>
            <h2 className="max-w-lg">Dressed for the Unapologetic</h2>
          </FadeIn>
          <FadeIn delay={0.15} className="shrink-0">
            <Link href="/collections" className={buttonVariants()}>
              Shop All
            </Link>
          </FadeIn>
        </div>

        {/* Product grid */}
        {/* Desktop: hero card left (2 cols tall) + 3 stacked/side right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-white/5">
          {/* Hero card — spans 7 cols */}
          <FadeIn className="md:col-span-7 bg-black group">
            <Link
              href={featured[0].href}
              className="block relative w-full"
              style={{ aspectRatio: "3/4" }}
            >
              <Image
                src="/home/manStudio.jpg"
                alt={featured[0].name}
                fill
                className="object-cover brightness-90 group-hover:brightness-100 transition-[filter] duration-700"
              />
              <span className="absolute top-6 left-6 eyebrow text-white/70">
                {featured[0].category}
              </span>
            </Link>
            <div className="flex items-center justify-between px-6 py-5 bg-black border-t border-white/5">
              <h5 className="text-white">{featured[0].name}</h5>
              <span className="eyebrow text-white/70">{featured[0].price}</span>
            </div>
          </FadeIn>

          {/* Right col — 3 smaller cards stacked */}
          <div className="md:col-span-5 flex flex-col gap-px bg-white/5">
            {featured.slice(1).map((product, i) => (
              <FadeIn
                key={product.id}
                delay={0.1 * (i + 1)}
                className="bg-black group"
              >
                <Link
                  href={product.href}
                  className="block relative w-full"
                  style={{ aspectRatio: "4/3" }}
                >
                  <Image
                    src={
                      product.id === 2
                        ? "/home/track.jpg"
                        : product.id === 3
                          ? "/home/shadesMan.jpg"
                          : "/home/manBlackCap.jpg"
                    }
                    alt={product.name}
                    fill
                    className="object-cover brightness-85 group-hover:brightness-100 transition-[filter] duration-700"
                  />
                  <span className="absolute top-4 left-4 eyebrow text-white/70">
                    {product.category}
                  </span>
                </Link>
                <div className="flex items-center justify-between px-5 py-4 bg-black border-t border-white/5">
                  <h5 className="text-white text-sm">{product.name}</h5>
                  <span className="eyebrow text-white/70">{product.price}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Bottom line */}
        <FadeIn delay={0.2}>
          <p className="text-white/70 text-center text-sm tracking-wider uppercase">
            Every piece carries intention. None of it is accidental.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
