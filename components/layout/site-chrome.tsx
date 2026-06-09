"use client";

import { useEffect, useRef } from "react";
import AnnouncementBanner from "@/components/layout/announcement-banner";
import Header from "@/components/layout/header";
import {
  BANNER_H,
  BANNER_SCROLL_DELTA,
  bannerSlotTransition,
  useBannerStore,
} from "@/lib/stores/banner-store";

export default function SiteChrome() {
  const { visible, scrollHidden, setScrollHidden } = useBannerStore();
  const lastScrollY = useRef(0);
  const scrollHiddenRef = useRef(false);

  // Scroll-direction latch — hide on downward tick, reveal on upward tick
  useEffect(() => {
    if (!visible) {
      scrollHiddenRef.current = false;
      setScrollHidden(false);
      return;
    }

    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;

      if (delta > BANNER_SCROLL_DELTA && !scrollHiddenRef.current) {
        scrollHiddenRef.current = true;
        setScrollHidden(true);
      } else if (delta < -BANNER_SCROLL_DELTA && scrollHiddenRef.current) {
        scrollHiddenRef.current = false;
        setScrollHidden(false);
      }

      lastScrollY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [visible, setScrollHidden]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 overflow-hidden">
      {visible && (
        <div
          className="overflow-hidden shrink-0"
          style={{
            height: scrollHidden ? 0 : BANNER_H,
            opacity: scrollHidden ? 0 : 1,
            pointerEvents: scrollHidden ? "none" : "auto",
            transition: bannerSlotTransition(scrollHidden),
          }}
        >
          <AnnouncementBanner />
        </div>
      )}
      <Header />
    </div>
  );
}
