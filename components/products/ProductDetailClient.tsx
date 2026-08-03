"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import FadeImage from "@/components/ui/fade-image";
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
import {
  getDefaultSelectedSize,
  toReview,
  type Product,
  type ProductSummary,
  type ColorVariant,
  type Review,
} from "@/lib/products";
import { submitReview, type ApiReview } from "@/lib/api/catalog";
import { createStockAlert } from "@/lib/api/forms";
import ProductGallery from "./ProductGallery";
import CollectionCard from "./CollectionCard";
import BoxerSizeGuide, {
  isBoxerCollection,
} from "./BoxerSizeGuide";
import FindMySizeQuiz from "./FindMySizeQuiz";
import { useCartStore } from "@/lib/stores/cart-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { useRecentlyViewedStore } from "@/lib/stores/recently-viewed-store";
import { useIsLoggedIn } from "@/lib/use-is-logged-in";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/stores/toast-store";
import { Button } from "@/components/ui/button";
import { cn, isLightHex } from "@/lib/utils";
import { COLLECTIONS_CONTAINER } from "@/lib/layout/collections";

type Props = {
  product: Product;
  relatedProducts: ProductSummary[];
  initialReviews: ApiReview[];
};

export default function ProductDetailClient({
  product,
  relatedProducts,
  initialReviews,
}: Props) {
  const [selectedVariant, setSelectedVariant] = useState<ColorVariant>(
    product.variants[0],
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(() =>
    getDefaultSelectedSize(product.variants[0].sizes),
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("description");

  // ── Reviews ──────────────────────────────────────────────────────────
  const [reviews, setReviews] = useState<Review[]>(
    initialReviews.map(toReview),
  );
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, body: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const avgRating =
    product.reviewSummary.count > 0
      ? Math.round(product.reviewSummary.average * 10) / 10
      : reviews.length
        ? Math.round(
            (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) *
              10,
          ) / 10
        : 0;
  const reviewCount = product.reviewSummary.count || reviews.length;

  // ── Back-in-stock notify ─────────────────────────────────────────────
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifiedKeys, setNotifiedKeys] = useState<Set<string>>(new Set());
  const [submittingNotify, setSubmittingNotify] = useState(false);

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
  const getLineQuantity = useCartStore((s) => s.getLineQuantity);
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) =>
    s.has(product.id, product.slug),
  );
  const wishlistItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    img: product.variants[0].images[0],
    category: product.category,
    slug: product.slug,
  };

  // Flat gallery of every variant image so shoppers can browse the full set.
  const galleryImages = product.variants.flatMap((variant) =>
    variant.images.map((src) => ({ src, variantId: variant.id })),
  );

  const selectedSizeData = selectedVariant.sizes.find(
    (s) => s.size === selectedSize,
  );
  const currentStock = selectedSizeData?.stock ?? 0;
  const lineId =
    selectedSize != null
      ? `${product.id}__${selectedVariant.id}__${selectedSize}`
      : null;
  const inCartQty = lineId ? getLineQuantity(lineId) : 0;
  const roomLeft = Math.max(0, currentStock - inCartQty);
  const isLowStock = !!selectedSize && currentStock > 0 && currentStock <= 4;
  const isOutOfStock = !!selectedSize && currentStock === 0;
  const canAdd = !!selectedSize && !isOutOfStock && roomLeft > 0;

  // Keep the qty picker within what can still be added for this size.
  if (selectedSize && quantity > roomLeft && roomLeft > 0) {
    setQuantity(roomLeft);
  } else if (selectedSize && roomLeft === 0 && quantity !== 1) {
    setQuantity(1);
  }

  const handleColorChange = (variant: ColorVariant) => {
    setSelectedVariant(variant);
    const autoSize = getDefaultSelectedSize(variant.sizes);
    if (autoSize) {
      const sizeData = variant.sizes[0];
      setSelectedSize(autoSize);
      setQuantity((q) => Math.min(q, sizeData.stock));
    } else if (selectedSize) {
      const newSizeData = variant.sizes.find((s) => s.size === selectedSize);
      if (!newSizeData) {
        setSelectedSize(null);
      } else {
        setQuantity((q) => Math.min(q, newSizeData.stock));
      }
    }
  };

  const handleAddToCart = () => {
    if (!canAdd || !selectedSize) return;
    const result = addItem(
      {
        id: `${product.id}__${selectedVariant.id}__${selectedSize}`,
        name: `${product.name} (${selectedVariant.colorName} / ${selectedSize})`,
        price: product.price,
        img: selectedVariant.images[0],
        category: product.category,
        stock: currentStock,
        slug: product.slug,
      },
      quantity,
    );
    if (result.added <= 0) {
      toast.error(
        "Not enough stock",
        `Only ${currentStock} available. You already have ${result.quantityInCart} in your cart.`,
      );
      return;
    }
    if (result.added < quantity) {
      toast.info(
        "Quantity adjusted",
        `Only ${result.added} added. ${currentStock} in stock.`,
      );
    }
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
      <div className={COLLECTIONS_CONTAINER}>
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
          {/* LEFT — Gallery (all variant images) */}
          <ProductGallery
            images={galleryImages}
            productName={product.name}
            selectedVariantId={selectedVariant.id}
            onVariantSelect={(variantId) => {
              const variant = product.variants.find((v) => v.id === variantId);
              if (variant) handleColorChange(variant);
            }}
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
                  const isLight = isLightHex(variant.colorHex);
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
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center justify-between gap-3 sm:justify-start">
                  <p className="text-[0.62rem] font-medium tracking-widest uppercase text-zinc-500">
                    Size
                  </p>
                  {!selectedSize && (
                    <p className="text-[0.62rem] tracking-wide text-zinc-400 sm:hidden">
                      Select a size
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  {!selectedSize && (
                    <p className="hidden text-[0.62rem] tracking-wide text-zinc-400 sm:block">
                      Select a size
                    </p>
                  )}
                  {isBoxerCollection(product.category) && (
                    <BoxerSizeGuide variant="link" />
                  )}
                  {!["sunglasses", "accessories"].includes(product.category) && (
                    <button
                      type="button"
                      onClick={() => setShowSizeQuiz(true)}
                      className="text-[0.62rem] tracking-widest uppercase text-zinc-600 underline underline-offset-4 transition-colors hover:text-zinc-900"
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
                      type="button"
                      onClick={() => {
                        setSelectedSize(s.size);
                        setQuantity((q) =>
                          unavailable ? 1 : Math.min(q, s.stock),
                        );
                      }}
                      aria-label={
                        unavailable
                          ? `${s.size}, out of stock. Select to get notified`
                          : s.size
                      }
                      className={cn(
                        "h-11 min-w-13 border px-4 text-sm font-medium transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-[0.97]",
                        isSelected
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : unavailable
                            ? "border-zinc-200 bg-zinc-50 text-zinc-400 line-through hover:border-zinc-400"
                            : "border-zinc-300 bg-white text-zinc-900 hover:border-zinc-900 hover:bg-zinc-50",
                      )}
                    >
                      {s.size}
                    </button>
                  );
                })}
              </div>
              {selectedVariant.sizes.some((s) => s.stock === 0) &&
                !isOutOfStock && (
                  <p className="mt-3 text-xs text-zinc-500">
                    Struck-through sizes are out of stock. Select one to sign up
                    for a restock alert.
                  </p>
                )}
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
                    setQuantity((q) => Math.min(roomLeft, q + 1))
                  }
                  disabled={!selectedSize || quantity >= roomLeft}
                  className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Add to Cart + Wishlist ──────────────────────────────── */}
            <div className="flex items-stretch gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={!canAdd}
                className={cn(
                  "flex-1 py-4 text-[0.68rem] font-medium",
                  added
                    ? "border-zinc-900 bg-zinc-900 text-white hover:border-zinc-900 hover:bg-zinc-900 hover:text-white"
                    : !canAdd
                      ? "cursor-not-allowed border-zinc-200 bg-zinc-50 text-zinc-400 hover:border-zinc-200 hover:bg-zinc-50 hover:text-zinc-400"
                      : undefined,
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
                ) : roomLeft <= 0 ? (
                  "Max in Cart"
                ) : (
                  "Add to Cart"
                )}
              </Button>

              {/* Wishlist toggle */}
              <button
                type="button"
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
                  "flex w-14 shrink-0 items-center justify-center border transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-[0.97]",
                  isWishlisted
                    ? "border-zinc-900 bg-zinc-900 text-white"
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
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const email = notifyEmail.trim();
                          if (!email || submittingNotify) return;
                          setSubmittingNotify(true);
                          try {
                            await createStockAlert({
                              email,
                              productId: product.slug,
                              variantId: selectedVariant.id,
                              size: selectedSize,
                            });
                            setNotifiedKeys((prev) => new Set(prev).add(key));
                            setNotifyEmail("");
                            toast.success(
                              "You are on the list",
                              `We will email you when ${selectedSize} is back.`,
                            );
                          } catch (err) {
                            toast.error(
                              "Could not save alert",
                              err instanceof Error
                                ? err.message
                                : "Please try again.",
                            );
                          } finally {
                            setSubmittingNotify(false);
                          }
                        }}
                      >
                        <p className="text-[10px] tracking-[0.25em] uppercase text-zinc-600 mb-1">
                          Get Notified When Back
                        </p>
                        <p className="text-sm text-zinc-600 mb-3">
                          Size {selectedSize} is out of stock. Leave your email
                          and we will let you know when it returns.
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
                            disabled={submittingNotify}
                            className="text-[10px] tracking-[0.25em] uppercase bg-zinc-900 text-white px-5 py-2.5 hover:bg-zinc-700 transition-colors disabled:opacity-50"
                          >
                            {submittingNotify ? "Saving..." : "Notify Me"}
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
        <div className={COLLECTIONS_CONTAINER}>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl tracking-[0.2em] text-zinc-900 uppercase font-light">
                Customer Reviews
              </h2>
              {reviewCount > 0 ? (
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
                    ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                  </span>
                </div>
              ) : (
                <p className="mt-3 text-sm text-zinc-500">
                  No reviews yet. Be the first to share your experience.
                </p>
              )}
            </div>
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  router.push(
                    "/auth/login?next=" +
                      encodeURIComponent(window.location.pathname),
                  );
                  return;
                }
                setShowReviewForm((open) => !open);
              }}
              className="self-start md:self-auto text-xs tracking-[0.25em] uppercase border border-zinc-900 text-zinc-900 px-6 py-3 hover:bg-zinc-900 hover:text-white transition-colors"
            >
              {showReviewForm ? "Cancel" : "Write a Review"}
            </button>
          </div>

          {/* Review form */}
          {showReviewForm && isLoggedIn && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!isLoggedIn || submittingReview) return;
                if (!reviewForm.body.trim()) return;
                setSubmittingReview(true);
                try {
                  const created = await submitReview(product.slug, {
                    rating: reviewForm.rating,
                    body: reviewForm.body.trim(),
                  });
                  setReviews((prev) => [toReview(created), ...prev]);
                  setReviewForm({ rating: 5, body: "" });
                  setShowReviewForm(false);
                } catch (err) {
                  toast.error(
                    "Could not submit review",
                    err instanceof Error ? err.message : "Please try again.",
                  );
                } finally {
                  setSubmittingReview(false);
                }
              }}
              className="mb-10 border border-zinc-200 bg-zinc-50 p-6 md:p-8 space-y-5"
            >
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
                disabled={submittingReview}
                className="text-xs tracking-[0.25em] uppercase bg-zinc-900 text-white px-8 py-3 hover:bg-zinc-700 transition-colors disabled:opacity-50"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
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
          <div className={COLLECTIONS_CONTAINER}>
            <h2 className="text-xs tracking-[0.25em] uppercase text-zinc-500 mb-6">
              Recently Viewed
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px bg-zinc-100">
              {otherRecentlyViewed.map((item) => (
                <Link
                  key={item.id}
                  href={`/collections/${item.category}/${item.slug}`}
                  className="group block bg-white"
                >
                  <div className="relative aspect-3/4 overflow-hidden bg-zinc-100">
                    {item.img && (
                      <FadeImage
                        src={item.img}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    )}
                  </div>
                  <div className="p-4 border-t border-zinc-100">
                    <p className="eyebrow text-zinc-500 mb-1 capitalize">
                      {item.category}
                    </p>
                    <p className="text-sm font-medium text-zinc-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-sm text-zinc-600 mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── RELATED PRODUCTS ──────────────────────────────────────────── */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-zinc-100 py-16 lg:py-24 bg-zinc-50">
          <div className={COLLECTIONS_CONTAINER}>
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-zinc-100">
              {relatedProducts.map((p) => (
                <CollectionCard
                  key={p.slug}
                  product={p}
                  categoryLabel={
                    p.category.charAt(0).toUpperCase() + p.category.slice(1)
                  }
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── STICKY MOBILE CTA ─────────────────────────────────────────── */}
      <div
        className={cn(
          "fixed right-0 bottom-0 left-0 z-50 border-t border-zinc-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-transform duration-300 ease-out lg:hidden",
          canAdd ? "translate-y-0" : "translate-y-full",
        )}
      >
        <Button
          onClick={handleAddToCart}
          className={cn(
            "w-full py-4 text-[0.68rem] font-medium",
            added &&
              "border-zinc-900 bg-zinc-900 text-white hover:border-zinc-900 hover:bg-zinc-900 hover:text-white",
          )}
        >
          {added ? (
            <span className="inline-flex items-center justify-center gap-2">
              <Check size={15} /> Added
            </span>
          ) : (
            `Add to Cart · ${formatPrice(product.price)}`
          )}
        </Button>
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
