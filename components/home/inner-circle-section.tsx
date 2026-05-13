"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Lock, CalendarDays, BookOpen, Crown } from "lucide-react";

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

const privileges = [
  {
    icon: Lock,
    name: "Exclusive Drops",
    line: "First access to limited collections before the world even knows they exist. Being first is not a perk. It is a statement.",
  },
  {
    icon: CalendarDays,
    name: "Private Events",
    line: "Curated experiences in cities worldwide. Rooms you cannot buy your way into. You have to belong.",
  },
  {
    icon: BookOpen,
    name: "Untold Stories",
    line: "Behind-the-scenes. The creative process. The decisions nobody outside sees. Raw, unfiltered, ours.",
  },
  {
    icon: Crown,
    name: "Member Identity",
    line: "A digital membership that means something. Not a discount code. A marker of who you are.",
  },
];

export default function InnerCircleSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <section className="bg-white text-zinc-900 overflow-hidden">
      {/* ── FULL-BLEED HEADER ─────────────────────────── */}
      <div className="relative flex flex-col items-center justify-center text-center py-56 px-8 overflow-hidden">
        <Image
          src="/home/manXmanModels.jpg"
          alt="The Inner Circle"
          fill
          className="object-cover brightness-25"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black via-black/40 to-black" />

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl">
          <FadeIn>
            <p className="eyebrow text-white/65 mb-4">Exclusive Access</p>
            <h1 className="text-white">The Inner Circle</h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p
              className="text-white/80 text-lg italic max-w-md leading-relaxed"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              For those who do not just wear the brand. They embody it.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* ── DIVIDER ───────────────────────────────────── */}
      <div className="border-t border-white/5" />

      {/* ── TENSION COPY ──────────────────────────────── */}
      <FadeIn className="py-20 px-8 md:px-20 max-w-360 mx-auto text-center">
        <h3 className="text-[#564787]">
          Most communities are built on transactions.
          <span className="text-zinc-900">
            {" "}
            This one is built on conviction.
          </span>
        </h3>
      </FadeIn>

      {/* ── DIVIDER ───────────────────────────────────── */}
      <div className="border-t border-zinc-100" />

      {/* ── PRIVILEGES GRID ───────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-x md:divide-y-0 divide-zinc-100 max-w-360 mx-auto">
        {privileges.map((p, i) => {
          const Icon = p.icon;
          return (
            <FadeIn
              key={p.name}
              delay={i * 0.1}
              className="px-10 md:px-16 py-14 flex flex-col gap-5 group border-b border-zinc-100 last:border-b-0 md:last:border-b md:nth-3:border-b-0 md:nth-4:border-b-0"
            >
              <Icon
                size={26}
                strokeWidth={1}
                className="text-zinc-400 group-hover:text-zinc-900 transition-colors duration-500"
              />
              <p className="eyebrow text-zinc-600 group-hover:text-zinc-900 transition-colors duration-500">
                {p.name}
              </p>
              <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-zinc-800 transition-colors duration-500 max-w-sm">
                {p.line}
              </p>
            </FadeIn>
          );
        })}
      </div>

      {/* ── DIVIDER ───────────────────────────────────── */}
      <div className="border-t border-zinc-100" />

      {/* ── SPLIT: statement + signup ─────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Image side */}
        <div className="relative min-h-96 md:min-h-0 order-2 md:order-1">
          <Image
            src="/home/beanieRed.jpg"
            alt="Join the Inner Circle"
            fill
            className="object-cover brightness-40"
          />
          <div
            className="absolute inset-0 bg-linear-to-r from-transparent to-white hidden md:block"
            style={{ clipPath: "polygon(65% 0, 100% 0, 100% 100%, 45% 100%)" }}
          />
          <div className="absolute inset-0 flex flex-col justify-end p-10">
            <p className="eyebrow text-white/65">The Circle</p>
            <p className="text-white/70 text-sm mt-2 max-w-xs leading-relaxed">
              Not everyone gets in. Not because of status. Because of standards.
            </p>
          </div>
        </div>

        {/* Signup side */}
        <div className="order-1 md:order-2 px-10 md:px-16 py-24 flex flex-col justify-center gap-10">
          <FadeIn>
            <p className="eyebrow text-zinc-500 mb-4">Step Inside</p>
            <h2 className="text-zinc-900 max-w-sm">
              Your Name Belongs on This List.
            </h2>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="text-zinc-600 max-w-sm leading-relaxed">
              Drop your email. No spam. No noise. Only what matters. When we
              move, you will be the first to know. When we drop, you will have
              first access. When we speak, it will be worth reading.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-3"
              >
                <p className="eyebrow text-zinc-900">You are in.</p>
                <p className="text-zinc-500 text-sm">
                  Welcome to the Inner Circle. Watch your inbox.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 px-6 py-3 text-[0.7rem] tracking-widest uppercase outline-none focus:border-zinc-400 transition-colors duration-300"
                />
                <button
                  type="submit"
                  className="border border-zinc-900 bg-transparent text-zinc-900 px-8 py-3 text-[0.7rem] tracking-widest uppercase hover:bg-zinc-900 hover:text-white transition-colors duration-300 shrink-0"
                >
                  Join
                </button>
              </form>
            )}
          </FadeIn>

          <FadeIn delay={0.4}>
            <p className="text-zinc-400 text-xs tracking-wider uppercase">
              No spam. No selling your data. Just signal.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* ── DIVIDER ───────────────────────────────────── */}
      <div className="border-t border-zinc-100" />

      {/* ── CLOSING STATEMENT ───────────────────────────────── */}
      <FadeIn className="py-28 px-8 text-center flex flex-col gap-3 items-center">
        <p className="eyebrow text-zinc-500">The Standard</p>
        <h4 className="text-[#564787] max-w-2xl">
          The world has enough audiences.
          <span className="text-zinc-900">
            {" "}
            We are building a congregation.
          </span>
        </h4>
      </FadeIn>
    </section>
  );
}
