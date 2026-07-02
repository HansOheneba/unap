"use client";

import { usePathname } from "next/navigation";
import Footer from "./footer";
import CartToast from "@/components/ui/cart-toast";
import {
  bannerSlotTransition,
  getBannerOffset,
  useBannerStore,
} from "@/lib/stores/banner-store";

// Pages where the first section intentionally sits behind the fixed header
// (full-bleed video/image heroes with dark overlays).
const FULL_BLEED_PATHS = ["/", "/the-creed", "/inner-circle", "/movement", "/future"];

export default function ConditionalNav({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { visible: bannerVisible, scrollHidden } = useBannerStore();
  const bannerOffset = getBannerOffset(bannerVisible, scrollHidden);
  // Account pages should still show the global header/footer so users can
  // navigate around the site while signed in.
  const noNav = false;

  // Collection landing pages (e.g. /collections/boxers) have full-bleed heroes — no spacer.
  // Product detail pages (/collections/boxers/product-1) do need the offset.
  const isCollectionLanding = /^\/collections\/[^/]+$/.test(pathname ?? "");
  // Any /collections/** page gets the subnav inside the header (+44px)
  const isCollectionsPath = !!pathname?.startsWith("/collections");

  const needsHeaderOffset =
    !noNav &&
    !FULL_BLEED_PATHS.includes(pathname ?? "") &&
    !isCollectionLanding;

  return (
    <>
      {/* Banner spacer — matches the visible banner slot in SiteChrome */}
      {bannerVisible && needsHeaderOffset && (
        <div
          style={{
            height: bannerOffset,
            transition: bannerSlotTransition(scrollHidden),
          }}
          className="shrink-0"
          aria-hidden="true"
        />
      )}
      {/* Spacer for fixed header height (56px) + collections subnav (44px) when present */}
      {needsHeaderOffset && (
        <div
          style={{ height: isCollectionsPath ? 100 : 56 }}
          className="shrink-0"
          aria-hidden="true"
        />
      )}
      {children}
      {!noNav && <Footer />}
      <CartToast />
    </>
  );
}
