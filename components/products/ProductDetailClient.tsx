"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  Check,
  ArrowLeft,
  Heart,
  Star,
} from "lucide-react";
import { formatPrice } from "@/lib/currency";
import type { Product, ColorVariant, Review } from "@/lib/products";
import ProductGallery from "./ProductGallery";
import ProductCard from "./ProductCard";
import BoxerSizeGuide from "./BoxerSizeGuide";
import FindMySizeQuiz from "./FindMySizeQuiz";
import { useCartStore } from "@/lib/stores/cart-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { useRecentlyViewedStore } from "@/lib/stores/recently-viewed-store";
import { useIsLoggedIn } from "@/lib/use-is-logged-in";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = {
  product: Product;
  relatedProducts: Product[];
};

const LIGHT_HEXES = new Set(["#f0f0f0", "#f0e6ce", "#e8dcc8", "#f5f5f5"]);

export default function ProductDetailClient({
  product,
  relatedProducts,
}: Props) {
  const [selectedVariant, setSelectedVariant] = useState<ColorVariant>(
    product.variants[0],
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(() => {
    const sizes = product.variants[0].sizes;
    return sizes.length === 1 ? sizes[0].size : null;
  });
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("description");

  // ── Reviews ──────────────────────────────────────────────────────────
  const [reviews, setReviews] = useState<Review[]>(product.reviews ?? []);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    author: "",
    rating: 5,
    body: "",
  });
  const avgRating = reviews.length
    ? Math.round(
        (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10,
      ) / 10
    : 0;

  // ── Back-in-stock notify ─────────────────────────────────────────────
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifiedKeys, setNotifiedKeys] = useState<Set<string>>(new Set());

  // ── Find My Size quiz ────────────────────────────────────────────────
  const [showSizeQuiz, setShowSizeQuiz] = useState(false);

  // ── Recently viewed ──────────────────────────────────────────────────
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addItem);
  const recentlyViewed = useRecentlyViewedStore((s) => s.items);
  useEffect(() => {
    addRecentlyViewed({
      id: product.id,
      slug: product.slug,
      name: product.name,
      img: product.variants[0]?.images[0] ?? "",
      price: product.price,
      category: product.category,
    });
  }, [
    product.id,
    product.slug,
    product.name,
    product.price,
    product.category,
    product.variants,
    addRecentlyViewed,
  ]);
  const otherRecentlyViewed = recentlyViewed.filter((r) => r.id !== product.id);

  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) =>
    s.items.some((i) => i.id === product.id),
  );
  const wishlistItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    img: product.variants[0].images[0],
    category: product.category,
    slug: product.slug,
  };

  const selectedSizeData = selectedVariant.sizes.find(
    (s) => s.size === selectedSize,
  );
  const currentStock = selectedSizeData?.stock ?? 0;
  const isLowStock = !!selectedSize && currentStock > 0 && currentStock <= 4;
  const isOutOfStock = !!selectedSize && currentStock === 0;
  const canAdd = !!selectedSize && !isOutOfStock;

  const handleColorChange = (variant: ColorVariant) => {
    setSelectedVariant(variant);
    const sizes = variant.sizes;
    if (sizes.length === 1) {
      setSelectedSize(sizes[0].size);
      setQuantity((q) => Math.min(q, sizes[0].stock));
    } else if (selectedSize) {
      const newSizeData = sizes.find((s) => s.size === selectedSize);
      if (!newSizeData) {
        setSelectedSize(null);
      } else {
        setQuantity((q) => Math.min(q, newSizeData.stock));
      }
    }
  };

  const handleAddToCart = () => {
    if (!canAdd) return;
    addItem({
      id: `${product.id}__${selectedVariant.id}__${selectedSize}`,
      name: `${product.name} — ${selectedVariant.colorName} / ${selectedSize}`,
      price: product.price,
      img: selectedVariant.images[0],
      category: product.category,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const accordionSections = [
    {
      id: "description",
      label: "Description",
      content: (
        <p className="text-zinc-600 text-sm leading-relaxed">
          {product.description}
        </p>
      ),
    },
    {
      id: "details",
      label: "Product Details",
      content: (
        <ul className="space-y-2">
          {product.details.map((d, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-sm text-zinc-600"
            >
              <span className="w-1 h-1 rounded-full bg-zinc-300 mt-2 shrink-0" />
              {d}
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: "care",
      label: "Care Instructions",
      content: (
        <ul className="space-y-2">
          {product.careInstructions.map((c, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-sm text-zinc-600"
            >
              <span className="w-1 h-1 rounded-full bg-zinc-300 mt-2 shrink-0" />
              {c}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <main className="bg-white text-zinc-900 min-h-screen pb-24 lg:pb-0">
      <div className="max-w-360 mx-auto px-6 md:px-12 lg:px-16">
        {/* ── BREADCRUMB ──────────────────────────────────────────────── */}
        <nav className="flex items-center gap-2 py-7 text-[0.65rem] text-zinc-400 tracking-wide">
          <Link
            href="/collections"
            className="inline-flex items-center gap-1.5 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft size={12} />
            Collections
          </Link>
          <span className="text-zinc-200">/</span>
          <Link
            href={`/collections/${product.category}`}
            className="capitalize hover:text-zinc-900 transition-colors"
          >
            {product.category}
          </Link>
          <span className="text-zinc-200">/</span>
          <span className="text-zinc-600 truncate max-w-48">
            {product.name}
          </span>
        </nav>

        {/* ── PRODUCT LAYOUT ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 pb-20">
          {/* LEFT — Gallery */}
          <ProductGallery
            images={selectedVariant.images}
            productName={product.name}
          />

          {/* RIGHT — Info (sticky on desktop) */}
          <div className="lg:sticky lg:top-28 lg:self-start space-y-7">
            {/* Tag + Name + Price ─────────────────────────────────── */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-medium tracking-tight leading-tight mt-1 mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-2xl font-semibold">
                  {formatPrice(product.price)}
                </span>
                {selectedSize && !isOutOfStock && !isLowStock && (
                  <span className="inline-flex items-center gap-1.5 text-[0.65rem] tracking-widest uppercase text-emerald-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    In Stock
                  </span>
                )}
                {isLowStock && (
                  <span className="inline-flex items-center gap-1.5 text-[0.65rem] tracking-widest uppercase text-amber-500 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Only {currentStock} left
                  </span>
                )}
                {isOutOfStock && (
                  <span className="inline-flex items-center gap-1.5 text-[0.65rem] tracking-widest uppercase text-red-500 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            <div className="h-px bg-zinc-100" />

            {/* Color Selection ────────────────────────────────────── */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[0.62rem] font-medium tracking-widest uppercase text-zinc-500">
                  Color
                </p>
                <p className="text-sm text-zinc-900 font-medium">
                  {selectedVariant.colorName}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {product.variants.map((variant) => {
                  const isSelected = variant.id === selectedVariant.id;
                  const isLight = LIGHT_HEXES.has(variant.colorHex);
                  return (
                    <button
                      key={variant.id}
                      onClick={() => handleColorChange(variant)}
                      title={variant.colorName}
                      aria-label={`Select color: ${variant.colorName}`}
                      className={cn(
                        "w-8 h-8 transition-all duration-300 ease-out",
                        isSelected
                          ? "ring-2 ring-offset-2 ring-zinc-900 scale-110"
                          : "hover:scale-110",
                        isLight
                          ? "border-2 border-zinc-300"
                          : "border-2 border-transparent",
                      )}
                      style={{ backgroundColor: variant.colorHex }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Size Selection ─────────────────────────────────────── */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[0.62rem] font-medium tracking-widest uppercase text-zinc-500">
                  Size
                </p>
                <div className="flex items-center gap-3">
                  {!selectedSize && (
                    <p className="text-[0.62rem] text-zinc-400 tracking-wide">
                      Select a size
                    </p>
                  )}
                  {product.category === "boxers" && (
                    <BoxerSizeGuide variant="link" />
                  )}
                  {!["sunglasses", "headwear"].includes(product.category) && (
                    <button
                      type="button"
                      onClick={() => setShowSizeQuiz(true)}
                      className="text-[0.62rem] tracking-widest uppercase text-zinc-600 hover:text-zinc-900 underline underline-offset-4 transition-colors"
                    >
                      Find My Size
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedVariant.sizes.map((s) => {
                  const isSelected = s.size === selectedSize;
                  const unavailable = s.stock === 0;
                  return (
                    <button
                      key={s.size}
                      disabled={unavailable}
                      onClick={() => {
                        setSelectedSize(s.size);
                        setQuantity((q) => Math.min(q, s.stock));
                      }}
                      className={cn(
                        "h-11 px-4 min-w-13 border text-sm font-medium transition-all duration-200",
                        isSelected
                          ? "bg-zinc-900 text-white border-zinc-900"
                          : unavailable
                            ? "bg-zinc-50 text-zinc-300 border-zinc-200 cursor-not-allowed line-through"
                            : "bg-white text-zinc-900 border-zinc-300 hover:border-zinc-900 hover:bg-zinc-50",
                      )}
                    >
                      {s.size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity ───────────────────────────────────────────── */}
            <div className="flex items-center gap-5">
              <p className="text-[0.62rem] font-medium tracking-widest uppercase text-zinc-500">
                Qty
              </p>
              <div className="flex items-center border border-zinc-200">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-medium tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(currentStock, q + 1))
                  }
                  disabled={!selectedSize || quantity >= currentStock}
                  className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Add to Cart + Wishlist ──────────────────────────────── */}
            <div className="flex items-stretch gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!canAdd}
                className={cn(
                  "flex-1 py-4 text-[0.68rem] tracking-widest uppercase transition-all duration-300 border font-medium",
                  added
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : !canAdd
                      ? "bg-zinc-50 text-zinc-400 border-zinc-200 cursor-not-allowed"
                      : "bg-black text-white border-black hover:bg-white hover:text-black",
                )}
              >
                {added ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Check size={15} /> Added to Cart
                  </span>
                ) : !selectedSize ? (
                  "Select a Size to Continue"
                ) : isOutOfStock ? (
                  "Out of Stock"
                ) : (
                  "Add to Cart"
                )}
              </button>

              {/* Wishlist toggle */}
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    router.push(
                      "/auth/login?next=" +
                        encodeURIComponent(window.location.pathname),
                    );
                    return;
                  }
                  toggleWishlist(wishlistItem);
                }}
                aria-label={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
                className={cn(
                  "w-14 border flex items-center justify-center transition-all duration-200 shrink-0",
                  isWishlisted
                    ? "bg-zinc-900 border-zinc-900 text-white"
                    : "border-zinc-300 text-zinc-400 hover:border-zinc-900 hover:text-zinc-900",
                )}
              >
                <Heart
                  size={18}
                  strokeWidth={1.8}
                  className={isWishlisted ? "fill-current" : ""}
                />
              </button>
            </div>

            {/* Back-in-Stock Notify ─────────────────────────────────── */}
            {isOutOfStock &&
              selectedSize &&
              (() => {
                const key = `${selectedVariant.id}-${selectedSize}`;
                const isNotified = notifiedKeys.has(key);
                return (
                  <div className="border border-zinc-200 bg-zinc-50 p-4">
                    {isNotified ? (
                      <div className="flex items-center gap-2 text-sm text-emerald-700">
                        <Check size={16} />
                        <span>
                          We will email you when size {selectedSize} is back in
                          stock.
                        </span>
                      </div>
                    ) : (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!notifyEmail.trim()) return;
                          setNotifiedKeys((prev) => new Set(prev).add(key));
                          setNotifyEmail("");
                        }}
                      >
                        <p className="text-[10px] tracking-[0.25em] uppercase text-zinc-600 mb-2">
                          Get Notified When Back
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="email"
                            required
                            autoComplete="email"
                            value={notifyEmail}
                            onChange={(e) => setNotifyEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="flex-1 bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 px-4 py-2.5 text-sm outline-none"
                          />
                          <button
                            type="submit"
                            className="text-[10px] tracking-[0.25em] uppercase bg-zinc-900 text-white px-5 py-2.5 hover:bg-zinc-700 transition-colors"
                          >
                            Notify Me
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                );
              })()}

            {/* Accordion ──────────────────────────────────────────── */}
            <div className="border-t border-zinc-100">
              {accordionSections.map((section) => (
                <div key={section.id} className="border-b border-zinc-100">
                  <button
                    onClick={() =>
                      setOpenSection((prev) =>
                        prev === section.id ? null : section.id,
                      )
                    }
                    className="w-full flex items-center justify-between py-4 text-sm font-medium text-zinc-900 hover:text-zinc-500 transition-colors"
                  >
                    {section.label}
                    {openSection === section.id ? (
                      <ChevronUp size={16} className="text-zinc-400 shrink-0" />
                    ) : (
                      <ChevronDown
                        size={16}
                        className="text-zinc-400 shrink-0"
                      />
                    )}
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      openSection === section.id ? "max-h-96 pb-5" : "max-h-0",
                    )}
                  >
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── REVIEWS ────────────────────────────────────────────────────── */}
      <section className="border-t border-zinc-100 py-16 lg:py-24 bg-white">
        <div className="max-w-360 mx-auto px-6 md:px-12 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl tracking-[0.2em] text-zinc-900 uppercase font-light">
                Customer Reviews
              </h2>
              {reviews.length > 0 ? (
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={cn(
                          "h-4 w-4",
                          n <= Math.round(avgRating)
                            ? "fill-zinc-900 text-zinc-900"
                            : "text-zinc-300",
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-zinc-700">
                    {avgRating.toFixed(1)} out of 5
                  </span>
                  <span className="text-sm text-zinc-500">
                    ({reviews.length}{" "}
                    {reviews.length === 1 ? "review" : "reviews"})
                  </span>
                </div>
              ) : (
                <p className="mt-3 text-sm text-zinc-500">
                  No reviews yet. Be the first to share your experience.
                </p>
              )}
            </div>
            <button
              onClick={() => setShowReviewForm((s) => !s)}
              className="self-start md:self-auto text-xs tracking-[0.25em] uppercase border border-zinc-900 text-zinc-900 px-6 py-3 hover:bg-zinc-900 hover:text-white transition-colors"
            >
              {showReviewForm ? "Cancel" : "Write a Review"}
            </button>
          </div>

          {/* Review form */}
          {showReviewForm && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!reviewForm.author.trim() || !reviewForm.body.trim())
                  return;
                const newReview: Review = {
                  id: `local-${Date.now()}`,
                  author: reviewForm.author.trim(),
                  rating: reviewForm.rating,
                  date: new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }),
                  body: reviewForm.body.trim(),
                  verified: false,
                };
                setReviews((prev) => [newReview, ...prev]);
                setReviewForm({ author: "", rating: 5, body: "" });
                setShowReviewForm(false);
              }}
              className="mb-10 border border-zinc-200 bg-zinc-50 p-6 md:p-8 space-y-5"
            >
              <div>
                <label className="block text-[10px] tracking-[0.25em] uppercase text-zinc-600 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  value={reviewForm.author}
                  onChange={(e) =>
                    setReviewForm((f) => ({ ...f, author: e.target.value }))
                  }
                  className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 px-4 py-3 text-sm outline-none"
                  placeholder="e.g. Kwame A."
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.25em] uppercase text-zinc-600 mb-2">
                  Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() =>
                        setReviewForm((f) => ({ ...f, rating: n }))
                      }
                      className="p-1"
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    >
                      <Star
                        className={cn(
                          "h-6 w-6 transition-colors",
                          n <= reviewForm.rating
                            ? "fill-zinc-900 text-zinc-900"
                            : "text-zinc-300 hover:text-zinc-500",
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.25em] uppercase text-zinc-600 mb-2">
                  Your Review
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewForm.body}
                  onChange={(e) =>
                    setReviewForm((f) => ({ ...f, body: e.target.value }))
                  }
                  className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 px-4 py-3 text-sm outline-none resize-none"
                  placeholder="Tell others what you think..."
                />
              </div>
              <button
                type="submit"
                className="text-xs tracking-[0.25em] uppercase bg-zinc-900 text-white px-8 py-3 hover:bg-zinc-700 transition-colors"
              >
                Submit Review
              </button>
            </form>
          )}

          {/* Review list */}
          {reviews.length > 0 && (
            <div className="divide-y divide-zinc-100 border-t border-b border-zinc-100">
              {reviews.map((r) => (
                <article key={r.id} className="py-6 md:py-8">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={cn(
                            "h-3.5 w-3.5",
                            n <= r.rating
                              ? "fill-zinc-900 text-zinc-900"
                              : "text-zinc-300",
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-zinc-900 font-medium">
                      {r.author}
                    </span>
                    {r.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] tracking-[0.15em] uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5">
                        <Check className="h-3 w-3" /> Verified
                      </span>
                    )}
                    <span className="text-xs text-zinc-500 ml-auto">
                      {r.date}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-700">
                    {r.body}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── RECENTLY VIEWED ────────────────────────────────────────────── */}
      {otherRecentlyViewed.length > 0 && (
        <section className="border-t border-zinc-100 py-12 lg:py-16 bg-white">
          <div className="max-w-360 mx-auto px-6 md:px-12 lg:px-16">
            <h2 className="text-xs tracking-[0.25em] uppercase text-zinc-500 mb-6">
              Recently Viewed
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {otherRecentlyViewed.map((item) => (
                <Link
                  key={item.id}
                  href={`/collections/${item.category}/${item.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-4/5 overflow-hidden bg-zinc-100 rounded-xl">
                    {item.img && (
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <p className="mt-3 text-xs text-zinc-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {formatPrice(item.price)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── RELATED PRODUCTS ──────────────────────────────────────────── */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-zinc-100 py-16 lg:py-24 bg-zinc-50">
          <div className="max-w-360 mx-auto px-6 md:px-12 lg:px-16">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[0.62rem] tracking-widest uppercase text-zinc-400 mb-1">
                  You Might Also Like
                </p>
                <h2 className="text-2xl font-medium tracking-tight">
                  More from{" "}
                  {product.category.charAt(0).toUpperCase() +
                    product.category.slice(1)}
                </h2>
              </div>
              <Link
                href={`/collections/${product.category}`}
                className="text-[0.62rem] tracking-widest uppercase text-zinc-500 hover:text-zinc-900 transition-colors border-b border-zinc-200 pb-0.5 hidden sm:block"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── STICKY MOBILE CTA ─────────────────────────────────────────── */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-zinc-200 p-4 z-50 transition-transform duration-300",
          canAdd ? "translate-y-0" : "translate-y-full",
        )}
      >
        <button
          onClick={handleAddToCart}
          className={cn(
            "w-full py-4 text-[0.68rem] tracking-widest uppercase transition-all duration-300 border font-medium",
            added
              ? "bg-zinc-900 text-white border-zinc-900"
              : "bg-black text-white border-black hover:bg-zinc-800",
          )}
        >
          {added ? (
            <span className="inline-flex items-center justify-center gap-2">
              <Check size={15} /> Added
            </span>
          ) : (
            `Add to Cart — ${formatPrice(product.price)}`
          )}
        </button>
      </div>

      {/* ── Find My Size Quiz Modal ───────────────────────────────────── */}
      <FindMySizeQuiz
        open={showSizeQuiz}
        onClose={() => setShowSizeQuiz(false)}
        category={product.category}
      />
    </main>
  );
}
