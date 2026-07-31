"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

type FadeImageProps = Omit<ImageProps, "onLoad">;

/**
 * Next/Image with a zinc skeleton until the bitmap is ready, then a short fade-in.
 * Parent must establish size (e.g. `relative` + aspect / fill container).
 */
export default function FadeImage({ className, alt, ...props }: FadeImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
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
        onLoad={() => setLoaded(true)}
        className={cn(
          "transition-[opacity,transform] duration-500 ease-out",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
      />
    </>
  );
}
