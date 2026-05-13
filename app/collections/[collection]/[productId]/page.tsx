"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, Minus, Plus, Package, RotateCcw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAdminStore } from "@/lib/stores/admin-store";
import { useCartStore } from "@/lib/stores/cart-store";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const collection = params.collection as string;
  const productId = params.productId as string;

  const product = useAdminStore((s) => s.getProduct(productId));
  const addItem = useCartStore((s) => s.addItem);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product?.colors?.[0]?.name ?? null,
  );
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <main className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-zinc-400 eyebrow">Product not found</p>
          <Link
            href={`/collections/${collection}`}
            className={buttonVariants({ variant: "outline" })}
          >
            Back to Collection
          </Link>
        </div>
      </main>
    );
  }

  const displayImage = selectedImage ?? product.images[0];
  const collectionLabel =
    collection.charAt(0).toUpperCase() + collection.slice(1);

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product!.id,
        name: product!.name,
        price: product!.price,
        priceNum: product!.priceNum,
        img: product!.images[0],
        category: collectionLabel,
      });
    }
  }

  function handleBuyNow() {
    handleAddToCart();
    router.push("/checkout");
  }

  return (
    <main className="bg-white text-zinc-900 min-h-screen overflow-x-hidden">
      {/* ── BREADCRUMB ──────────────────────────────────────────────── */}
      <div className="max-w-360 mx-auto px-6 md:px-12 lg:px-16 pt-8 pb-4">
        <nav className="flex items-center gap-2 text-sm text-zinc-400">
          <Link
            href="/collections"
            className="hover:text-zinc-900 transition-colors"
          >
            Collections
          </Link>
          <span>/</span>
          <Link
            href={`/collections/${collection}`}
            className="hover:text-zinc-900 transition-colors capitalize"
          >
            {collectionLabel}
          </Link>
          <span>/</span>
          <span className="text-zinc-600 truncate">{product.name}</span>
        </nav>
      </div>

      {/* ── PRODUCT LAYOUT ──────────────────────────────────────────── */}
      <section className="max-w-360 mx-auto px-6 md:px-12 lg:px-16 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* LEFT — Gallery */}
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Main image */}
            <div className="relative aspect-square overflow-hidden bg-zinc-50">
              <Image
                src={displayImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`relative shrink-0 w-20 h-20 overflow-hidden border-2 transition-colors duration-200 ${
                      displayImage === img
                        ? "border-zinc-900"
                        : "border-transparent hover:border-zinc-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* RIGHT — Product Info */}
          <motion.div
            className="flex flex-col gap-8 lg:pt-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Tag + name + price */}
            <div className="space-y-3">
              <span className="eyebrow text-zinc-400">{product.tag}</span>
              <h2 className="text-zinc-900 leading-tight">{product.name}</h2>
              <p className="text-2xl font-light text-zinc-900">
                {product.price}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <p className="eyebrow text-zinc-500 mb-3">About</p>
              <p className="text-zinc-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Color swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <p className="eyebrow text-zinc-500">
                  Color:{" "}
                  <span className="text-zinc-900 normal-case font-normal">
                    {selectedColor}
                  </span>
                </p>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      title={color.name}
                      onClick={() => {
                        setSelectedColor(color.name);
                        if (color.image) setSelectedImage(color.image);
                      }}
                      className={`w-9 h-9 rounded-full border-2 transition-all duration-200 ${
                        selectedColor === color.name
                          ? "ring-2 ring-offset-2 ring-zinc-900 border-transparent"
                          : "border-zinc-200 hover:border-zinc-400"
                      }`}
                      style={{ background: color.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <p className="eyebrow text-zinc-500">Quantity</p>
              <div className="inline-flex items-center border border-zinc-200">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-3 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="px-6 py-3 text-zinc-900 font-medium min-w-[3rem] text-center border-x border-zinc-200">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 py-3 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAddToCart}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                Add to Cart
              </Button>
              <Button
                onClick={handleBuyNow}
                variant="default"
                size="lg"
                className="flex-1"
              >
                Buy Now
              </Button>
            </div>

            {/* Shipping info */}
            <div className="border-t border-zinc-100 pt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-zinc-500">
                <Package size={16} className="shrink-0" />
                <span>Free shipping on orders over US$200</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-500">
                <RotateCcw size={16} className="shrink-0" />
                <span>14-day returns on unworn items</span>
              </div>
            </div>

            {/* Back link */}
            <Link
              href={`/collections/${collection}`}
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-900 transition-colors mt-2"
            >
              <ChevronLeft size={14} />
              Back to {collectionLabel}
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
