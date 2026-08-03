"use client";

import { useEffect, useState } from "react";
import Image, { type ImageProps } from "next/image";
import {
  isRemoteImageSrc,
  PRODUCT_IMAGE_SURFACE_CLASS,
  resolveImageUrl,
  STOREFRONT_FALLBACK_IMAGE,
} from "@/lib/media/resolve-image-url";
import { cn } from "@/lib/utils";

type FadeImageProps = Omit<ImageProps, "onLoad" | "onError" | "src"> & {
  src: string;
};

/**
 * Storefront image: always resolves to a usable URL, never stays blank.
 *
 * - Normalizes Cloudinary masters to a deliverable size
 * - Loads remotes straight from the CDN (skips /_next/image, which blanks on fat uploads)
 * - Falls back to a local brand asset on error
 * - Reveals after a timeout so a hung request can't leave a zinc skeleton forever
 */
export default function FadeImage({
  className,
  alt,
  src,
  unoptimized,
  ...props
}: FadeImageProps) {
  const resolvedSrc = resolveImageUrl(src);
  const [loaded, setLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(resolvedSrc);

  useEffect(() => {
    setCurrentSrc(resolveImageUrl(src));
    setLoaded(false);

    const timeoutId = window.setTimeout(() => {
      setLoaded(true);
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [src]);

  return (
    <>
      {/* Stays after load so transparent PNGs keep a brand-safe light surface. */}
      <div aria-hidden className={cn("absolute inset-0", PRODUCT_IMAGE_SURFACE_CLASS)} />
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 bg-zinc-100 transition-opacity duration-500 ease-out",
          loaded ? "opacity-0" : "animate-pulse opacity-100",
        )}
      />
      <Image
        alt={alt}
        {...props}
        src={currentSrc}
        // Remote assets are already CDN-sized via resolveImageUrl. Hitting them
        // directly avoids optimizer timeouts that leave cards empty.
        unoptimized={unoptimized ?? isRemoteImageSrc(currentSrc)}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (currentSrc !== STOREFRONT_FALLBACK_IMAGE) {
            setCurrentSrc(STOREFRONT_FALLBACK_IMAGE);
            setLoaded(false);
            return;
          }
          setLoaded(true);
        }}
        ref={(node) => {
          // Cached bitmaps may skip onLoad in some browsers.
          // Guard: never setState when already loaded — inline ref callbacks
          // re-fire every commit and must not schedule work on iOS Safari.
          if (node?.complete && node.naturalWidth > 0) {
            setLoaded((wasLoaded) => (wasLoaded ? wasLoaded : true));
          }
        }}
        className={cn(
          "transition-[opacity,transform] duration-500 ease-out",
          className,
          // Keep the gate after caller classes so a hung load can't be forced visible,
          // while still allowing callers (e.g. gallery transitions) to fade when loaded.
          !loaded && "!opacity-0",
        )}
      />
    </>
  );
}
