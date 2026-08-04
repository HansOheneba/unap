"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  FadeIn,
  ParallaxImage,
  useHeroParallax,
} from "@/components/motion/marketing";
import { subscribeNewsletter } from "@/lib/api/forms";
import { ApiError } from "@/lib/api/client";

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const prefersReducedMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion) {
      setCount(target);
      return;
    }
    const duration = 1800;
    const step = (timestamp: number, startTime: number) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame((t) => step(t, startTime));
    };
    requestAnimationFrame((t) => step(t, t));
  }, [inView, target, prefersReducedMotion]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

const stats = [
  { value: 47, suffix: "K+", label: "Members", sub: "People who chose presence over permission." },
  { value: 12, suffix: "", label: "Countries", sub: "The uniform of the unashamed has no borders." },
  { value: 1, suffix: "", label: "Movement", sub: "There is only one. You are either in it or watching it." },
];

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/unapologeticnm" },
  { label: "TikTok", href: "https://www.tiktok.com/@unapologeticnm" },
  { label: "YouTube", href: "https://youtube.com/@unapologeticnm" },
  { label: "X", href: "https://x.com/unapologeticnm" },
] as const;

const principles = [
  {
    num: "01",
    title: "No Followers, Only Believers",
    body: "We do not chase numbers. We build conviction. A believer shows up when nobody is watching. A follower only shows up for the discount.",
  },
  {
    num: "02",
    title: "Wear It Like You Mean It",
    body: "This was never about looking good in photos. It is about walking into a room and letting your presence speak before you do.",
  },
  {
    num: "03",
    title: "The Tribe Has No Border",
    body: "Accra, London, Dubai, New York. Different cities, same frequency. If you understood this before we explained it, you already belong.",
  },
];

const voices = [
  {
    quote:
      "I stopped asking people if I was too much. I just started dressing like the answer was obvious.",
    name: "Kojo",
    location: "Accra",
  },
  {
    quote:
      "This is the first brand that never asked me to tone anything down. It asked me to turn it up.",
    name: "Naomi",
    location: "Johannesburg",
  },
  {
    quote:
      "I do not follow trends. I follow conviction. This is the only movement I have stayed loyal to.",
    name: "Rashid",
    location: "Toronto",
  },
];

