"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { AnnouncementBannerData } from "@/lib/api/announcements";
import { BANNER_H, useBannerStore } from "@/lib/stores/banner-store";

type AnnouncementBannerProps = {
  data: AnnouncementBannerData;
};

export default function AnnouncementBanner({ data }: AnnouncementBannerProps) {
  const { dismiss } = useBannerStore();
  const [msgIdx, setMsgIdx] = useState(0);
  const { messages, rotationIntervalMs, backgroundColor, textColor } = data;

  useEffect(() => {
    if (messages.length <= 1) return;
    const t = setInterval(
      () => setMsgIdx((i) => (i + 1) % messages.length),
      rotationIntervalMs,
    );
    return () => clearInterval(t);
  }, [messages.length, rotationIntervalMs]);

  if (messages.length === 0) return null;

  const current = messages[msgIdx] ?? messages[0];

  return (
    <div
      style={{ height: BANNER_H, backgroundColor, color: textColor }}
      className="shrink-0 overflow-hidden"
    >
      <div className="relative flex items-center justify-center h-full px-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className="text-[0.58rem] tracking-[0.2em] uppercase whitespace-nowrap"
          >
            {current.href ? (
              <Link
                href={current.href}
                className="underline underline-offset-2"
                style={{ textDecorationColor: `${textColor}80` }}
              >
                {current.text}
              </Link>
            ) : (
              <span>{current.text}</span>
            )}
          </motion.div>
        </AnimatePresence>
        <button
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
          style={{ color: textColor }}
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
