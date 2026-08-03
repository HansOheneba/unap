"use client";

import Image from "next/image";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type UseInViewOptions,
} from "framer-motion";
import { useRef, type ReactNode, type RefObject } from "react";

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Vertical travel in px before settle. Ignored under reduced motion. */
  y?: number;
  duration?: number;
  margin?: UseInViewOptions["margin"];
};

/** Entrance fade used on marketing pages. Slides only when motion is allowed. */
export function FadeIn({
  children,
  delay = 0,
  className = "",
  y = 24,
  duration = 0.9,
  margin = "-12%",
}: FadeInProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin });
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={
        prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y }
      }
      animate={
        inView
          ? prefersReducedMotion
            ? { opacity: 1 }
            : { opacity: 1, y: 0 }
          : {}
      }
      transition={{
        duration: prefersReducedMotion ? 0.2 : duration,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

type ParallaxImageProps = {
  src: string;
  speed?: number;
  className?: string;
  overlay?: ReactNode;
};

/** Scroll-linked image shift. Frozen under prefers-reduced-motion. */
export function ParallaxImage({
  src,
  speed = 0.2,
  className = "",
  overlay,
}: ParallaxImageProps) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${-speed * 100}%`, `${speed * 100}%`],
  );

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={prefersReducedMotion ? undefined : { y }}
        className="absolute inset-[-20%] h-[140%] w-full"
      >
        <Image src={src} alt="" fill className="object-cover" />
      </motion.div>
      {overlay}
    </div>
  );
}

type HeroParallax = {
  heroRef: RefObject<HTMLElement | null>;
  heroImgY: MotionValue<string> | 0;
  heroTextY: MotionValue<string> | 0;
  heroOpacity: MotionValue<number> | 1;
  prefersReducedMotion: boolean | null;
};

/** Hero scroll parallax values. Returns static zeros when motion is reduced. */
export function useHeroParallax(
  imgTravel = "30%",
  textTravel = "20%",
  opacityEnd = 0.6,
): HeroParallax {
  const heroRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImgY = useTransform(scrollYProgress, [0, 1], ["0%", imgTravel]);
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", textTravel]);
  const heroOpacity = useTransform(scrollYProgress, [0, opacityEnd], [1, 0]);

  if (prefersReducedMotion) {
    return {
      heroRef,
      heroImgY: 0,
      heroTextY: 0,
      heroOpacity: 1,
      prefersReducedMotion,
    };
  }

  return {
    heroRef,
    heroImgY,
    heroTextY,
    heroOpacity,
    prefersReducedMotion,
  };
}
