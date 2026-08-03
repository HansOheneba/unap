"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import AnnouncementBanner from "@/components/layout/announcement-banner";
import Header from "@/components/layout/header";
import type { AnnouncementBannerData } from "@/lib/api/announcements";
import type { CollectionNavItem } from "@/lib/collections-nav";
import {
  BANNER_H,
  BANNER_HIDE_MS,
  BANNER_REVEAL_MS,
  BANNER_SCROLL_DELTA,
  COLLECTIONS_SUBNAV_H,
  HEADER_H,
  useBannerStore,
} from "@/lib/stores/banner-store";

/** Extra pad so layout/sticky settle before scroll can toggle again (Safari). */
const SCROLL_LOCK_PAD_MS = 120;

type SiteChromeProps = {
  banner: AnnouncementBannerData;
  collectionNav: CollectionNavItem[];
};

/** Touch / coarse pointers: iPhone Safari's URL-bar resize + rubber-band
 *  scroll makes scroll-driven chrome hide unreliable. Keep the banner pinned. */
function canScrollHideBanner(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export default function SiteChrome({ banner, collectionNav }: SiteChromeProps) {
  const pathname = usePathname();
  const { visible, scrollHidden, setScrollHidden } = useBannerStore();
  const lastScrollY = useRef(0);
  const scrollHiddenRef = useRef(false);
  const lockUntilRef = useRef(0);
  const bannerActive =
    banner.isEnabled && banner.messages.length > 0 && visible;
  const headerHeight =
    HEADER_H +
    (pathname?.startsWith("/collections") ? COLLECTIONS_SUBNAV_H : 0);

  // Scroll-direction latch — hide on downward tick, reveal on upward tick.
  // Desktop only. Layout (spacers / sticky top) never follows scrollHidden;
  // only transform moves, which is what keeps Safari from looping.
  useEffect(() => {
    if (!bannerActive || !canScrollHideBanner()) {
      scrollHiddenRef.current = false;
      lockUntilRef.current = 0;
      setScrollHidden(false);
      return;
    }

    lastScrollY.current = window.scrollY;
    scrollHiddenRef.current = useBannerStore.getState().scrollHidden;

    const onScroll = () => {
      const y = window.scrollY;
      const now = performance.now();

      if (now < lockUntilRef.current) {
        lastScrollY.current = y;
        return;
      }

      const delta = y - lastScrollY.current;

      if (delta > BANNER_SCROLL_DELTA && !scrollHiddenRef.current && y > BANNER_H) {
        scrollHiddenRef.current = true;
        lockUntilRef.current = now + BANNER_HIDE_MS + SCROLL_LOCK_PAD_MS;
        setScrollHidden(true);
      } else if (delta < -BANNER_SCROLL_DELTA && scrollHiddenRef.current) {
        scrollHiddenRef.current = false;
        lockUntilRef.current = now + BANNER_REVEAL_MS + SCROLL_LOCK_PAD_MS;
        setScrollHidden(false);
      }

      lastScrollY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [bannerActive, setScrollHidden]);

  const slideMs = scrollHidden ? BANNER_HIDE_MS : BANNER_REVEAL_MS;
  // Clip the fixed layer when the banner is slid away — safe because fixed
  // chrome is out of document flow (unlike in-flow spacers).
  const chromeHeight = headerHeight + (bannerActive ? BANNER_H : 0);
  const visibleChromeHeight =
    bannerActive && scrollHidden ? headerHeight : chromeHeight;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 overflow-hidden"
      style={{
        height: visibleChromeHeight,
        transition: `height ${slideMs}ms ease-out`,
      }}
    >
      {/*
        Slide the whole chrome with transform. Never animate in-flow spacer
        height during scroll — that is Safari's scroll↔layout crash loop.
      */}
      <div
        style={{
          transform:
            bannerActive && scrollHidden
              ? `translateY(-${BANNER_H}px)`
              : "translateY(0)",
          transition: `transform ${slideMs}ms ease-out`,
        }}
      >
        {bannerActive && (
          <div className="overflow-hidden shrink-0" style={{ height: BANNER_H }}>
            <AnnouncementBanner data={banner} />
          </div>
        )}
        <Header collectionNav={collectionNav} />
      </div>
    </div>
  );
}
