"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Lock, CalendarDays, BookOpen, Crown, ArrowDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

/* helpers */
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
  const inView = useInView(ref, { once: true, margin: "-12%" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ParallaxImage({
  src,
  speed = 0.2,
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

function Label({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <p
      className={`text-[0.65rem] font-semibold tracking-[0.45em] uppercase ${
        dark ? "text-white/40" : "text-zinc-400"
      }`}
    >
      {children}
    </p>
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

export default function InnerCirclePage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImgY = useTransform(heroProgress, [0, 1], ["0%", "28%"]);
  const heroOpacity = useTransform(heroProgress, [0, 0.65], [1, 0]);
  const heroTextY = useTransform(heroProgress, [0, 1], ["0%", "18%"]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <main className="bg-white text-zinc-900 overflow-x-hidden">
      {/* 01  HERO - dark, full-bleed image */}
      <section
        ref={heroRef}
        className="relative h-screen overflow-hidden flex items-center justify-center"
      >
        <motion.div style={{ y: heroImgY }} className="absolute inset-0">
          <Image
            src="/home/manXmanModels.jpg"
            alt=""
            fill
            className="object-cover brightness-30"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-transparent to-black/90" />
        </motion.div>

        <motion.div
          style={{ y: heroTextY, opacity: heroOpacity }}
          className="relative z-10 flex flex-col items-center text-center gap-6 px-8"
        >
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
          >
            <Label dark>Exclusive Access</Label>
            <div className="w-10 h-px bg-white/25" />
          </motion.div>

          <motion.h1
            className="text-white max-w-4xl"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            The Inner Circle
          </motion.h1>

          <motion.p
            className="text-white/65 text-lg max-w-sm font-light leading-relaxed"
            style={{ fontFamily: "var(--font-sora)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            For those who don&apos;t just wear the brand. They embody it.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
          >
            <p className="text-[0.6rem] tracking-[0.4em] uppercase text-white/30">
              Scroll
            </p>
            <ArrowDown size={13} className="text-white/30 animate-bounce" />
          </motion.div>
        </motion.div>
      </section>

      {/* 02  THE DOCTRINE - light */}
      <section className="py-40 px-8 md:px-20 max-w-360 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-28 items-start">
          <FadeIn className="flex flex-col gap-8">
            <Label>The Doctrine</Label>
            <h2 className="text-zinc-900 leading-tight">
              This Is Not a Community.
              <br />
              This Is a Conviction.
            </h2>
          </FadeIn>
          <FadeIn delay={0.15} className="flex flex-col gap-6 md:pt-20">
            <p className="text-zinc-600 leading-relaxed">
              Most communities are built on transactions. Buy something, get a
              code. Follow us, get notified. That is not what this is.
            </p>
            <p className="text-zinc-600 leading-relaxed">
              The Inner Circle is for the ones who were never just customers.
              The ones who felt something the first time they saw this. The ones
              who understood it before we could explain it.
            </p>
            <p className="text-zinc-900 font-medium leading-relaxed border-l-2 border-zinc-900 pl-5">
              You are not joining a mailing list. You are taking a position.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 03  PRIVILEGES - light */}
      <section className="border-t border-zinc-100">
        <div className="max-w-360 mx-auto">
          <FadeIn className="px-8 md:px-20 pt-20 pb-12">
            <Label>What You Get</Label>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {privileges.map((p, i) => {
              const Icon = p.icon;
              const isLeftCol = i % 2 === 0;
              const isLastRow = i >= privileges.length - 2;
              return (
                <FadeIn
                  key={p.name}
                  delay={i * 0.08}
                  className={[
                    "px-10 md:px-20 py-16 flex flex-col gap-6 group border-b border-zinc-100",
                    isLeftCol ? "md:border-r md:border-zinc-100" : "",
                    isLastRow ? "md:border-b-0" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <Icon
                    size={24}
                    strokeWidth={1}
                    className="text-zinc-300 group-hover:text-zinc-900 transition-colors duration-500"
                  />
                  <p className="text-[0.65rem] font-semibold tracking-[0.35em] uppercase text-zinc-400 group-hover:text-zinc-900 transition-colors duration-500">
                    {p.name}
                  </p>
                  <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-zinc-700 transition-colors duration-500 max-w-sm">
                    {p.line}
                  </p>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* 04  PARALLAX BREAK - dark, full-bleed */}
      <ParallaxImage
        src="/home/manBeach.jpg"
        speed={0.2}
        className="h-[70vh]"
        overlay={
          <>
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 gap-5">
              <FadeIn>
                <h2 className="text-white max-w-3xl leading-tight">
                  You Were Never Made to Blend In.
                </h2>
                <p className="text-white/55 mt-6 text-xl max-w-sm mx-auto font-light">
                  So stop acting like it.
                </p>
              </FadeIn>
            </div>
          </>
        }
      />

      {/* 05  THE RULES - light */}
      <section className="py-40 px-8 md:px-20 max-w-360 mx-auto">
        <FadeIn className="mb-20">
          <Label>The Rules</Label>
        </FadeIn>
        <div className="flex flex-col">
          {[
            {
              num: "01",
              title: "Show Up As You Are.",
              body: "No filters. No performance. No apology. The Circle does not reward who you pretend to be. It recognises who you already are. Walk in whole.",
            },
            {
              num: "02",
              title: "Never Apologise For It.",
              body: "Not for your presence. Not for your ambition. Not for taking up space. You earned the right the moment you stopped shrinking and started arriving.",
            },
          ].map((rule, i) => (
            <FadeIn key={rule.num} delay={i * 0.1}>
              <div className="border-t border-zinc-100 py-16 grid grid-cols-1 md:grid-cols-[6rem_1fr] gap-6 md:gap-16 items-start">
                <span className="text-[0.65rem] font-semibold tracking-[0.4em] uppercase text-zinc-300 mt-1">
                  {rule.num}
                </span>
                <div className="flex flex-col gap-5">
                  <h3 className="text-zinc-900">{rule.title}</h3>
                  <p className="text-zinc-500 leading-relaxed max-w-lg">
                    {rule.body}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
          <div className="border-t border-zinc-100" />
        </div>
      </section>

      {/* 06  WHO BELONGS - zinc-50 */}
      <section className="bg-zinc-50 py-40 px-8 md:px-20">
        <div className="max-w-360 mx-auto">
          <FadeIn className="mb-20 flex flex-col gap-6">
            <Label>You Belong Here If</Label>
            <h2 className="text-zinc-900 max-w-2xl leading-tight">
              You Have Ever Been Told You Are Too Much.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {[
              "You have been called intimidating when you were just confident.",
              "You dress for yourself, not the room.",
              "You moved through spaces that were not built for you. And took up space anyway.",
              "You stopped waiting for permission and started moving.",
              "You have been the loudest person in the room without saying a word.",
              "You understand that what you wear is not vanity. It is a declaration.",
            ].map((line, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="border-t border-zinc-200 py-9 flex items-start gap-6">
                  <span className="text-zinc-300 text-[0.65rem] font-mono mt-0.5 shrink-0 tracking-wider">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-zinc-600 leading-relaxed">{line}</p>
                </div>
              </FadeIn>
            ))}
            <div className="border-t border-zinc-200 md:col-span-2" />
          </div>
        </div>
      </section>

      {/* 07  SECOND PARALLAX - dark, full-bleed */}
      <ParallaxImage
        src="/home/beanieRed.jpg"
        speed={0.15}
        className="h-[50vh]"
        overlay={
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent" />
        }
      />

      {/* 08  THE ENTRY (JOIN FORM) - light */}
      <section className="py-48 px-8 md:px-20">
        <div className="max-w-360 mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-32 items-start">
          <FadeIn className="flex flex-col gap-8">
            <Label>Step Inside</Label>
            <h2 className="text-zinc-900 leading-tight">
              The Door Is Open.
              <br />
              Walk Through It.
            </h2>
            <p className="text-zinc-600 leading-relaxed max-w-sm">
              Drop your details. No spam. No noise. Only what matters. When we
              move, you will be the first to know. When we drop, you will have
              first access. When we speak, it will be worth reading.
            </p>
            <p className="text-zinc-400 text-[0.6rem] tracking-[0.4em] uppercase">
              No spam. No selling your data. Just signal.
            </p>
          </FadeIn>

          <FadeIn delay={0.2} className="flex flex-col gap-8 md:pt-20">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-4 py-6"
              >
                <p className="text-[0.65rem] font-semibold tracking-[0.45em] uppercase text-zinc-900">
                  You are in.
                </p>
                <p className="text-zinc-500 leading-relaxed">
                  Welcome to the Inner Circle. Watch your inbox.
                </p>
              </motion.div>
            ) : (
              <>
                <p className="text-zinc-500 text-sm leading-relaxed border-l-2 border-zinc-200 pl-5">
                  Members get early access to every drop, invitations to private
                  events, and a seat at the table when the decisions are made.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <input
                    type="text"
                    required
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="FIRST NAME"
                    className="bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 px-6 py-4 text-[0.7rem] tracking-widest uppercase outline-none focus:border-zinc-400 transition-colors duration-300"
                  />
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="YOUR EMAIL"
                      className="flex-1 bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 px-6 py-4 text-[0.7rem] tracking-widest uppercase outline-none focus:border-zinc-400 transition-colors duration-300"
                    />
                    <button
                      type="submit"
                      className="border border-black bg-black text-white px-8 py-4 text-[0.7rem] font-semibold tracking-widest uppercase hover:bg-white hover:text-black transition-colors shrink-0"
                    >
                      Join
                    </button>
                  </div>
                </form>
              </>
            )}
          </FadeIn>
        </div>
      </section>

      {/* 09  CLOSING - light */}
      <section className="border-t border-zinc-100 py-56 px-8 text-center">
        <FadeIn className="max-w-3xl mx-auto flex flex-col items-center gap-10">
          <Label>The Circle Is Open</Label>
          <h2 className="text-zinc-900 leading-tight">
            Not Everyone Is Ready.
            <br />
            But You Are.
          </h2>
          <p className="text-zinc-500 max-w-md text-lg font-light leading-relaxed">
            The collection was built for people who already know. Come in.
          </p>
          <Link href="/collections" className={buttonVariants()}>
            Enter the Collection
          </Link>
        </FadeIn>
      </section>
    </main>
  );
}
