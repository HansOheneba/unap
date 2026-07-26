"use client";

import { useEffect, useRef } from "react";
import AnnouncementBanner from "@/components/layout/announcement-banner";
import Header from "@/components/layout/header";
import type { AnnouncementBannerData } from "@/lib/api/announcements";
import type { CollectionNavItem } from "@/lib/collections-nav";
import {
  BANNER_H,
  BANNER_SCROLL_DELTA,
  bannerSlotTransition,
  useBannerStore,
} from "@/lib/stores/banner-store";

type SiteChromeProps = {
  banner: AnnouncementBannerData;
  collectionNav: CollectionNavItem[];
};

export default function SiteChrome({ banner, collectionNav }: SiteChromeProps) {
  const { visible, scrollHidden, setScrollHidden } = useBannerStore();
  const lastScrollY = useRef(0);
  const scrollHiddenRef = useRef(false);
  const bannerActive =
    banner.isEnabled && banner.messages.length > 0 && visible;

  // Scroll-direction latch — hide on downward tick, reveal on upward tick
  useEffect(() => {
    if (!bannerActive) {
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
  }, [bannerActive, setScrollHidden]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 overflow-hidden">
      {bannerActive && (
        <div
          className="overflow-hidden shrink-0"
          style={{
            height: scrollHidden ? 0 : BANNER_H,
            opacity: scrollHidden ? 0 : 1,
            pointerEvents: scrollHidden ? "none" : "auto",
            transition: bannerSlotTransition(scrollHidden),
          }}
        >
          <AnnouncementBanner data={banner} />
        </div>
      )}
      <Header collectionNav={collectionNav} />
    </div>
  );
}
