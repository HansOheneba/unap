"use client";

import Link from "next/link";
import { Suspense, useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useCollectionsNav } from "@/components/layout/collections-nav-provider";
import AddToCartButton from "@/components/ui/add-to-cart-button";
import FadeImage from "@/components/ui/fade-image";
import { formatPrice } from "@/lib/currency";
import {
  collectionSlugFromHref,
} from "@/lib/collections-nav";
import { searchProductSummaries, type ProductSummary } from "@/lib/products";
import { preorderShipsLabel } from "@/lib/preorder";
import { getBannerOffset, useBannerStore } from "@/lib/stores/banner-store";

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const SEARCH_DEBOUNCE_MS = 300;

function SearchPageInner() {
  const searchParams = useSearchParams();
  const collectionNav = useCollectionsNav();
  const bannerVisible = useBannerStore((s) => s.visible);
  // Sticky top ignores scrollHidden so Safari can't loop on layout shifts.
  const stickyTop = getBannerOffset(bannerVisible) + 56;

  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [activeCategory, setActiveCategory] = useState("All");
  const [results, setResults] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const collectionSlugs = collectionNav
    .map((item) => collectionSlugFromHref(item.href))
    .filter((slug): slug is string => Boolean(slug));

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(true);
      searchProductSummaries({
        q: query.trim() || undefined,
        collectionId: activeCategory === "All" ? undefined : activeCategory,
        limit: 40,
      })
        .then(({ items }) => setResults(items))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeoutId);
  }, [query, activeCategory]);

  const categories = ["All", ...collectionSlugs];
  const categoryLabel = (slug: string) =>
    collectionNav.find((item) => collectionSlugFromHref(item.href) === slug)
      ?.label ?? capitalize(slug);

  const hasQuery = query.trim().length > 0;
  return (
    <main className="bg-white text-zinc-900 min-h-screen">
      {/* Search bar */}
      <div
        style={{ top: stickyTop }}
        className="border-b border-zinc-100 sticky z-30 bg-white"
      >
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                onClick={() => setQuery("")}
                className="text-zinc-400 transition-colors duration-150 hover:text-zinc-900 active:scale-95"
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
            {categories.map((slug) => (
              <button
                key={slug}
                onClick={() => setActiveCategory(slug)}
                className={`shrink-0 px-5 py-4 text-[0.65rem] tracking-[0.35em] uppercase font-semibold border-b-2 transition-colors duration-200 ${
                  activeCategory === slug
                    ? "border-zinc-900 text-zinc-900"
                    : "border-transparent text-zinc-400 hover:text-zinc-600"
                }`}
              >
                {slug === "All" ? "All" : categoryLabel(slug)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result count */}
      <div className="max-w-360 mx-auto px-6 md:px-20 py-8">
        <p className="text-[0.65rem] tracking-[0.35em] uppercase text-zinc-400">
          {loading
            ? "Searching..."
            : `${results.length} result${results.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Results grid */}
      <div className="max-w-360 mx-auto px-6 md:px-20 pb-32">
        <AnimatePresence mode="popLayout">
          {results.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-100"
            >
              {results.map((product) => (
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
                    href={`/collections/${product.category}/${product.slug}`}
                    className="relative aspect-3/4 overflow-hidden block bg-zinc-50"
                  >
                    <FadeImage
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    {product.isPreorder && (
                      <span className="absolute top-3 left-3 z-10 bg-white/95 px-2 py-1 text-[0.6rem] tracking-widest uppercase text-zinc-900">
                        Pre-order
                      </span>
                    )}
                  </Link>
                  <div className="p-4 flex flex-col gap-3 flex-1">
                    <div>
                      <p className="text-[0.6rem] tracking-[0.3em] uppercase text-zinc-400 mb-1">
                        {product.isPreorder
                          ? `Pre-order · ${categoryLabel(product.category)}`
                          : categoryLabel(product.category)}
                      </p>
                      <h5 className="text-zinc-900 text-sm font-medium leading-snug">
                        {product.name}
                      </h5>
                      <p className="text-zinc-500 text-sm mt-1">
                        {formatPrice(product.price)}
                      </p>
                      {product.isPreorder && (
                        <p className="text-zinc-400 text-[0.65rem] mt-1 tracking-wide">
                          {preorderShipsLabel(product.availableDate)}
                        </p>
                      )}
                    </div>
                    <div className="mt-auto">
                      <AddToCartButton
                        slug={product.slug}
                        label={product.isPreorder ? "Pre-order" : "Quick Add"}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : !loading ? (
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
          ) : null}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageInner />
    </Suspense>
  );
}
