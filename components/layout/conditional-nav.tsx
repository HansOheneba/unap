"use client";

import { usePathname } from "next/navigation";
import Header from "./header";
import Footer from "./footer";

// Pages where the first section intentionally sits behind the fixed header
// (full-bleed video/image heroes with dark overlays).
const FULL_BLEED_PATHS = ["/", "/the-creed", "/inner-circle"];

export default function ConditionalNav({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const noNav = pathname?.startsWith("/account");

  // Collection landing pages (e.g. /collections/boxers) have full-bleed heroes.
  // Product detail pages (/collections/boxers/boxers-1) do need the offset.
  const isCollectionLanding = /^\/collections\/[^/]+$/.test(pathname ?? "");

  const needsHeaderOffset =
    !noNav &&
    !FULL_BLEED_PATHS.includes(pathname ?? "") &&
    !isCollectionLanding;

  return (
    <>
      {!noNav && <Header />}
      {/* Spacer that pushes page content below the fixed header (84px = logo 44px + py-5×2) */}
      {needsHeaderOffset && (
        <div className="h-14 shrink-0" aria-hidden="true" />
      )}
      {children}
      {!noNav && <Footer />}
    </>
  );
}
