"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";
import { useCartStore } from "@/lib/stores/cart-store";
import { formatPrice } from "@/lib/currency";
import FadeImage from "@/components/ui/fade-image";

const DURATION = 3500;
const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;

export default function CartToast() {
  const toast = useCartStore((s) => s.toast);
  const dismissToast = useCartStore((s) => s.dismissToast);
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [lastKey, setLastKey] = useState<number | undefined>(undefined);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reveal the toast as soon as a new item lands, computed during render
  // rather than in an effect so React doesn't need an extra render pass.
  if (toast && toast.key !== lastKey) {
    setLastKey(toast.key);
    setVisible(true);
  }

  const toastKey = toast?.key;
  useEffect(() => {
    if (toastKey === undefined) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setVisible(false);
    }, DURATION);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toastKey]); // re-fire only when a new item is added

  const handleDismiss = () => {
    setVisible(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <AnimatePresence onExitComplete={dismissToast}>
      {visible && toast && (
        <motion.div
          key={toast.key}
          initial={
            prefersReducedMotion ? { opacity: 0 } : { x: "110%", opacity: 0 }
          }
          animate={
            prefersReducedMotion ? { opacity: 1 } : { x: 0, opacity: 1 }
          }
          exit={
            prefersReducedMotion ? { opacity: 0 } : { x: "110%", opacity: 0 }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0.15 }
              : { duration: 0.28, ease: EASE_DRAWER }
          }
          className="fixed right-4 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-[200] w-[min(18rem,calc(100vw-2rem))] overflow-hidden bg-zinc-900 shadow-2xl max-lg:bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] lg:right-6"
        >
          {/* Main row */}
          <div className="flex gap-3 p-4 pr-8">
            {/* Thumbnail */}
            <div className="relative w-14 h-[72px] shrink-0 overflow-hidden bg-zinc-800">
              <FadeImage
                src={toast.item.img}
                alt={toast.item.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-[0.52rem] tracking-[0.32em] uppercase text-zinc-400 mb-1">
                Added to Cart
              </p>
              <p className="text-sm font-medium text-white leading-snug truncate">
                {toast.item.name}
              </p>
              <p className="text-zinc-400 text-xs mt-0.5">
                {toast.quantity > 1
                  ? `Qty ${toast.quantity} · ${formatPrice(toast.item.price * toast.quantity)}`
                  : formatPrice(toast.item.price)}
              </p>
              <Link
                href="/cart"
                onClick={handleDismiss}
                className="inline-flex items-center gap-1 mt-2.5 text-[0.52rem] tracking-[0.28em] uppercase text-white/60 hover:text-white transition-colors duration-200"
              >
                View Cart →
              </Link>
            </div>
          </div>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss"
            className="absolute top-3 right-3 text-zinc-600 transition-colors duration-150 hover:text-white active:scale-95"
          >
            <X size={13} />
          </button>

          {/* Progress bar */}
          {!prefersReducedMotion && (
            <motion.div
              className="h-[2px] origin-left bg-white/30"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: DURATION / 1000, ease: "linear" }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