export default function MovementPage() {
  const { heroRef, heroImgY, heroTextY, heroOpacity, prefersReducedMotion } =
    useHeroParallax();

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleCommunitySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    setSubmitting(true);
    try {
      await subscribeNewsletter({
        email: email.trim(),
        source: "inner_circle",
      });
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not join right now. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="bg-white text-zinc-900 overflow-x-hidden">
      {/* ── 01  HERO ── */}
      <section
        ref={heroRef}
        className="relative h-dvh overflow-hidden flex items-center justify-center"
      >
        <motion.div style={{ y: heroImgY }} className="absolute inset-0">
          <Image
            src="/creed/movement.jpg"
            alt=""
            fill
            priority
            className="object-cover object-center brightness-50"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/85" />
        </motion.div>

        <motion.div
          style={{ y: heroTextY, opacity: heroOpacity }}
          className="relative z-10 flex flex-col items-center text-center gap-5 px-8"
        >
          <motion.p
            className="eyebrow text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0.2 : 1.2,
              delay: prefersReducedMotion ? 0 : 0.4,
            }}
          >
            004 | The Movement
          </motion.p>
          <motion.h1
            className="max-w-3xl text-white"
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
            We Are Not a Brand.
            <br />
            We Are a Tribe.
          </motion.h1>
          <motion.p
            className="text-white/75 max-w-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0.2 : 1,
              delay: prefersReducedMotion ? 0 : 1.1,
            }}
          >
            Started by those who were told to tone it down. Built for everyone
            who never did.
          </motion.p>
        </motion.div>
      </section>

      {/* ── 02  THE ORIGIN ── */}
      <section className="py-40 px-8 md:px-24 max-w-360 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-28 items-start">
          <FadeIn>
            <p className="eyebrow mb-6">How It Started</p>
            <h2 className="leading-tight">
              A Frequency, Not
              <br />
              a Trend.
            </h2>
          </FadeIn>
          <FadeIn delay={0.15} className="flex flex-col gap-6 md:pt-6">
            <p className="text-zinc-600 leading-relaxed">
              In 2024, a small group of people got tired of shrinking. Tired of
              softening their opinions, dimming their style, and asking
              permission to exist loudly. So they built something that refused
              to do any of that.
            </p>
            <p className="text-zinc-600 leading-relaxed">
              That refusal became a name. The name became a uniform. The
              uniform became a signal that people across cities and continents
              started recognizing in each other before they ever spoke a word.
            </p>
            <p className="text-zinc-900 font-medium leading-relaxed border-l-2 border-zinc-900 pl-5">
              This is not fashion. This is a frequency. Either you resonate or
              you do not.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── 03  STATS ── */}
      <section className="border-t border-zinc-100">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-x-0 md:divide-x divide-y md:divide-y-0 divide-zinc-100">
          {stats.map((stat, i) => (
            <FadeIn
              key={stat.label}
              delay={i * 0.1}
              className="px-10 py-16 flex flex-col gap-4"
            >
              <div
                className="text-zinc-900"
                style={{
                  fontSize: "clamp(3rem, 6vw, 5rem)",
                  fontWeight: 800,
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                }}
              >
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="eyebrow text-zinc-500">{stat.label}</p>
              <p className="text-zinc-600 text-sm leading-relaxed">{stat.sub}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── 04  FULL-BLEED STATEMENT ── */}
      <ParallaxImage
        src="/home/boxModel.jpg"
        speed={0.2}
        className="h-[80vh]"
        overlay={
          <>
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-black" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
              <FadeIn className="max-w-3xl flex flex-col gap-6 items-center">
                <p className="eyebrow text-white/65">The World Noticed</p>
                <h2 className="text-white leading-tight">
                  They tried to dim the light.
                  <br />
                  The light got louder.
                </h2>
                <p className="text-white/70 max-w-md">
                  Every insult became a blueprint. Every dismissal became
                  fuel. You do not build a movement by asking nicely. You
                  build it by refusing to be quiet.
                </p>
              </FadeIn>
            </div>
          </>
        }
      />

      {/* ── 05  PRINCIPLES ── */}
      <section className="py-40 px-8 md:px-20 max-w-360 mx-auto">
        <FadeIn className="mb-20">
          <p className="eyebrow">How the Movement Moves</p>
        </FadeIn>
        <div className="flex flex-col">
          {principles.map((p, i) => (
            <FadeIn key={p.num} delay={i * 0.1}>
              <div className="border-t border-zinc-100 py-14 grid grid-cols-1 md:grid-cols-[6rem_1fr] gap-6 md:gap-16 items-start">
                <span className="eyebrow text-zinc-300 mt-1">{p.num}</span>
                <div className="flex flex-col gap-4">
                  <h3 className="text-zinc-900">{p.title}</h3>
                  <p className="text-zinc-500 leading-relaxed max-w-lg">
                    {p.body}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
          <div className="border-t border-zinc-100" />
        </div>
      </section>

      {/* ── 06  VOICES FROM THE TRIBE ── */}
      <section className="bg-zinc-50 px-8 md:px-20 py-32">
        <div className="max-w-360 mx-auto flex flex-col gap-16">
          <FadeIn>
            <p className="eyebrow text-zinc-500">Voices from the Tribe</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-200">
            {voices.map((v, i) => (
              <FadeIn
                key={v.name}
                delay={i * 0.1}
                className="bg-white p-10 flex flex-col gap-6 justify-between min-h-64"
              >
                <span
                  className="text-zinc-200"
                  style={{
                    fontSize: "4rem",
                    lineHeight: 0.8,
                    fontFamily: "var(--font-space-grotesk)",
                    fontWeight: 800,
                  }}
                >
                  &quot;
                </span>
                <p className="text-zinc-700 leading-relaxed italic">
                  {v.quote}
                </p>
                <p className="eyebrow text-zinc-400">
                  {v.name} / {v.location}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 07  JOIN THE COMMUNITY ── */}
      <section className="relative flex flex-col items-center justify-center text-center py-32 md:py-44 px-8 overflow-hidden">
        <Image
          src="/home/hoodieBlackMan.jpg"
          alt=""
          fill
          className="object-cover brightness-25"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/50 to-black/80" />

        <FadeIn className="relative z-10 flex flex-col items-center gap-6 max-w-lg w-full">
          <p className="eyebrow text-white/65">You Already Feel It</p>
          <h2 className="text-white">Join the Community</h2>
          <p className="text-white/75 leading-relaxed">
            Get movement updates, early drops, and what we share first with the
            tribe. No spam. Just signal.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-2 pt-2"
            >
              <p className="eyebrow text-white">You are in.</p>
              <p className="text-white/70 text-sm">
                Welcome to the community. Watch your inbox.
              </p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleCommunitySubmit}
              className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-2"
            >
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                disabled={submitting}
                className="flex-1 bg-black border border-white/40 text-white placeholder:text-white/40 px-6 py-3 text-[0.7rem] tracking-widest uppercase outline-none focus:border-white/60 transition-colors duration-300 disabled:opacity-60"
              />
              <Button
                type="submit"
                variant="outline-white"
                disabled={submitting}
                className="shrink-0"
              >
                {submitting ? "Joining…" : "Join Free"}
              </Button>
            </form>
          )}

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <Link
            href="/collections"
            className={buttonVariants({ variant: "outline-white" })}
          >
            Shop Collections
          </Link>

          <div className="flex flex-col items-center gap-4 pt-4">
            <p className="eyebrow text-white/65">Follow the Movement</p>
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm tracking-widest uppercase text-white/75 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
