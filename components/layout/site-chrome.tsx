"use client";

import { useEffect, useRef } from "react";
import AnnouncementBanner from "@/components/layout/announcement-banner";
import Header from "@/components/layout/header";
import type { AnnouncementBannerData } from "@/lib/api/announcements";
import type { CollectionNavItem } from "@/lib/collections-nav";
import {
  BANNER_H,
  BANNER_HIDE_MS,
  BANNER_REVEAL_MS,
  BANNER_SCROLL_DELTA,
  useBannerStore,
} from "@/lib/stores/banner-store";

/** Extra pad so layout/sticky settle before scroll can toggle again (Safari). */
const SCROLL_LOCK_PAD_MS = 80;

type SiteChromeProps = {
  banner: AnnouncementBannerData;
  collectionNav: CollectionNavItem[];
};

export default function SiteChrome({ banner, collectionNav }: SiteChromeProps) {
  const { visible, scrollHidden, setScrollHidden } = useBannerStore();
  const lastScrollY = useRef(0);
  const scrollHiddenRef = useRef(false);
  const lockUntilRef = useRef(0);
  const bannerActive =
    banner.isEnabled && banner.messages.length > 0 && visible;

  // Scroll-direction latch — hide on downward tick, reveal on upward tick.
  // A post-toggle lock is required: collapsing chrome/spacers/sticky `top`
  // adjusts scrollY in WebKit, which would otherwise re-fire this handler
  // and oscillate until Safari kills the tab.
  useEffect(() => {
    if (!bannerActive) {
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

  return (
    <div className="fixed top-0 left-0 right-0 z-50 overflow-hidden">
      {/*
        Slide the whole chrome with transform instead of animating banner
        height. Height changes on fixed + in-flow spacers during scroll are
        what kick off Safari's feedback loop; transform keeps chrome size
        stable while the banner visually leaves.
      */}
      <div
        style={{
          transform:
            bannerActive && scrollHidden
              ? `translateY(-${BANNER_H}px)`
              : "translateY(0)",
          marginBottom: bannerActive && scrollHidden ? -BANNER_H : 0,
          transition: `transform ${slideMs}ms ease-out, margin-bottom ${slideMs}ms ease-out`,
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
