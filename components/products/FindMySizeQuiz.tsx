"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Fit = "slim" | "regular" | "relaxed";

type Props = {
  open: boolean;
  onClose: () => void;
  category: string;
};

// Simple recommendation logic — Ghana-inspired sizing skewed slightly larger.
function recommend(height: number, weight: number, fit: Fit): string {
  // Score-based bucket: combine BMI-ish signal with fit preference
  let base: string;
  if (weight < 55) base = "XS";
  else if (weight < 65) base = "S";
  else if (weight < 78) base = "M";
  else if (weight < 92) base = "L";
  else if (weight < 105) base = "XL";
  else base = "XXL";

  // Tall + lighter people often need one size up in length
  if (height >= 185 && (base === "S" || base === "M")) {
    base = base === "S" ? "M" : "L";
  }

  // Fit adjustment
  const order = ["XS", "S", "M", "L", "XL", "XXL"];
  let idx = order.indexOf(base);
  if (fit === "relaxed" && idx < order.length - 1) idx += 1;
  if (fit === "slim" && idx > 0) idx -= 1;
  return order[idx];
}

export default function FindMySizeQuiz({ open, onClose, category }: Props) {
  const [step, setStep] = useState(1);
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);
  const [fit, setFit] = useState<Fit>("regular");
  const [result, setResult] = useState<string | null>(null);

  if (!open) return null;

  const reset = () => {
    setStep(1);
    setResult(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md bg-white border border-zinc-200 p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="mb-6">
          <p className="text-[10px] tracking-[0.25em] uppercase text-zinc-500 mb-1">
            Find My Size
          </p>
          <h3 className="text-lg tracking-[0.15em] uppercase text-zinc-900">
            {result ? "Your Recommendation" : `Step ${step} of 3`}
          </h3>
          <p className="text-xs text-zinc-500 mt-1 capitalize">
            For {category}
          </p>
        </div>

        {result ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-zinc-900 text-white mb-4">
              <Check size={24} />
            </div>
            <p className="text-sm text-zinc-600 mb-2">We recommend size</p>
            <p className="text-5xl tracking-widest text-zinc-900 mb-4">
              {result}
            </p>
            <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
              Based on your height ({height}cm), weight ({weight}kg) and {fit}{" "}
              fit preference. This is a guide. Actual fit may vary.
            </p>
            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 text-[10px] tracking-[0.25em] uppercase border border-zinc-300 text-zinc-700 px-5 py-3 hover:border-zinc-900 hover:text-zinc-900 transition-colors"
              >
                Retake
              </button>
              <button
                onClick={handleClose}
                className="flex-1 text-[10px] tracking-[0.25em] uppercase bg-zinc-900 text-white px-5 py-3 hover:bg-zinc-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            {step === 1 && (
              <div>
                <label className="block text-[10px] tracking-[0.25em] uppercase text-zinc-600 mb-3">
                  Your Height: {height} cm
                </label>
                <input
                  type="range"
                  min={150}
                  max={210}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full accent-zinc-900"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 mt-2">
                  <span>150cm</span>
                  <span>210cm</span>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <label className="block text-[10px] tracking-[0.25em] uppercase text-zinc-600 mb-3">
                  Your Weight: {weight} kg
                </label>
                <input
                  type="range"
                  min={40}
                  max={130}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full accent-zinc-900"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 mt-2">
                  <span>40kg</span>
                  <span>130kg</span>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <label className="block text-[10px] tracking-[0.25em] uppercase text-zinc-600 mb-3">
                  Preferred Fit
                </label>
                <div className="space-y-2">
                  {(["slim", "regular", "relaxed"] as Fit[]).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFit(f)}
                      className={cn(
                        "w-full text-left px-4 py-3 border text-sm capitalize transition-colors",
                        fit === f
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-200 text-zinc-700 hover:border-zinc-400",
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex-1 text-[10px] tracking-[0.25em] uppercase border border-zinc-300 text-zinc-700 px-5 py-3 hover:border-zinc-900 hover:text-zinc-900 transition-colors"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  className="flex-1 text-[10px] tracking-[0.25em] uppercase bg-zinc-900 text-white px-5 py-3 hover:bg-zinc-700 transition-colors"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={() => setResult(recommend(height, weight, fit))}
                  className="flex-1 text-[10px] tracking-[0.25em] uppercase bg-zinc-900 text-white px-5 py-3 hover:bg-zinc-700 transition-colors"
                >
                  See My Size
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
