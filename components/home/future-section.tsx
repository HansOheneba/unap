"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Shirt,
  Sparkles,
  Wind,
  Heart,
  Globe,
  Tv2,
  Zap,
  Infinity,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const verticals = [
  {
    icon: Shirt,
    name: "Fashion",
    line: "The flagship. The armor. The first language of the unapologetic.",
  },
  {
    icon: Sparkles,
    name: "Beauty",
    line: "Not to cover yourself up. To show up louder.",
  },
  {
    icon: Wind,
    name: "Fragrance",
    line: "The last thing they remember. The first thing they feel.",
  },
  {
    icon: Heart,
    name: "Wellness",
    line: "You cannot pour fire into a body you have been taught to hate.",
  },
  {
    icon: Globe,
    name: "Culture",
    line: "We are not inspired by culture. We are building it from scratch.",
  },
  {
    icon: Tv2,
    name: "Media",
    line: "Our story, told by us. Unfiltered. Unapologetic.",
  },
  {
    icon: Zap,
    name: "Influence",
    line: "Not followers. Believers. There is a difference.",
  },
  {
    icon: Infinity,
    name: "Beyond",
    line: "Categories are for people with limits. We stopped counting.",
  },
];

export default function FutureSection() {
  return (
    <section className="bg-black text-white overflow-hidden">
      {/* ── FULL-BLEED INTRO ───────────────────────────── */}
      <div className="relative py-56 px-8 flex flex-col items-center justify-center text-center overflow-hidden">
        <Image
          src="/home/manBeach.jpg"
          alt="The Future"
          fill
          className="object-cover brightness-30"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black via-transparent to-black" />

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-4xl">
          <FadeIn>
            <p className="eyebrow text-white/65 mb-4">005 | The Future</p>
            <h1 className="text-white">
              This Is Just
              <br />
              the Beginning.
            </h1>
          </FadeIn>
          <FadeIn delay={0.25}>
            <p className="text-white/80 max-w-xl text-lg leading-relaxed">
              Unapologetic is not a clothing brand with a website. It is a
              global lifestyle empire in its first chapter. Fashion was the
              door. What comes next will redefine every room you walk into.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* ── DIVIDER ───────────────────────────────────── */}
      <div className="border-t border-white/5" />

      {/* ── MANIFESTO STRIP ───────────────────────────── */}
      <FadeIn className="px-8 md:px-20 py-20 max-w-5xl mx-auto text-center">
        <h3 className="text-[#564787]">
          Fashion. Beauty. Fragrance. Wellness. Culture. Media. Influence.
          <span className="text-white">
            {" "}
            Every category reimagined through the lens of radical
            self-expression.
          </span>
        </h3>
      </FadeIn>

      {/* ── DIVIDER ───────────────────────────────────── */}
      <div className="border-t border-white/5" />

      {/* ── VERTICALS GRID ────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y divide-white/5">
        {verticals.map((v, i) => {
          const Icon = v.icon;
          return (
            <FadeIn
              key={v.name}
              delay={i * 0.07}
              className="px-8 py-12 flex flex-col gap-5 group cursor-default"
            >
              <Icon
                size={28}
                strokeWidth={1}
                className="text-white/65 group-hover:text-white transition-colors duration-500"
              />
              <p className="eyebrow text-white/75 group-hover:text-white transition-colors duration-500">
                {v.name}
              </p>
              <p className="text-white/70 text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-500">
                {v.line}
              </p>
            </FadeIn>
          );
        })}
      </div>

      {/* ── DIVIDER ───────────────────────────────────── */}
      <div className="border-t border-white/5" />

      {/* ── SPLIT: image + pull quote ─────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Pull quote */}
        <div className="px-10 md:px-20 py-32 flex flex-col justify-center gap-8">
          <FadeIn>
            <p className="eyebrow text-white/60 mb-8">The Long Game</p>
            <blockquote
              className="text-white/80 italic leading-snug"
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                fontFamily: "var(--font-sora)",
              }}
            >
              &quot;In ten years they will study this brand the way they study
              movements. Not trends. Movements.&quot;
            </blockquote>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="eyebrow text-white/65">Hans Opoku | Founder</p>
          </FadeIn>
          <FadeIn delay={0.35}>
            <Link href="/future" className={buttonVariants()}>
              See What is Coming
            </Link>
          </FadeIn>
        </div>

        {/* Image */}
        <div className="relative min-h-96 md:min-h-0">
          <Image
            src="/home/womanXman.jpg"
            alt="The Future of Unapologetic"
            fill
            className="object-cover brightness-60"
          />
          <div
            className="absolute inset-0 bg-linear-to-l from-transparent to-black hidden md:block"
            style={{ clipPath: "polygon(0 0, 35% 0, 55% 100%, 0 100%)" }}
          />
          {/* Corner label */}
          <div className="absolute bottom-6 right-6">
            <p className="eyebrow text-white/60">Est. 2024</p>
          </div>
        </div>
      </div>

      {/* ── DIVIDER ───────────────────────────────────── */}
      <div className="border-t border-white/5" />

      {/* ── BOTTOM STATEMENT ──────────────────────────── */}
      <FadeIn className="py-32 px-8 flex flex-col items-center text-center gap-4">
        <p className="eyebrow text-white/70">The Trajectory</p>
        <h4 className="text-white/70 max-w-2xl">
          We are not aiming for the top.
          <span className="text-white">
            {" "}
            We are redefining what the top looks like.
          </span>
        </h4>
      </FadeIn>
    </section>
  );
}
