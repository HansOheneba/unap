"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";

/* ── Counter animation ─────────────────────────────────────── */
function Counter({
  target,
  suffix = "",
  symbol,
}: {
  target?: number;
  suffix?: string;
  symbol?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || target === undefined) return;
    const duration = 1800;
    const step = (timestamp: number, startTime: number) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame((t) => step(t, startTime));
    };
    requestAnimationFrame((t) => step(t, t));
  }, [inView, target]);

  return (
    <span ref={ref}>{symbol !== undefined ? symbol : `${count}${suffix}`}</span>
  );
}

/* ── FadeIn helper ─────────────────────────────────────────── */
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

/* ── Stats ─────────────────────────────────────────────────── */
const stats = [
  {
    value: 47,
    suffix: "K+",
    label: "Members",
    sub: "People who chose presence over permission.",
  },
  {
    value: 12,
    suffix: "",
    label: "Countries",
    sub: "The uniform of the unashamed has no borders.",
  },
  {
    symbol: "∞",
    label: "Possibilities",
    sub: "When you stop asking for approval, the ceiling disappears.",
  },
  {
    value: 1,
    suffix: "",
    label: "Movement",
    sub: "There is only one. You are either in it or watching it.",
  },
];

/* ── Testimonials ──────────────────────────────────────────── */
const testimonials = [
  {
    quote:
      "Wearing Unapologetic changed how I walk into a room. It is not clothing. It is armor.",
    name: "Maya",
    location: "London",
    img: true,
  },
  {
    quote:
      "I joined for the aesthetic. I stayed because it gave me an identity I was too afraid to claim.",
    name: "James",
    location: "New York",
    img: false,
  },
  {
    quote:
      "This brand does not sell products. It sells permission to be yourself. Fully. Loudly.",
    name: "Aisha",
    location: "Dubai",
    img: false,
  },
];

/* ── Component ─────────────────────────────────────────────── */
export default function MovementSection() {
  return (
    <section className="bg-black text-white overflow-hidden">
      {/* ── SPLIT HERO ────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[70vh]">
        {/* Left: Image */}
        <div className="relative min-h-[50vh] md:min-h-0">
          <Image
            src="/creed/creed.jpg"
            alt="The Movement"
            fill
            className="object-cover brightness-50"
          />
          {/* diagonal cut overlay */}
          <div
            className="absolute inset-0 bg-linear-to-r from-transparent to-black hidden md:block"
            style={{ clipPath: "polygon(60% 0, 100% 0, 100% 100%, 40% 100%)" }}
          />
        </div>

        {/* Right: Statement */}
        <div className="flex flex-col justify-center px-10 md:px-16 py-20 gap-8">
          <FadeIn>
            <p className="eyebrow text-white/40 mb-6">004 | The Movement</p>
            <h2 className="leading-none">
              We Are Not
              <br />
              <span className="text-white/30">a Brand.</span>
              <br />
              We Are a Tribe.
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-white/50 max-w-sm">
              Started in 2024 by those who were told to tone it down. Built for
              everyone who never did. This is not fashion. This is a frequency.
              Either you resonate or you do not.
            </p>
          </FadeIn>
          <FadeIn delay={0.35}>
            <Link href="/movement" className={buttonVariants()}>
              Join the Movement
            </Link>
          </FadeIn>
        </div>
      </div>

      {/* ── DIVIDER LINE ─────────────────────────────────── */}
      <div className="border-t border-white/5" />

      {/* ── STATS ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/5">
        {stats.map((stat, i) => (
          <FadeIn
            key={stat.label}
            delay={i * 0.1}
            className="px-10 py-16 flex flex-col gap-4"
          >
            <div
              className="text-white"
              style={{
                fontSize: "clamp(3rem, 6vw, 5rem)",
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: "-0.04em",
              }}
            >
              <Counter
                target={stat.value}
                suffix={stat.suffix}
                symbol={stat.symbol}
              />
            </div>
            <p className="eyebrow text-white/60">{stat.label}</p>
            <p className="text-white/35 text-sm leading-relaxed">{stat.sub}</p>
          </FadeIn>
        ))}
      </div>

      {/* ── DIVIDER LINE ─────────────────────────────────── */}
      <div className="border-t border-white/5" />

      {/* ── FULL-BLEED STATEMENT ─────────────────────────── */}
      <div className="relative py-40 px-8 flex items-center justify-center overflow-hidden">
        <Image
          src="/creed/creed.jpg"
          alt="The World Noticed"
          fill
          className="object-cover brightness-20"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-black" />
        <FadeIn className="relative z-10 text-center max-w-3xl flex flex-col gap-6 items-center">
          <p className="eyebrow text-white/40">The World Noticed</p>
          <h2 className="text-white">
            They tried to dim the light. The light got louder.
          </h2>
          <p className="text-white/40 max-w-md">
            Every insult became a blueprint. Every dismissal became fuel. You do
            not build a movement by asking nicely. You build it by refusing to
            be quiet.
          </p>
        </FadeIn>
      </div>

      {/* ── DIVIDER LINE ─────────────────────────────────── */}
      <div className="border-t border-white/5" />

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <div className="px-8 md:px-20 py-32 max-w-7xl mx-auto flex flex-col gap-16">
        <FadeIn>
          <p className="eyebrow text-white/40">Voices from the Tribe</p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-white/5">
          {/* Large card with image background */}
          <FadeIn className="md:col-span-5 bg-black relative overflow-hidden min-h-80 flex flex-col justify-end">
            <Image
              src="/creed/creed.jpg"
              alt={testimonials[0].name}
              fill
              className="object-cover brightness-30"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
            <div className="relative z-10 p-8 flex flex-col gap-4">
              <span
                className="text-white/20"
                style={{
                  fontSize: "5rem",
                  lineHeight: 0.8,
                  fontFamily: "var(--font-space-grotesk)",
                  fontWeight: 800,
                }}
              >
                "
              </span>
              <p className="text-white/90 text-lg leading-relaxed italic">
                {testimonials[0].quote}
              </p>
              <div className="pt-2">
                <p className="eyebrow text-white/50">
                  {testimonials[0].name} / {testimonials[0].location}
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Two stacked cards */}
          <div className="md:col-span-7 flex flex-col gap-px bg-white/5">
            {testimonials.slice(1).map((t, i) => (
              <FadeIn
                key={t.name}
                delay={0.15 * (i + 1)}
                className="bg-black p-10 flex flex-col gap-5 justify-between min-h-52"
              >
                <span
                  className="text-white/10"
                  style={{
                    fontSize: "4rem",
                    lineHeight: 0.8,
                    fontFamily: "var(--font-space-grotesk)",
                    fontWeight: 800,
                  }}
                >
                  "
                </span>
                <p className="text-white/75 text-lg leading-relaxed italic">
                  {t.quote}
                </p>
                <p className="eyebrow text-white/40">
                  {t.name} / {t.location}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
