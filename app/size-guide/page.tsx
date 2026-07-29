"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
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

type Row = { size: string; primary: string; secondary: string };

const topsChart: Row[] = [
  { size: "S", primary: "34 - 36", secondary: "86 - 91" },
  { size: "M", primary: "38 - 40", secondary: "96 - 101" },
  { size: "L", primary: "42 - 44", secondary: "106 - 111" },
  { size: "XL", primary: "46 - 48", secondary: "116 - 121" },
  { size: "XXL", primary: "50 - 52", secondary: "127 - 132" },
  { size: "XXXL", primary: "54 - 56", secondary: "137 - 142" },
];

const bottomsChart: Row[] = [
  { size: "S", primary: "28 - 30", secondary: "71 - 76" },
  { size: "M", primary: "31 - 33", secondary: "79 - 84" },
  { size: "L", primary: "34 - 36", secondary: "86 - 91" },
  { size: "XL", primary: "37 - 39", secondary: "94 - 99" },
  { size: "XXL", primary: "40 - 42", secondary: "102 - 107" },
  { size: "XXXL", primary: "43 - 45", secondary: "109 - 114" },
];

const underwearChart: Row[] = [
  { size: "S", primary: "29 - 32", secondary: "74 - 80" },
  { size: "M", primary: "32 - 34", secondary: "80 - 86" },
  { size: "L", primary: "34 - 37", secondary: "86 - 94" },
  { size: "XL", primary: "37 - 39", secondary: "94 - 100" },
  { size: "XXL", primary: "39 - 42", secondary: "100 - 106" },
  { size: "XXXL", primary: "42 - 45", secondary: "106 - 114" },
];

function SizeTable({
  eyebrow,
  primaryLabel,
  rows,
}: {
  eyebrow: string;
  primaryLabel: string;
  rows: Row[];
}) {
  return (
    <FadeIn className="flex flex-col gap-6">
      <p className="eyebrow text-zinc-400">{eyebrow}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[420px]">
          <thead>
            <tr className="border-b-2 border-zinc-900">
              <th className="text-left pb-3 eyebrow text-zinc-900">Size</th>
              <th className="text-center pb-3 eyebrow text-zinc-900">
                {primaryLabel} (in)
              </th>
              <th className="text-center pb-3 eyebrow text-zinc-900">
                {primaryLabel} (cm)
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.size} className={i % 2 === 0 ? "bg-zinc-50" : "bg-white"}>
                <td className="py-3.5 pl-3 font-bold text-zinc-900 eyebrow">{row.size}</td>
                <td className="py-3.5 text-center text-zinc-600">{row.primary}</td>
                <td className="py-3.5 text-center text-zinc-600">{row.secondary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </FadeIn>
  );
}

const measureSteps = [
  {
    num: "01",
    title: "Chest",
    body: "Wrap the tape under your arms, across the fullest part of your chest, keeping it level across your back.",
  },
  {
    num: "02",
    title: "Waist",
    body: "Measure around your natural waistline, the narrowest point of your torso, without pulling the tape tight.",
  },
  {
    num: "03",
    title: "Hip",
    body: "Stand with feet together and measure around the fullest part of your hips, roughly 20cm below your waist.",
  },
];

export default function SizeGuidePage() {
  return (
    <main className="bg-white text-zinc-900">
      {/* ── HEADER ── */}
      <section className="pt-24 pb-16 px-8 md:px-20 max-w-360 mx-auto">
        <FadeIn className="flex flex-col gap-6 max-w-2xl">
          <p className="eyebrow">Fit Guide</p>
          <h1 className="leading-none">
            Precision Is Part
            <br />
            of the Uniform.
          </h1>
          <p className="text-zinc-600 text-lg leading-relaxed">
            Confidence fits better when the clothes do too. Every measurement
            below is body measurement, not garment measurement. Between
            sizes? Size up for a relaxed fit, size down for something more
            fitted.
          </p>
        </FadeIn>
      </section>

      {/* ── CHARTS ── */}
      <section className="px-8 md:px-20 pb-24 max-w-360 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-10">
          <SizeTable eyebrow="Tops" primaryLabel="Chest" rows={topsChart} />
          <SizeTable eyebrow="Bottoms" primaryLabel="Waist" rows={bottomsChart} />
          <SizeTable eyebrow="Boxers" primaryLabel="Waist" rows={underwearChart} />
        </div>
        <FadeIn delay={0.1} className="mt-10 pt-8 border-t border-zinc-100">
          <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl">
            Tracksuits and active wear follow the Tops chart for the jacket or
            top piece, and the Bottoms chart for the pant or short. Headwear
            and sunglasses are one size and built to fit most.
          </p>
        </FadeIn>
      </section>

      {/* ── HOW TO MEASURE ── */}
      <section className="bg-zinc-50 py-24 px-8 md:px-20">
        <div className="max-w-360 mx-auto">
          <FadeIn className="mb-16 flex flex-col gap-4">
            <p className="eyebrow">How to Measure</p>
            <h2 className="max-w-xl leading-tight">
              Two Minutes With a Tape Measure.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {measureSteps.map((step) => (
              <FadeIn key={step.num} className="flex flex-col gap-4">
                <span className="eyebrow text-zinc-300">{step.num}</span>
                <h4 className="text-zinc-900">{step.title}</h4>
                <p className="text-zinc-500 leading-relaxed">{step.body}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 px-8 flex flex-col items-center text-center gap-6">
        <FadeIn className="flex flex-col items-center gap-6 max-w-md">
          <p className="eyebrow text-zinc-400">Still Not Sure</p>
          <h3 className="text-zinc-900">We&apos;ll Help You Find Your Fit.</h3>
          <p className="text-zinc-500">
            Send us your measurements and we will point you to the right
            size before you check out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link href="/contact" className={buttonVariants()}>
              Contact Us
            </Link>
            <Link href="/collections" className={buttonVariants({ variant: "outline" })}>
              Shop Collections
            </Link>
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
