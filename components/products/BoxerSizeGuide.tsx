"use client";

import Image from "next/image";
import { Ruler } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sizeChart = [
  { size: "S", inches: "29 - 32", cm: "74 - 80" },
  { size: "M", inches: "32 - 34", cm: "80 - 86" },
  { size: "L", inches: "34 - 37", cm: "86 - 94" },
  { size: "XL", inches: "37 - 39", cm: "94 - 100" },
  { size: "XXL", inches: "39 - 42", cm: "100 - 106" },
  { size: "XXXL", inches: "42 - 45", cm: "106 - 114" },
];

const variantImages = [
  "/collections/boxers/boxersGray.jpg",
  "/collections/boxers/boxersBlue.jpg",
  "/collections/boxers/boxersBrown.jpeg",
  "/collections/boxers/boxersCream.jpeg",
];

type Props = {
  /** "button" — outlined button with ruler icon (collection page)
   *  "link"   — small text link (product detail page, next to Size label) */
  variant?: "button" | "link";
};

export default function BoxerSizeGuide({ variant = "button" }: Props) {
  return (
    <Dialog>
      <DialogTrigger
        className={
          variant === "button"
            ? cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-2 shrink-0",
              )
            : "text-[0.62rem] tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors border-b border-zinc-200 pb-0.5 cursor-pointer"
        }
      >
        {variant === "button" && <Ruler size={13} className="shrink-0" />}
        Size Guide
      </DialogTrigger>

      <DialogContent
        className="max-w-lg w-full p-0 overflow-hidden rounded-none border-zinc-200"
        showCloseButton={false}
      >
        {/* ── Header ─────────────────────────────────────────────── */}
        <DialogHeader className="px-8 pt-8 pb-0">
          <p className="eyebrow text-zinc-400 mb-1">Intimates &amp; Boxers</p>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-bold tracking-tight normal-case text-zinc-900">
              Size Guide
            </DialogTitle>
            <DialogClose
              className="text-zinc-400 hover:text-zinc-900 transition-colors text-lg leading-none"
              aria-label="Close"
            >
              ✕
            </DialogClose>
          </div>
        </DialogHeader>

        {/* ── Table ──────────────────────────────────────────────── */}
        <div className="px-8 pt-6 pb-4">
          <table className="w-full text-sm">
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
              {sizeChart.map((row, i) => (
                <tr
                  key={row.size}
                  className={i % 2 === 0 ? "bg-zinc-50" : "bg-white"}
                >
                  <td className="py-3.5 pl-3 font-bold text-zinc-900 eyebrow">
                    {row.size}
                  </td>
                  <td className="py-3.5 text-center text-zinc-600">
                    {row.inches}
                  </td>
                  <td className="py-3.5 text-center text-zinc-600">{row.cm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── How to measure ─────────────────────────────────────── */}
        <div className="px-8 py-4 bg-zinc-50 border-t border-zinc-100">
          <p className="eyebrow text-zinc-500 mb-1">How to Measure</p>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Wrap a soft tape measure around the narrowest part of your natural
            waist, keeping it level and comfortably snug. Use the inches or cm
            column to find your size.
          </p>
        </div>

        {/* ── Colour strip ───────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-px bg-zinc-100">
          {variantImages.map((src, i) => (
            <div
              key={i}
              className="relative aspect-square overflow-hidden bg-white"
            >
              <Image
                src={src}
                alt={`Boxer colour ${i + 1}`}
                fill
                sizes="25vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
