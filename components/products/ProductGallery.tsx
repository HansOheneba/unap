"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  productName: string;
};

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevImages, setPrevImages] = useState(images);

  // Reset to first image when images array changes (color swap)
  if (images !== prevImages) {
    setPrevImages(images);
    setActiveIndex(0);
  }

  const handleSelect = (index: number) => {
    if (index === activeIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(index);
      setIsTransitioning(false);
    }, 150);
  };

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      {/* ── MAIN IMAGE ──────────────────────────────────────────────── */}
      <div className="relative aspect-square lg:aspect-5/6 overflow-hidden bg-zinc-100">
        <Image
          src={images[activeIndex]}
          alt={`${productName} — view ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={cn(
            "object-cover transition-opacity duration-300",
            isTransitioning ? "opacity-0" : "opacity-100",
          )}
        />
      </div>

      {/* ── THUMBNAIL STRIP ─────────────────────────────────────────── */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={cn(
                "relative shrink-0 w-20 h-20 overflow-hidden border-2 transition-all duration-300",
                i === activeIndex
                  ? "border-zinc-900 scale-[0.97]"
                  : "border-transparent hover:border-zinc-300 hover:scale-[0.97]",
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover octject-top"
              />
              {/* Active overlay */}
              {i === activeIndex && (
                <div className="absolute inset-0 bg-black/8" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
