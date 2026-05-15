"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Heart } from "lucide-react";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { formatPrice } from "@/lib/currency";
import { buttonVariants } from "@/components/ui/button";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);

  return (
    <main className="bg-white text-zinc-900 min-h-screen pb-24">
      <div className="max-w-360 mx-auto px-6 md:px-12 lg:px-16 pt-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-10 pb-6 border-b border-zinc-100">
          <div>
            <p className="eyebrow text-zinc-400 mb-1">Your Collection</p>
            <h1 className="text-2xl font-medium tracking-tight">Wishlist</h1>
          </div>
          <p className="eyebrow text-zinc-400">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-32 text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center">
              <Heart size={24} className="text-zinc-300" />
            </div>
            <div>
              <p className="text-zinc-900 font-medium mb-1">
                Your wishlist is empty
              </p>
              <p className="text-zinc-400 text-sm">
                Save items you love and come back to them later.
              </p>
            </div>
            <Link
              href="/collections"
              className={buttonVariants({ variant: "default" })}
            >
              Shop Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-zinc-100">
            {items.map((item) => (
              <div key={item.id} className="group bg-white relative">
                <Link href={`/collections/${item.category}/${item.slug}`}>
                  <div className="relative aspect-3/4 overflow-hidden">
                    <Image
                      src={item.img}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4 border-t border-zinc-100">
                    <p className="eyebrow text-zinc-400 mb-1 capitalize">
                      {item.category}
                    </p>
                    <p className="text-sm font-medium text-zinc-900 mb-1">
                      {item.name}
                    </p>
                    <p className="text-sm text-zinc-600">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={() => remove(item.id)}
                  aria-label="Remove from wishlist"
                  className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center bg-white/80 backdrop-blur-sm text-zinc-500 hover:text-zinc-900 hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
