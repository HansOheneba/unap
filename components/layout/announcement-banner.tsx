"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useBannerStore } from "@/lib/stores/banner-store";

const MESSAGES = [
  { text: "Free shipping over \u20B5500", href: "/collections" },
  { text: "Bold Society. Shop now.", href: "/collections" },
  { text: "Inner Circle. Apply within.", href: "/inner-circle" },
];

const BANNER_H = 32; // px — fixed slim height

export default function AnnouncementBanner() {
  const { visible, dismiss, setBannerHeight } = useBannerStore();
  const [msgIdx, setMsgIdx] = useState(0);
  const [scrollHidden, setScrollHidden] = useState(false);
  const lastScrollY = useRef(0);
  const scrollHiddenRef = useRef(false);

  // Push height into store on mount; reset on dismiss
  useEffect(() => {
    if (visible) setBannerHeight(BANNER_H);
    else setBannerHeight(0);
  }, [visible, setBannerHeight]);

  // Scroll-direction detection — hide on down, reveal on up
  useEffect(() => {
    if (!visible) return;
    const onScroll = () => {
      // Scroll-hide only on mobile (< 768px); desktop banner always stays visible
      if (window.innerWidth >= 768) return;
      const y = window.scrollY;
      if (y > lastScrollY.current && y > 20 && !scrollHiddenRef.current) {
        scrollHiddenRef.current = true;
        setScrollHidden(true);
        setBannerHeight(0);
      } else if (y < lastScrollY.current && scrollHiddenRef.current) {
        scrollHiddenRef.current = false;
        setScrollHidden(false);
        setBannerHeight(BANNER_H);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [visible, setBannerHeight]);

  // Message rotation
  useEffect(() => {
    if (!visible) return;
    const t = setInterval(
      () => setMsgIdx((i) => (i + 1) % MESSAGES.length),
      10000,
    );
    return () => clearInterval(t);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          animate={{ y: scrollHidden ? "-100%" : "0%" }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          style={{ height: BANNER_H }}
          className="fixed top-0 left-0 right-0 z-[70] bg-zinc-900 text-white overflow-hidden"
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
