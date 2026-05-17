"use client";

import { usePathname } from "next/navigation";
import Header from "./header";
import Footer from "./footer";
import CartToast from "@/components/ui/cart-toast";
import { useBannerStore } from "@/lib/stores/banner-store";

// Pages where the first section intentionally sits behind the fixed header
// (full-bleed video/image heroes with dark overlays).
const FULL_BLEED_PATHS = ["/", "/the-creed", "/inner-circle"];

export default function ConditionalNav({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { visible: bannerVisible, bannerHeight } = useBannerStore();
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
      {!noNav && <Header />}
      {/* Banner spacer — matches the actual measured banner height */}
      {bannerVisible && needsHeaderOffset && (
        <div
          style={{ height: bannerHeight }}
          className="shrink-0"
          aria-hidden="true"
        />
      )}
      {/* Spacer for fixed header height (56px) + collections subnav (44px) when present */}
      {needsHeaderOffset && (
        <div
          style={{ height: isCollectionsPath ? 100 : 56 }}
          className="shrink-0 transition-[height] duration-300 ease-in-out"
          aria-hidden="true"
        />
      )}
      {children}
      {!noNav && <Footer />}
      <CartToast />
    </>
  );
}
