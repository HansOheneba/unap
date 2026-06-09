"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { BANNER_H, useBannerStore } from "@/lib/stores/banner-store";

const MESSAGES = [
  { text: "Free shipping over \u20B5500", href: "/collections" },
  { text: "Bold Society. Shop now.", href: "/collections" },
  { text: "Inner Circle. Apply within.", href: "/inner-circle" },
];

export default function AnnouncementBanner() {
  const { dismiss } = useBannerStore();
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setMsgIdx((i) => (i + 1) % MESSAGES.length),
      10000,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div
      style={{ height: BANNER_H }}
      className="shrink-0 bg-zinc-900 text-white overflow-hidden"
    >
      <div className="relative flex items-center justify-center h-full px-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={msgIdx}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className="text-[0.58rem] tracking-[0.2em] uppercase whitespace-nowrap"
          >
            {MESSAGES[msgIdx].href ? (
              <Link
                href={MESSAGES[msgIdx].href}
                className="underline underline-offset-2 decoration-white/50"
              >
                {MESSAGES[msgIdx].text}
              </Link>
            ) : (
              <span>{MESSAGES[msgIdx].text}</span>
            )}
          </motion.div>
        </AnimatePresence>
        <button
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
        >
          <svg
            width="8"
            height="8"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <line x1="1" y1="1" x2="9" y2="9" />
            <line x1="9" y1="1" x2="1" y2="9" />
          </svg>
        </button>
      </div>
    </div>
  );
}
