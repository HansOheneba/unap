"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
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
import {
  FadeIn,
  ParallaxImage,
  useHeroParallax,
} from "@/components/motion/marketing";

const verticals = [
  { icon: Shirt, name: "Fashion", line: "The flagship. The armor. The first language of the unapologetic." },
  { icon: Sparkles, name: "Beauty", line: "Not to cover yourself up. To show up louder." },
  { icon: Wind, name: "Fragrance", line: "The last thing they remember. The first thing they feel." },
  { icon: Heart, name: "Wellness", line: "You cannot pour fire into a body you have been taught to hate." },
  { icon: Globe, name: "Culture", line: "We are not inspired by culture. We are building it from scratch." },
  { icon: Tv2, name: "Media", line: "Our story, told by us. Unfiltered. Unapologetic." },
  { icon: Zap, name: "Influence", line: "Not followers. Believers. There is a difference." },
  { icon: Infinity, name: "Beyond", line: "Categories are for people with limits. We stopped counting." },
];

const phases = [
  {
    num: "01",
    title: "Fashion",
    status: "Live",
    body: "The uniform of the unapologetic. Tops, bottoms, underwear, tracksuits, active wear, and accessories, shipping now.",
  },
  {
    num: "02",
    title: "Beauty & Fragrance",
    status: "In Development",
    body: "Products built for people who show up loud. Not to cover anything. To finish the statement your outfit started.",
  },
  {
    num: "03",
    title: "Culture & Media",
    status: "Coming",
    body: "Our own stories, told our own way. Film, sound, and events that carry the same refusal to shrink.",
  },
  {
    num: "04",
    title: "Beyond",
    status: "Unwritten",
    body: "We have not decided yet, and that is the point. The ceiling was the first thing we removed.",
  },
];

function statusColor(status: string) {
  if (status === "Live") return "bg-zinc-900 text-white";
  return "bg-zinc-100 text-zinc-500";
}

export default function FuturePage() {
  const { heroRef, heroImgY, heroTextY, heroOpacity, prefersReducedMotion } =
    useHeroParallax();

  return (
    <main className="bg-white text-zinc-900 overflow-x-hidden">
      {/* ── 01  HERO ── */}
      <section
        ref={heroRef}
        className="relative h-dvh overflow-hidden flex items-center justify-center"
      >
        <motion.div style={{ y: heroImgY }} className="absolute inset-0">
          <Image
            src="/home/manBlackCap.jpg"
            alt=""
            fill
            className="object-cover brightness-30"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/90" />
        </motion.div>

        <motion.div
          style={{ y: heroTextY, opacity: heroOpacity }}
          className="relative z-10 flex flex-col items-center text-center gap-6 px-8 max-w-4xl"
        >
          <motion.p
            className="eyebrow text-white/65"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0.2 : 1.2,
              delay: prefersReducedMotion ? 0 : 0.4,
            }}
          >
            005 | The Future
          </motion.p>
          <motion.h1
            className="text-white"
            initial={
              prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }
            }
            animate={
              prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
            }
            transition={{
              duration: prefersReducedMotion ? 0.2 : 1.2,
              delay: prefersReducedMotion ? 0 : 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            This Is Just
            <br />
            the Beginning.
          </motion.h1>
          <motion.p
            className="text-white/80 max-w-xl text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0.2 : 1,
              delay: prefersReducedMotion ? 0 : 1.1,
            }}
          >
            Unapologetic is not a clothing brand. It is a
            global lifestyle empire in its first chapter. Fashion was the
            door. What comes next will redefine every room you walk into.
          </motion.p>
        </motion.div>
      </section>

      {/* ── 02  MANIFESTO STRIP ── */}
      <FadeIn className="px-8 md:px-20 py-20 max-w-360 mx-auto text-center">
        <h3 className="text-[#564787]">
          Fashion. Beauty. Fragrance. Wellness. Culture. Media. Influence.
          <span className="text-zinc-900">
            {" "}
            Every category reimagined through the lens of radical
            self-expression.
          </span>
        </h3>
      </FadeIn>

      <div className="border-t border-zinc-100" />

      {/* ── 03  VERTICALS GRID ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y divide-zinc-100">
        {verticals.map((v, i) => {
          const Icon = v.icon;
          return (
            <FadeIn
              key={v.name}
              delay={i * 0.06}
              className="px-8 py-12 flex flex-col gap-5 group cursor-default"
            >
              <Icon
                size={28}
                strokeWidth={1}
                className="text-zinc-400 group-hover:text-zinc-900 transition-colors duration-500"
              />
              <p className="eyebrow text-zinc-600 group-hover:text-zinc-900 transition-colors duration-500">
                {v.name}
              </p>
              <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-zinc-800 transition-colors duration-500">
                {v.line}
              </p>
            </FadeIn>
          );
        })}
      </div>

      <div className="border-t border-zinc-100" />

      {/* ── 04  THE TRAJECTORY (ROADMAP) ── */}
      <section className="py-40 px-8 md:px-20 max-w-360 mx-auto">
        <FadeIn className="mb-20 flex flex-col gap-6">
          <p className="eyebrow">The Trajectory</p>
          <h2 className="max-w-2xl leading-tight">
            Where We Are. Where We Are Going.
          </h2>
        </FadeIn>

        <div className="flex flex-col">
          {phases.map((phase, i) => (
            <FadeIn key={phase.num} delay={i * 0.08}>
              <div className="border-t border-zinc-100 py-10 grid grid-cols-1 md:grid-cols-[5rem_1fr_auto] gap-4 md:gap-10 items-start md:items-center">
                <span className="eyebrow text-zinc-300">{phase.num}</span>
                <div className="flex flex-col gap-2">
                  <h4 className="text-zinc-900">{phase.title}</h4>
                  <p className="text-zinc-500 leading-relaxed max-w-lg">
                    {phase.body}
                  </p>
                </div>
                <span
                  className={`eyebrow shrink-0 px-3 py-1.5 rounded-full whitespace-nowrap ${statusColor(phase.status)}`}
                >
                  {phase.status}
                </span>
              </div>
            </FadeIn>
          ))}
          <div className="border-t border-zinc-100" />
        </div>
      </section>

      {/* ── 05  SPLIT: image + pull quote ── */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="px-10 md:px-20 py-32 flex flex-col justify-center gap-8 order-2 md:order-1">
          <FadeIn>
            <p className="eyebrow text-zinc-500 mb-8">The Long Game</p>
            <blockquote
              className="text-zinc-700 italic leading-snug"
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
            <p className="eyebrow text-zinc-500">Teflon Flexx | Founder</p>
          </FadeIn>
          <FadeIn delay={0.35}>
            <Link href="/inner-circle" className={buttonVariants()}>
              Be Part of What&apos;s Next
            </Link>
          </FadeIn>
        </div>

        <ParallaxImage
          src="/home/track.jpg"
          speed={0.15}
          className="min-h-96 md:min-h-0 order-1 md:order-2"
        />
      </div>

      <div className="border-t border-zinc-100" />

      {/* ── 06  BOTTOM STATEMENT ── */}
      <FadeIn className="py-32 px-8 flex flex-col items-center text-center gap-4">
        <p className="eyebrow text-zinc-500">The Ceiling</p>
        <h4 className="text-zinc-400 max-w-2xl">
          We are not aiming for the top.
          <span className="text-zinc-900"> We are redefining what the top looks like.</span>
        </h4>
      </FadeIn>
    </main>
  );
}
