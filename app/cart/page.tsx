"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/stores/cart-store";
import AddToCartButton from "@/components/ui/add-to-cart-button";

const featured = [
  {
    id: "headwear-1",
    name: "Bold Society Black",
    price: "US$65",
    priceNum: 65,
    img: "/collections/headwear/boldSocietyCapBlack.jpeg",
    category: "Head Wears",
    href: "/collections/headwear",
  },
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
    id: "boxers-1",
    name: "Classic White",
    price: "US$45",
    priceNum: 45,
    img: "/collections/boxers/boxersWhite.jpeg",
    category: "Boxers",
    href: "/collections/boxers",
  },
  {
    id: "tracks-1",
    name: "Sovereign Track",
    price: "US$120",
    priceNum: 120,
    img: "/collections/tracks/track.jpg",
    category: "Tracks",
    href: "/collections/tracks",
  },
];

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, totalItems, totalPrice } =
    useCartStore();

  const count = totalItems();
  const subtotal = totalPrice();

  return (
    <main className="min-h-screen bg-white text-zinc-900 pt-24 pb-32">
      <div className="max-w-360 mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-10">
          <p className="eyebrow text-zinc-500 mb-2">Your Selection</p>
          <h1 className="text-3xl font-light tracking-tight">
            Cart
            {count > 0 && (
              <span className="text-zinc-400 text-xl ml-3">({count})</span>
            )}
          </h1>
        </div>

        {count === 0 ? (
          /* ── Empty State + Featured ── */
          <>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center text-center gap-6 py-20"
            >
              <ShoppingBag
                size={40}
                strokeWidth={1}
                className="text-zinc-200"
              />
              <div>
                <p className="text-zinc-900 text-lg font-light mb-2">
                  Nothing here yet.
                </p>
                <p className="text-zinc-400 text-sm max-w-xs leading-relaxed">
                  You have not added anything to your cart. Go find something
                  that speaks to you.
                </p>
              </div>
              <Link
                href="/collections"
                className="border border-zinc-900 bg-transparent text-zinc-900 px-8 py-3 text-[0.65rem] tracking-widest uppercase hover:bg-zinc-900 hover:text-white transition-colors duration-300"
              >
                Shop Collections
              </Link>
            </motion.div>

            {/* ── You May Also Like ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-4 pb-8"
            >
                <div className="border-t border-zinc-100 pt-14">
                <p className="eyebrow text-zinc-400 mb-2">You May Also Like</p>
                <h3 className="text-zinc-900 text-xl font-light mb-10">
                  Start With These
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-100">
                  {featured.map((product) => (
                    <div key={product.id} className="bg-white group">
                      <Link href={product.href} className="block">
                        <div className="relative overflow-hidden aspect-3/4">
                          <Image
                            src={product.img}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          />
                        </div>
                        <div className="p-4 border-t border-zinc-100">
                          <p className="eyebrow text-zinc-400 mb-1 text-[0.55rem]">
                            {product.category}
                          </p>
                          <h5 className="text-zinc-900 text-sm">{product.name}</h5>
                          <p className="text-zinc-600 text-sm mt-1">
                            {product.price}
                          </p>
                        </div>
                      </Link>
                      <div className="px-4 pb-4">
                        <AddToCartButton
                          id={product.id}
                          name={product.name}
                          price={product.price}
                          priceNum={product.priceNum}
                          img={product.img}
                          category={product.category}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* ── Item List ── */}
              <div className="lg:col-span-2 flex flex-col gap-px bg-zinc-100">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      x: -20,
                      transition: { duration: 0.25 },
                    }}
                    transition={{ duration: 0.3 }}
                    className="bg-white flex gap-5 p-5"
                  >
                    {/* Thumbnail */}
                    <div className="relative shrink-0 w-20 h-24 md:w-24 md:h-28 overflow-hidden">
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <p className="eyebrow text-zinc-500 mb-1">
                          {item.category}
                        </p>
                        <h5 className="text-zinc-900 text-sm font-medium leading-snug">
                          {item.name}
                        </h5>
                        <p className="text-zinc-600 text-sm mt-1">
                          {item.price}
                        </p>
                      </div>

                      {/* Qty + Remove */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-zinc-200">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-colors duration-150"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-sm text-zinc-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-colors duration-150"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <div className="flex items-center gap-4">
                          <p className="text-zinc-900 text-sm font-medium">
                            US${(item.priceNum * item.quantity).toFixed(0)}
                          </p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-zinc-300 hover:text-zinc-900 transition-colors duration-150"
                            aria-label="Remove item"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ── Order Summary ── */}
            <div className="lg:col-span-1">
              <div className="border border-zinc-100 p-6 flex flex-col gap-5 sticky top-24">
                <p className="eyebrow text-zinc-500">Order Summary</p>

                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">
                      Subtotal ({count} item{count !== 1 ? "s" : ""})
                    </span>
                    <span className="text-zinc-900">US${subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Shipping</span>
                    <span className="text-zinc-400">
                      Calculated at checkout
                    </span>
                  </div>
                </div>

                <div className="border-t border-zinc-100 pt-4 flex justify-between">
                  <span className="text-zinc-900 font-medium">Total</span>
                  <span className="text-zinc-900 font-medium">
                    US${subtotal.toFixed(0)}
                  </span>
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full border border-zinc-900 bg-transparent text-zinc-900 py-3.5 text-[0.65rem] tracking-widest uppercase hover:bg-zinc-900 hover:text-white transition-colors duration-300"
                >
                  Proceed to Checkout
                </button>

                <Link
                  href="/collections"
                  className="text-center text-[0.6rem] tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors duration-200"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
