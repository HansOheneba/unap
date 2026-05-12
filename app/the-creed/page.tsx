"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import { buttonVariants } from "@/components/ui/button";

/* ── tiny helpers ── */
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
  const inView = useInView(ref, { once: true, margin: "-15%" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ParallaxImage({
  src,
  speed = 0.25,
  className = "",
  overlay,
}: {
  src: string;
  speed?: number;
  className?: string;
  overlay?: React.ReactNode;
}) {
  const ref = useRef(null);
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
        style={{ y }}
        className="absolute inset-[-20%] w-full h-[140%]"
      >
        <Image src={src} alt="" fill className="object-cover" />
      </motion.div>
      {overlay}
    </div>
  );
}

const creeds = [
  "I Do Not Shrink.",
  "I Do Not Apologize.",
  "I Do Not Ask Permission to Exist Boldly.",
  "I Am the Fire They Tried to Extinguish.",
  "I Am the Voice They Tried to Silence.",
  "I Am Unapologetic.",
];

export default function TheCreedPage() {
  /* hero parallax */
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImgY = useTransform(heroProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroProgress, [0, 0.6], [1, 0]);
  const heroTextY = useTransform(heroProgress, [0, 1], ["0%", "20%"]);

  return (
    <main className="bg-black text-white overflow-x-hidden">
      {/* ── 01  HERO — full-screen image with parallax ── */}
      <section
        ref={heroRef}
        className="relative h-screen overflow-hidden flex items-center justify-center"
      >
        <motion.div style={{ y: heroImgY }} className="absolute inset-0">
          <Image
            src="/home/manBeach.jpg"
            alt=""
            fill
            className="object-cover brightness-60"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/80" />
        </motion.div>

        <motion.div
          style={{ y: heroTextY, opacity: heroOpacity }}
          className="relative z-10 flex flex-col items-center text-center gap-5 px-8"
        >
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
          >
            002 | The Creed
          </motion.p>
          <motion.h1
            className="max-w-3xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            This Is Our Scripture.
          </motion.h1>
          <motion.p
            className="text-white/50 max-w-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            This is our promise. This is who we are.
          </motion.p>
        </motion.div>
      </section>

      {/* ── 02  THE ACCUSATION — what the world said ── */}
      <section className="py-40 px-8 md:px-24 max-w-360 mx-auto">
        <FadeIn>
          <p className="eyebrow mb-10">What They Said</p>
        </FadeIn>
        <div className="flex flex-col gap-10">
          {[
            {
              word: "Too Much.",
              sub: "They said your energy was overwhelming.",
            },
            { word: "Too Loud.", sub: "They said your voice needed lowering." },
            {
              word: "Too Proud.",
              sub: "They called your confidence arrogance.",
            },
            {
              word: "Too Bold.",
              sub: "They mistook your fire for recklessness.",
            },
          ].map((item, i) => (
            <FadeIn key={item.word} delay={i * 0.08}>
              <div className="flex flex-col md:flex-row md:items-baseline gap-3 md:gap-8 border-t border-white/10 pt-10">
                <h2 className="text-white/20 md:w-80 shrink-0">{item.word}</h2>
                <p className="text-white/50 text-xl">{item.sub}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── 03  FULL-BLEED PARALLAX STATEMENT ── */}
      <ParallaxImage
        src="/home/womanXman.jpg"
        speed={0.2}
        className="h-[85vh]"
        overlay={
          <>
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
              <FadeIn>
                <h2 className="max-w-2xl text-white">
                  They were wrong about you. They have always been wrong about
                  you.
                </h2>
              </FadeIn>
            </div>
          </>
        }
      />

      {/* ── 04  THE CREED — revealed line by line ── */}
      <section className="py-48 px-8 md:px-20 max-w-360 mx-auto">
        <FadeIn className="mb-20">
          <p className="eyebrow">The Creed</p>
        </FadeIn>
        <div className="flex flex-col">
          {creeds.map((line, i) => (
            <FadeIn key={i} delay={i * 0.06}>
              <div className="border-t border-white/10 py-10 flex items-baseline gap-8">
                <span className="eyebrow text-white/15 w-8 shrink-0 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="text-white">{line}</h2>
              </div>
            </FadeIn>
          ))}
          <div className="border-t border-white/10" />
        </div>
      </section>

      {/* ── 05  THE ORIGIN — story, image right ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        <div className="bg-black flex flex-col justify-center px-12 md:px-20 py-32 gap-10 order-2 md:order-1">
          <FadeIn>
            <p className="eyebrow mb-6">The Origin</p>
            <h3 className="mb-6">
              Born in the Rooms That Made You Feel Like You Were Too Much
            </h3>
            <p className="text-white/55 mb-4">
              Every label you were handed. Every apology you were forced to
              perform. Every time you dimmed yourself so someone else could feel
              comfortable. That is what Unapologetic was built against.
            </p>
            <p className="text-white/55">
              We are not a brand. We are a refusal. A decision made in silence
              that finally found its voice. When you wear this, you are not
              buying clothing. You are making a declaration that you are done
              shrinking.
            </p>
          </FadeIn>
        </div>
        <ParallaxImage
          src="/home/manXmanModels.jpg"
          speed={0.15}
          className="min-h-96 md:min-h-0 order-1 md:order-2"
        />
      </section>

      {/* ── 06  PULL QUOTE — cinematic center ── */}
      <section className="py-56 px-8 text-center">
        <FadeIn className="max-w-4xl mx-auto flex flex-col gap-8">
          <blockquote>
            <p className="text-3xl md:text-5xl font-light text-white/80 leading-snug tracking-tight italic">
              &ldquo;Boldness is not arrogance.
              <br />
              Confidence is not vanity.
              <br />
              Wanting more is not greed.
              <br />
              It is your birthright.&rdquo;
            </p>
          </blockquote>
          <p className="eyebrow text-white/30">Unapologetic, Est. 2024</p>
        </FadeIn>
      </section>

      {/* ── 07  THE THREE LAWS — staggered cards ── */}
      <section className="py-32 px-8 md:px-20 max-w-360 mx-auto">
        <FadeIn className="mb-20">
          <p className="eyebrow">Three Laws We Live By</p>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-l border-white/10">
          {[
            {
              num: "I",
              title: "Presence is Power",
              body: "You do not need permission to take up space. Your existence is not up for debate. Walk in like you were expected.",
            },
            {
              num: "II",
              title: "Silence Is a Lie",
              body: "Every time you held your tongue to keep the peace, you lied to yourself. We make clothes for people who are done lying.",
            },
            {
              num: "III",
              title: "The Cloth Speaks First",
              body: "Before you say a word, your presence already has. What you wear is the opening line of the story you tell the world.",
            },
          ].map((pillar, i) => (
            <FadeIn key={pillar.num} delay={i * 0.1}>
              <div className="border-r border-white/10 px-10 py-12 flex flex-col gap-5 h-full">
                <span className="eyebrow text-white/25">{pillar.num}</span>
                <h4 className="text-white">{pillar.title}</h4>
                <p className="text-white/50">{pillar.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── 08  SECOND PARALLAX ── */}
      <ParallaxImage
        src="/home/manStudio.jpg"
        speed={0.18}
        className="h-[60vh]"
        overlay={
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
        }
      />

      {/* ── 09  CTA — the invitation ── */}
      <section className="py-56 px-8 flex flex-col items-center text-center gap-8">
        <FadeIn className="flex flex-col items-center gap-8">
          <p className="eyebrow">You Already Know</p>
          <h2 className="max-w-xl text-white">Now Dress Like It.</h2>
          <p className="text-white/45 max-w-sm text-lg font-light leading-relaxed">
            The collection is not for everyone. It never was. It is for the ones
            who stopped pretending and started arriving.
          </p>
          <Link href="/collections" className={buttonVariants()}>
            Enter the Collection
          </Link>
        </FadeIn>
      </section>
    </main>
  );
}
