"use client";

import { useEffect, useState } from "react";
import FadeImage from "@/components/ui/fade-image";
import { cn } from "@/lib/utils";

export type GalleryImage = {
  src: string;
  variantId: string;
};

type ProductGalleryProps = {
  images: GalleryImage[];
  productName: string;
  selectedVariantId: string;
  onVariantSelect?: (variantId: string) => void;
};

const ZOOM_SCALE = 2.25;

export default function ProductGallery({
  images,
  productName,
  selectedVariantId,
  onVariantSelect,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

  // Color swatch changed: jump to that variant's first image unless already viewing one.
  useEffect(() => {
    const firstOfVariant = images.findIndex(
      (img) => img.variantId === selectedVariantId,
    );
    if (firstOfVariant === -1) return;
    setActiveIndex((current) =>
      images[current]?.variantId === selectedVariantId
        ? current
        : firstOfVariant,
    );
  }, [selectedVariantId, images]);

  // Keep activeIndex in range if the image list shrinks.
  useEffect(() => {
    if (images.length === 0) return;
    setActiveIndex((current) =>
      current >= images.length ? 0 : current,
    );
  }, [images.length]);

  // Drop zoom when the active image changes.
  useEffect(() => {
    setIsZooming(false);
  }, [activeIndex]);

  const handleSelect = (index: number) => {
    if (index === activeIndex) return;
    const next = images[index];
    if (!next) return;

    setIsTransitioning(true);
    setActiveIndex(index);
    window.setTimeout(() => setIsTransitioning(false), 150);

    if (next.variantId !== selectedVariantId) {
      onVariantSelect?.(next.variantId);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x, y });
    if (!isZooming) setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  if (images.length === 0) return null;

  const safeIndex = Math.min(activeIndex, images.length - 1);
  const active = images[safeIndex];

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-3 lg:gap-4">
      {/* ── THUMBNAIL STRIP ──────────────────────────────────────────── */}
      {images.length > 1 && (
        <div
          className={cn(
            "flex gap-2.5 overflow-x-auto pb-1 scrollbar-none",
            "lg:flex-col lg:gap-3 lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0 lg:max-h-[min(100%,48rem)] lg:shrink-0",
          )}
        >
          {images.map((img, i) => (
            <button
              key={`${img.variantId}-${img.src}-${i}`}
              type="button"
              onClick={() => handleSelect(i)}
              className={cn(
                "relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 overflow-hidden border-2 transition-all duration-300",
                i === safeIndex
                  ? "border-zinc-900"
                  : "border-transparent hover:border-zinc-300",
              )}
              aria-label={`View image ${i + 1}`}
              aria-current={i === safeIndex}
            >
              <FadeImage
                src={img.src}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                sizes="(min-width: 1024px) 112px, 80px"
                className="object-cover object-top"
              />
              {i === safeIndex && (
                <div className="absolute inset-0 bg-black/8" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── MAIN IMAGE ───────────────────────────────────────────────── */}
      <div
        className="relative flex-1 aspect-square lg:aspect-5/6 overflow-hidden bg-zinc-100 min-w-0 cursor-zoom-in max-lg:cursor-default"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <FadeImage
          src={active.src}
          alt={`${productName}, view ${safeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={cn(
            "object-cover will-change-transform",
            isTransitioning ? "opacity-0" : "opacity-100",
            isZooming
              ? "transition-opacity duration-150"
              : "transition-[opacity,transform] duration-300 ease-out",
          )}
          style={{
            transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
            transform: isZooming ? `scale(${ZOOM_SCALE})` : "scale(1)",
          }}
        />
      </div>
    </div>
  );
}
