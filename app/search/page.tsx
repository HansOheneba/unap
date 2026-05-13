"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import AddToCartButton from "@/components/ui/add-to-cart-button";

/* ── All products catalogue ── */
const ALL_PRODUCTS = [
  // Boxers
  {
    id: "boxers-1",
    name: "Classic White",
    price: "US$45",
    priceNum: 45,
    img: "/collections/boxers/boxersWhite.jpeg",
    category: "Boxers",
    href: "/collections/boxers",
  },
  {
    id: "boxers-2",
    name: "Midnight Blue",
    price: "US$45",
    priceNum: 45,
    img: "/collections/boxers/boxersBlue.jpg",
    category: "Boxers",
    href: "/collections/boxers",
  },
  {
    id: "boxers-3",
    name: "Bourbon Brown",
    price: "US$45",
    priceNum: 45,
    img: "/collections/boxers/boxersBrown.jpeg",
    category: "Boxers",
    href: "/collections/boxers",
  },
  {
    id: "boxers-4",
    name: "Storm Gray",
    price: "US$45",
    priceNum: 45,
    img: "/collections/boxers/boxersGray.jpg",
    category: "Boxers",
    href: "/collections/boxers",
  },
  {
    id: "boxers-5",
    name: "Ivory",
    price: "US$45",
    priceNum: 45,
    img: "/collections/boxers/boxersCream.jpeg",
    category: "Boxers",
    href: "/collections/boxers",
  },
  {
    id: "boxers-6",
    name: "Monochrome",
    price: "US$45",
    priceNum: 45,
    img: "/collections/boxers/boxersBlackWhite.jpeg",
    category: "Boxers",
    href: "/collections/boxers",
  },
  {
    id: "boxers-7",
    name: "The Full Set",
    price: "US$240",
    priceNum: 240,
    img: "/collections/boxers/boxersMixed.jpeg",
    category: "Boxers",
    href: "/collections/boxers",
  },
  // Tops
  {
    id: "tops-1",
    name: "Revolt Oversized Tee",
    price: "US$85",
    priceNum: 85,
    img: "/collections/men_shirt/shirtCollection.jpeg",
    category: "Tops",
    href: "/collections/tops",
  },
  {
    id: "tops-2",
    name: "Phantom Long Sleeve Brown",
    price: "US$110",
    priceNum: 110,
    img: "/collections/female_shirts/shirtBrown.jpeg",
    category: "Tops",
    href: "/collections/tops",
  },
  {
    id: "tops-3",
    name: "Sovereign Crop Cream",
    price: "US$95",
    priceNum: 95,
    img: "/collections/female_shirts/shirtCream.jpeg",
    category: "Tops",
    href: "/collections/tops",
  },
  // Headwear
  {
    id: "headwear-1",
    name: "Bold Society Black",
    price: "US$65",
    priceNum: 65,
    img: "/collections/headwear/boldSocietyCapBlack.jpeg",
    category: "Headwear",
    href: "/collections/headwear",
  },
  {
    id: "headwear-2",
    name: "Bold Society Cream",
    price: "US$65",
    priceNum: 65,
    img: "/collections/headwear/boldSocietyCapCream.jpeg",
    category: "Headwear",
    href: "/collections/headwear",
  },
  {
    id: "headwear-3",
    name: "Bold Society Red",
    price: "US$65",
    priceNum: 65,
    img: "/collections/headwear/boldSocietyCapRed.jpeg",
    category: "Headwear",
    href: "/collections/headwear",
  },
  {
    id: "headwear-4",
    name: "Suede Cap Black",
    price: "US$75",
    priceNum: 75,
    img: "/collections/headwear/suedeCapBlack.jpg",
    category: "Headwear",
    href: "/collections/headwear",
  },
  {
    id: "headwear-5",
    name: "Sovereign Beanie",
    price: "US$55",
    priceNum: 55,
    img: "/collections/headwear/beanie.jpg",
    category: "Headwear",
    href: "/collections/headwear",
  },
  {
    id: "headwear-6",
    name: "Sovereign Beanie Red",
    price: "US$55",
    priceNum: 55,
    img: "/collections/headwear/beanieRed.jpg",
    category: "Headwear",
    href: "/collections/headwear",
  },
  // Sunglasses
  {
    id: "sunglasses-1",
    name: "Outlaw I",
    price: "US$145",
    priceNum: 145,
    img: "/collections/glases/outlawGlasses1.jpg",
    category: "Sunglasses",
    href: "/collections/sunglasses",
  },
  {
    id: "sunglasses-2",
    name: "Outlaw II",
    price: "US$145",
    priceNum: 145,
    img: "/collections/glases/outlawGlasses3.jpg",
    category: "Sunglasses",
    href: "/collections/sunglasses",
  },
  {
    id: "sunglasses-3",
    name: "Outlaw III",
    price: "US$135",
    priceNum: 135,
    img: "/collections/glases/outlawGlases4.jpg",
    category: "Sunglasses",
    href: "/collections/sunglasses",
  },
  {
    id: "sunglasses-4",
    name: "Eclipse",
    price: "US$150",
    priceNum: 150,
    img: "/collections/glases/outlawGlasses5.jpg",
    category: "Sunglasses",
    href: "/collections/sunglasses",
  },
  {
    id: "sunglasses-5",
    name: "Sovereign",
    price: "US$125",
    priceNum: 125,
    img: "/collections/glases/shadesFemale.jpg",
    category: "Sunglasses",
    href: "/collections/sunglasses",
  },
  {
    id: "sunglasses-6",
    name: "Sovereign II",
    price: "US$125",
    priceNum: 125,
    img: "/collections/glases/shadesFemale2.jpg",
    category: "Sunglasses",
    href: "/collections/sunglasses",
  },
  {
    id: "sunglasses-7",
    name: "Obsidian",
    price: "US$135",
    priceNum: 135,
    img: "/collections/glases/shadesFemale3.jpg",
    category: "Sunglasses",
    href: "/collections/sunglasses",
  },
  {
    id: "sunglasses-8",
    name: "Eclipse (Womens)",
    price: "US$135",
    priceNum: 135,
    img: "/collections/glases/shadesFemale4.jpg",
    category: "Sunglasses",
    href: "/collections/sunglasses",
  },
  // Tracks
  {
    id: "tracks-1",
    name: "Sovereign Track",
    price: "US$120",
    priceNum: 120,
    img: "/collections/tracks/track.jpg",
    category: "Tracks",
    href: "/collections/tracks",
  },
  {
    id: "tracks-2",
    name: "Sovereign Track II",
    price: "US$120",
    priceNum: 120,
    img: "/collections/tracks/track2.jpg",
    category: "Tracks",
    href: "/collections/tracks",
  },
  // Hoodies
  {
    id: "hoodies-1",
    name: "Sovereign Hoodie",
    price: "US$135",
    priceNum: 135,
    img: "/collections/hoodies/hoodieBlackMan.jpg",
    category: "Hoodies",
    href: "/collections/hoodies",
  },
  {
    id: "hoodies-2",
    name: "Spectrum Hoodie",
    price: "US$135",
    priceNum: 135,
    img: "/collections/hoodies/hoodieColors.jpg",
    category: "Hoodies",
    href: "/collections/hoodies",
  },
  {
    id: "hoodies-3",
    name: "Rebel Hoodie",
    price: "US$140",
    priceNum: 140,
    img: "/collections/hoodies/hoodieManXMan.jpg",
    category: "Hoodies",
    href: "/collections/hoodies",
  },
  // Lingerie
  {
    id: "lingerie-1",
    name: "Soft Power Set",
    price: "US$95",
    priceNum: 95,
    img: "/collections/female_undergarments/lingerie.jpeg",
    category: "Lingerie",
    href: "/collections/lingerie",
  },
];

