"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import AddToCartButton from "@/components/ui/add-to-cart-button";
import { formatPrice } from "@/lib/currency";
import { useAdminStore } from "@/lib/stores/admin-store";

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function SearchPage() {
  const collections = useAdminStore((s) => s.collections);
  const allProducts = collections.flatMap((c) => c.products);
  const categories = [
    "All",
    ...Array.from(new Set(allProducts.map((p) => capitalize(p.collectionId)))),
  ];

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = allProducts.filter((p) => {
    const category = capitalize(p.collectionId);
    const matchesCategory =
      activeCategory === "All" || category === activeCategory;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      q === "" ||
      p.name.toLowerCase().includes(q) ||
      category.toLowerCase().includes(q);
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
            {categories.map((cat) => (
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
            : `${allProducts.length} products`}
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
                    href={`/collections/${product.collectionId}/${product.id}`}
                    className="relative aspect-3/4 overflow-hidden block"
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </Link>
                  <div className="p-4 flex flex-col gap-3 flex-1">
                    <div>
                      <p className="text-[0.6rem] tracking-[0.3em] uppercase text-zinc-400 mb-1">
                        {capitalize(product.collectionId)}
                      </p>
                      <h5 className="text-zinc-900 text-sm font-medium leading-snug">
                        {product.name}
                      </h5>
                      <p className="text-zinc-500 text-sm mt-1">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                    <div className="mt-auto">
                      <AddToCartButton
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        img={product.images[0]}
                        category={capitalize(product.collectionId)}
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
