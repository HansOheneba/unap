"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  SIZE_GUIDE_LIST,
  SIZE_GUIDES,
  type SizeGuideKey,
} from "@/lib/size-guides";
import ProductSizeGuide from "@/components/products/ProductSizeGuide";

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

const BOXER_ROWS = [
  { size: "S", inches: "29 - 32", cm: "74 - 80" },
  { size: "M", inches: "32 - 34", cm: "80 - 86" },
  { size: "L", inches: "34 - 37", cm: "86 - 94" },
  { size: "XL", inches: "37 - 39", cm: "94 - 100" },
  { size: "XXL", inches: "39 - 42", cm: "100 - 106" },
  { size: "XXXL", inches: "42 - 45", cm: "106 - 114" },
];

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

function ProductGuidePreview({ guideKey }: { guideKey: SizeGuideKey }) {
  const guide = SIZE_GUIDES[guideKey];
  const [panelId, setPanelId] = useState(guide.panels[0]?.id ?? "");
  const panel =
    guide.panels.find((p) => p.id === panelId) ?? guide.panels[0] ?? null;

  if (guide.kind === "boxers-table") {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[320px]">
          <thead>
            <tr className="border-b-2 border-zinc-900">
              <th className="text-left pb-3 eyebrow text-zinc-900">Size</th>
              <th className="text-center pb-3 eyebrow text-zinc-900">
                Waist (in)
              </th>
              <th className="text-center pb-3 eyebrow text-zinc-900">
                Waist (cm)
              </th>
            </tr>
          </thead>
          <tbody>
            {BOXER_ROWS.map((row, i) => (
              <tr
                key={row.size}
                className={i % 2 === 0 ? "bg-zinc-50" : "bg-white"}
              >
                <td className="py-3.5 pl-3 font-bold text-zinc-900 eyebrow">
                  {row.size}
                </td>
                <td className="py-3.5 text-center text-zinc-600">{row.inches}</td>
                <td className="py-3.5 text-center text-zinc-600">{row.cm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!panel) return null;

  return (
    <div className="flex flex-col gap-4">
      {guide.panels.length > 1 && (
        <div
          role="tablist"
          aria-label={`${guide.eyebrow} sections`}
          className="flex p-1 bg-zinc-100 gap-1 max-w-xs"
        >
          {guide.panels.map((p) => {
            const selected = p.id === panel.id;
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setPanelId(p.id)}
                className={cn(
                  "flex-1 py-2.5 text-[0.65rem] tracking-[0.18em] uppercase transition-colors duration-150 ease-out active:scale-[0.98]",
                  selected
                    ? "bg-black text-white"
                    : "bg-transparent text-zinc-500 hover:text-zinc-900",
                )}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      )}
      <div
        className="relative w-full max-w-2xl overflow-hidden bg-zinc-50 ring-1 ring-zinc-100"
        style={{ aspectRatio: String(panel.aspectRatio) }}
      >
        <Image
          key={panel.id}
          src={panel.image}
          alt={panel.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 672px"
          className="object-contain object-top"
        />
      </div>
    </div>
  );
}

export default function SizeGuidePage() {
  const [activeKey, setActiveKey] = useState<SizeGuideKey>("boxers");
  const activeGuide = SIZE_GUIDES[activeKey];

  return (
    <main className="bg-white text-zinc-900">
      <section className="pt-24 pb-16 px-8 md:px-20 max-w-360 mx-auto">
        <FadeIn className="flex flex-col gap-6 max-w-2xl">
          <p className="eyebrow">Fit Guide</p>
          <h1 className="leading-none">
            Precision Is Part
            <br />
            of the Uniform.
          </h1>
          <p className="text-zinc-600 text-lg leading-relaxed">
            Each piece has its own chart. Pick a product below for the official
            measurements. Between sizes? Size up for a relaxed fit, size down
            for something more fitted.
          </p>
        </FadeIn>
      </section>

      <section className="px-8 md:px-20 pb-24 max-w-360 mx-auto">
        <FadeIn className="flex flex-col gap-8">
          <div
            role="tablist"
            aria-label="Product size guides"
            className="flex flex-wrap gap-2"
          >
            {SIZE_GUIDE_LIST.map((guide) => {
              const selected = guide.key === activeKey;
              return (
                <button
                  key={guide.key}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveKey(guide.key)}
                  className={cn(
                    "px-4 py-2.5 text-[0.65rem] tracking-[0.18em] uppercase border transition-colors duration-150 ease-out active:scale-[0.98]",
                    selected
                      ? "bg-black text-white border-black"
                      : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400 hover:text-zinc-900",
                  )}
                >
                  {guide.eyebrow}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-4 border border-zinc-100 p-5 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow text-zinc-400 mb-1">{activeGuide.eyebrow}</p>
                <h2 className="text-xl text-zinc-900 normal-case tracking-tight">
                  {activeGuide.title}
                </h2>
              </div>
              <ProductSizeGuide guideKey={activeKey} />
            </div>

            <ProductGuidePreview guideKey={activeKey} />

            <p className="text-sm text-zinc-500 leading-relaxed max-w-2xl pt-2 border-t border-zinc-100">
              {activeGuide.note}
            </p>
          </div>
        </FadeIn>
      </section>

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

      <section className="py-32 px-8 flex flex-col items-center text-center gap-6">
        <FadeIn className="flex flex-col items-center gap-6 max-w-md">
          <p className="eyebrow text-zinc-400">Still Not Sure</p>
          <h3 className="text-zinc-900">We&apos;ll Help You Find Your Fit.</h3>
          <p className="text-zinc-500">
            Send us your measurements and we will point you to the right size
            before you check out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link href="/contact" className={buttonVariants()}>
              Contact Us
            </Link>
            <Link
              href="/collections"
              className={buttonVariants({ variant: "outline" })}
            >
              Shop Collections
            </Link>
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
