"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useBannerStore } from "@/lib/stores/banner-store";

const COLLECTIONS = [
  { label: "All", href: "/collections" },
  { label: "Boxers", href: "/collections/boxers" },
  { label: "Head Wears", href: "/collections/headwear" },
  { label: "Hoodies", href: "/collections/hoodies" },
  { label: "Lingerie", href: "/collections/lingerie" },
  { label: "Sunglasses", href: "/collections/sunglasses" },
  { label: "Tops", href: "/collections/tops" },
  { label: "Tracks", href: "/collections/tracks" },
];

export default function CollectionsSubnav() {
  const pathname = usePathname();
  const { visible: bannerVisible, bannerHeight } = useBannerStore();

  // Show on /collections overview and product detail pages.
  // NOT on collection landing pages (/collections/boxers etc.) — they have full-bleed heroes.
  const isCollectionLanding = /^\/collections\/[^/]+$/.test(pathname ?? "");
  const showSubnav =
    !!pathname?.startsWith("/collections") && !isCollectionLanding;

  if (!showSubnav) return null;

  const activeHref =
    COLLECTIONS.find((c) => {
      if (c.href === "/collections") return pathname === "/collections";
      return pathname?.startsWith(c.href);
    })?.href ?? "/collections";

  // Stick just below the fixed header. top = bannerHeight (0 if dismissed) + h-14 (56px)
  const stickyTopPx = (bannerVisible ? bannerHeight : 0) + 56;

  return (
    <div
      className="sticky z-30 bg-white border-b border-zinc-100 shadow-[0_1px_0_0_#f4f4f5]"
      style={{ top: stickyTopPx }}
    >
      <div className="max-w-360 mx-auto">
        <div className="flex items-center overflow-x-auto px-4 md:px-8 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          {COLLECTIONS.map((col) => {
            const isActive = col.href === activeHref;
            return (
              <Link
                key={col.href}
                href={col.href}
                className={cn(
                  "shrink-0 px-4 py-3.5 text-[0.58rem] tracking-[0.18em] uppercase whitespace-nowrap transition-all duration-200 border-b-2",
                  isActive
                    ? "text-zinc-900 border-zinc-900 font-semibold"
                    : "text-zinc-500 border-transparent hover:text-zinc-800 hover:border-zinc-300",
                )}
              >
                {col.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
