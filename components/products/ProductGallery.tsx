"use client";

import { useEffect, useState } from "react";
import FadeImage from "@/components/ui/fade-image";
import { PRODUCT_IMAGE_SURFACE_CLASS } from "@/lib/media/resolve-image-url";
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
  const hasThumbs = images.length > 1;

  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-3",
        // Desktop: one row sized by the main image aspect ratio. Thumbs scroll
        // inside that height via h-0 + min-h-full so they never stretch the frame.
        hasThumbs &&
          "lg:grid lg:grid-cols-[7rem_minmax(0,1fr)] lg:grid-rows-1 lg:gap-4",
      )}
    >
      {/* ── THUMBNAIL STRIP ──────────────────────────────────────────── */}
      {hasThumbs && (
        <div
          className={cn(
            "flex gap-2.5 overflow-x-auto pb-1 scrollbar-none",
            "lg:flex-col lg:gap-3 lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0",
            "lg:h-0 lg:min-h-full lg:self-stretch",
          )}
        >
          {images.map((img, i) => (
            <button
              key={`${img.variantId}-${img.src}-${i}`}
              type="button"
              onClick={() => handleSelect(i)}
              className={cn(
                "relative shrink-0 size-16 sm:size-20 lg:size-28 min-h-16 sm:min-h-20 lg:min-h-28 overflow-hidden border-2 transition-[border-color] duration-200 ease-out active:scale-[0.97]",
                PRODUCT_IMAGE_SURFACE_CLASS,
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
        className={cn(
          "relative w-full aspect-square lg:aspect-5/6 overflow-hidden min-w-0 cursor-zoom-in max-lg:cursor-default",
          PRODUCT_IMAGE_SURFACE_CLASS,
        )}
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
            "object-cover object-top will-change-transform",
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
