"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useCartStore } from "@/lib/stores/cart-store";
import { formatPrice } from "@/lib/currency";

const DURATION = 3500;

export default function CartToast() {
  const toast = useCartStore((s) => s.toast);
  const dismissToast = useCartStore((s) => s.dismissToast);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!toast) return;
    setVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setVisible(false);
    }, DURATION);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast?.key]); // re-fire only when a new item is added

  const handleDismiss = () => {
    setVisible(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <AnimatePresence onExitComplete={dismissToast}>
      {visible && toast && (
        <motion.div
          key={toast.key}
          initial={{ x: "110%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "110%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 32 }}
          className="fixed bottom-6 right-6 z-[200] w-72 bg-zinc-900 shadow-2xl overflow-hidden"
        >
          {/* Main row */}
          <div className="flex gap-3 p-4 pr-8">
            {/* Thumbnail */}
            <div className="relative w-14 h-[72px] shrink-0 overflow-hidden bg-zinc-800">
              <Image
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
                {formatPrice(toast.item.price)}
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
            onClick={handleDismiss}
            aria-label="Dismiss"
            className="absolute top-3 right-3 text-zinc-600 hover:text-white transition-colors duration-200"
          >
            <X size={13} />
          </button>

          {/* Progress bar */}
          <motion.div
            className="h-[2px] bg-white/30 origin-left"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: DURATION / 1000, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