const CATEGORIES = [
  "All",
  "Boxers",
  "Tops",
  "Headwear",
  "Sunglasses",
  "Tracks",
  "Hoodies",
  "Lingerie",
];

function parsePrice(p: string) {
  return parseFloat(p.replace(/[^0-9.]/g, ""));
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = ALL_PRODUCTS.filter((p) => {
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      q === "" ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  const hasQuery = query.trim().length > 0;

  return (
    <main className="bg-white text-zinc-900 min-h-screen">
      {/* Search bar */}
      <div className="border-b border-zinc-100 sticky top-16 z-30 bg-white">
        <div className="max-w-360 mx-auto px-6 md:px-20 py-6 flex items-center gap-4">
          <Search size={18} className="text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH PRODUCTS..."
            className="flex-1 bg-transparent text-zinc-900 placeholder:text-zinc-300 text-[0.8rem] tracking-widest uppercase outline-none"
          />
          <AnimatePresence>
            {hasQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                onClick={() => setQuery("")}
                className="text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <X size={16} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Category filters */}
      <div className="border-b border-zinc-100">
        <div className="max-w-360 mx-auto px-6 md:px-20">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-5 py-4 text-[0.65rem] tracking-[0.35em] uppercase font-semibold border-b-2 transition-colors duration-200 ${
                  activeCategory === cat
                    ? "border-zinc-900 text-zinc-900"
                    : "border-transparent text-zinc-400 hover:text-zinc-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result count */}
      <div className="max-w-360 mx-auto px-6 md:px-20 py-8">
        <p className="text-[0.65rem] tracking-[0.35em] uppercase text-zinc-400">
          {hasQuery || activeCategory !== "All"
            ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`
            : `${ALL_PRODUCTS.length} products`}
        </p>
      </div>

      {/* Results grid */}
      <div className="max-w-360 mx-auto px-6 md:px-20 pb-32">
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-100"
            >
              {filtered.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white group flex flex-col"
                >
                  <Link
                    href={product.href}
                    className="relative aspect-3/4 overflow-hidden block"
                  >
                    <Image
                      src={product.img}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </Link>
                  <div className="p-4 flex flex-col gap-3 flex-1">
                    <div>
                      <p className="text-[0.6rem] tracking-[0.3em] uppercase text-zinc-400 mb-1">
                        {product.category}
                      </p>
                      <h5 className="text-zinc-900 text-sm font-medium leading-snug">
                        {product.name}
                      </h5>
                      <p className="text-zinc-500 text-sm mt-1">
                        {product.price}
                      </p>
                    </div>
                    <div className="mt-auto">
                      <AddToCartButton
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        priceNum={parsePrice(product.price)}
                        img={product.img}
                        category={product.category}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center py-40 gap-5"
            >
              <p className="text-[0.65rem] tracking-[0.4em] uppercase text-zinc-300">
                No results
              </p>
              <p className="text-zinc-400 text-lg font-light max-w-xs leading-relaxed">
                Nothing matched &ldquo;{query}&rdquo;. Try a different word or
                browse by category.
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setActiveCategory("All");
                }}
                className="mt-4 text-[0.65rem] tracking-[0.35em] uppercase text-zinc-900 underline underline-offset-4"
              >
                Clear search
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
