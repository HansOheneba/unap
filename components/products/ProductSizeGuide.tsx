"use client";

import { useState } from "react";
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
import {
  getSizeGuide,
  resolveSizeGuide,
  type SizeGuideDefinition,
  type SizeGuideKey,
} from "@/lib/size-guides";

const BOXER_SIZE_CHART = [
  { size: "S", inches: "29 - 32", cm: "74 - 80" },
  { size: "M", inches: "32 - 34", cm: "80 - 86" },
  { size: "L", inches: "34 - 37", cm: "86 - 94" },
  { size: "XL", inches: "37 - 39", cm: "94 - 100" },
  { size: "XXL", inches: "39 - 42", cm: "100 - 106" },
  { size: "XXXL", inches: "42 - 45", cm: "106 - 114" },
];

const BOXER_VARIANT_IMAGES = [
  "/collections/boxers/boxersWhite.jpeg",
  "/collections/boxers/boxersGray.jpg",
  "/collections/boxers/boxersBrown.jpeg",
  "/collections/boxers/boxersBlackWhite.jpeg",
  "/collections/boxers/boxersBlue.jpg",
  "/collections/boxers/boxersCream.jpeg",
];

type Props = {
  /** "button" — outlined button (collection page)
   *  "link"   — text link (product detail, next to Size) */
  variant?: "button" | "link";
  /** Force a guide; otherwise resolved from name / slug / category. */
  guideKey?: SizeGuideKey;
  name?: string;
  slug?: string;
  category?: string;
};

function BoxersChartBody({ guide }: { guide: SizeGuideDefinition }) {
  return (
    <>
      <div className="px-6 sm:px-8 pt-6 pb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-zinc-900">
              <th className="text-left pb-3 eyebrow text-zinc-900">Size</th>
              <th className="text-center pb-3 eyebrow text-zinc-900">Inches</th>
              <th className="text-center pb-3 eyebrow text-zinc-900">Cm</th>
            </tr>
          </thead>
          <tbody>
            {BOXER_SIZE_CHART.map((row, i) => (
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

      <div className="px-6 sm:px-8 py-4 bg-zinc-50 border-t border-zinc-100">
        <p className="eyebrow text-zinc-500 mb-1">How to Measure</p>
        <p className="text-xs text-zinc-500 leading-relaxed">{guide.note}</p>
      </div>

      <div className="bg-zinc-200 px-8 py-5 flex items-center justify-center">
        <p className="font-serif text-white text-2xl md:text-3xl tracking-[0.2em] uppercase">
          Unapologetic
        </p>
      </div>

      <div className="grid grid-cols-6 gap-px bg-zinc-100">
        {BOXER_VARIANT_IMAGES.map((src, i) => (
          <div
            key={src}
            className="relative aspect-square overflow-hidden bg-zinc-50"
          >
            <Image
              src={src}
              alt={`Boxer colour ${i + 1}`}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </>
  );
}

function ImageGuideBody({ guide }: { guide: SizeGuideDefinition }) {
  const [activePanel, setActivePanel] = useState(guide.panels[0]?.id ?? "");
  const panel =
    guide.panels.find((p) => p.id === activePanel) ?? guide.panels[0];
  const multi = guide.panels.length > 1;

  if (!panel) return null;

  return (
    <>
      {multi && (
        <div className="px-6 sm:px-8 pt-5">
          <div
            role="tablist"
            aria-label="Size guide sections"
            className="flex p-1 bg-zinc-100 gap-1"
          >
            {guide.panels.map((p) => {
              const selected = p.id === panel.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActivePanel(p.id)}
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
        </div>
      )}

      <div className="px-4 sm:px-6 pt-5 pb-2">
        <div
          className="relative w-full overflow-hidden bg-zinc-50 ring-1 ring-zinc-100"
          style={{ aspectRatio: String(panel.aspectRatio) }}
        >
          <Image
            key={panel.id}
            src={panel.image}
            alt={panel.imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, 640px"
            className="object-contain object-top"
            priority
          />
        </div>
      </div>

      <div className="px-6 sm:px-8 py-4 border-t border-zinc-100">
        <p className="text-xs text-zinc-500 leading-relaxed">{guide.note}</p>
      </div>
    </>
  );
}

export default function ProductSizeGuide({
  variant = "button",
  guideKey,
  name,
  slug,
  category,
}: Props) {
  const resolvedKey = guideKey ?? resolveSizeGuide({ name, slug, category });
  const guide = getSizeGuide(resolvedKey);

  if (!guide) return null;

  const wide = guide.kind === "image";

  return (
    <Dialog>
      <DialogTrigger
        className={
          variant === "button"
            ? cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-2 shrink-0 active:scale-[0.98] transition-transform duration-150",
              )
            : "text-[0.62rem] tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors duration-150 border-b border-zinc-200 pb-0.5 cursor-pointer"
        }
      >
        {variant === "button" && <Ruler size={13} className="shrink-0" />}
        Size Guide
      </DialogTrigger>

      <DialogContent
        className={cn(
          "w-full p-0 overflow-hidden rounded-none border-zinc-200 max-h-[90vh] overflow-y-auto",
          wide ? "max-w-xl sm:max-w-2xl" : "max-w-lg sm:max-w-lg",
        )}
        showCloseButton={false}
      >
        <DialogHeader className="px-6 sm:px-8 pt-7 sm:pt-8 pb-0">
          <p className="eyebrow text-zinc-400 mb-1">{guide.eyebrow}</p>
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-lg font-bold tracking-tight normal-case text-zinc-900">
              {guide.title}
            </DialogTitle>
            <DialogClose
              className="text-zinc-400 hover:text-zinc-900 transition-colors duration-150 text-lg leading-none shrink-0 active:scale-95"
              aria-label="Close"
            >
              ✕
            </DialogClose>
          </div>
        </DialogHeader>

        {guide.kind === "boxers-table" ? (
          <BoxersChartBody guide={guide} />
        ) : (
          <ImageGuideBody guide={guide} />
        )}
      </DialogContent>
    </Dialog>
  );
}
