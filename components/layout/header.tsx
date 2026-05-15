"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useCartStore } from "@/lib/stores/cart-store";
import { useBannerStore } from "@/lib/stores/banner-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { cn } from "@/lib/utils";

const collectionItems = [
  { label: "Tops", href: "/collections/tops" },
  { label: "Head Wears", href: "/collections/head-wears" },
  { label: "Pants", href: "/collections/pants" },
  { label: "Sunglasses", href: "/collections/sunglasses" },
];

const COLLECTIONS_NAV = [
  { label: "All", href: "/collections" },
  { label: "Boxers", href: "/collections/boxers" },
  { label: "Head Wears", href: "/collections/headwear" },
  { label: "Hoodies", href: "/collections/hoodies" },
  { label: "Lingerie", href: "/collections/lingerie" },
  { label: "Sunglasses", href: "/collections/sunglasses" },
  { label: "Tops", href: "/collections/tops" },
  { label: "Tracks", href: "/collections/tracks" },
];

type NavLink =
  | { label: string; href: string; dropdown?: never }
  | { label: string; href: string; dropdown: typeof collectionItems };

const navLinks: NavLink[] = [
  { label: "Collections", href: "/collections" },
  { label: "The Creed", href: "/the-creed" },
  { label: "Inner Circle", href: "/inner-circle" },
];

/* ── Mobile collections accordion ─────────────────────────── */
function MobileCollections({ onClose }: { onClose: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-zinc-100">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center justify-between w-full px-8 py-5 text-zinc-500 text-xs tracking-widest uppercase hover:text-zinc-900 transition-colors duration-200"
      >
        Collections
        <svg
          width="10"
          height="10"
          viewBox="0 0 8 8"
          fill="none"
          aria-hidden="true"
          className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
        >
          <path
            d="M1 2.5l3 3 3-3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          expanded ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col pb-3 pl-8">
          {collectionItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="py-3 pr-8 text-zinc-400 text-xs tracking-widest uppercase hover:text-zinc-900 transition-colors duration-200 border-t border-zinc-50"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const cartCount = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0),
  );
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { visible: bannerVisible, bannerHeight } = useBannerStore();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const navCls = "text-white";
  const iconCls = "text-white";
  // useSyncExternalStore: server snapshot = false, client snapshot = true
  // React uses the server snapshot during hydration, preventing mismatch
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const closeTimerRef = useRef<number | null>(null);

  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(mobileSearchQuery.trim())}`);
      setMobileSearchQuery("");
      setMobileSearchOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close mobile menu + search on route change */
  useEffect(() => {
    const id = setTimeout(() => {
      setMobileOpen(false);
      setMobileSearchOpen(false);
    }, 0);
    return () => clearTimeout(id);
  }, [pathname]);

  /* Auto-focus mobile search input when overlay opens */
  useEffect(() => {
    if (mobileSearchOpen) {
      const t = setTimeout(() => mobileSearchRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [mobileSearchOpen]);

  /* Body scroll lock */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* Desktop dropdown hover helpers */
  const openDD = (label: string) => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    setOpenDropdown(label);
  };
  const closeDD = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => setOpenDropdown(null), 140);
  };
  const closeDDNow = useCallback(() => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    setOpenDropdown(null);
  }, []);

  useEffect(() => {
    document.addEventListener("mouseleave", closeDDNow);
    return () => document.removeEventListener("mouseleave", closeDDNow);
  }, [closeDDNow]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    },
    [],
  );

  return (
    <>
      <header
        style={{ top: bannerVisible ? bannerHeight : 0 }}
        className={`fixed left-0 right-0 z-50 transition-[top] duration-300 ${
          isHome && !scrolled
            ? "bg-linear-to-b from-black/80 via-black/40 to-transparent"
            : "bg-black"
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-8 py-5">
          {/* ── Desktop Left: Nav links ── */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => openDD(link.label)}
                  onMouseLeave={closeDD}
                >
                  <button
                    className={`flex items-center gap-1 ${navCls} text-xs font-medium tracking-widest uppercase hover:opacity-60 transition-opacity duration-200`}
                  >
                    {link.label}
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="none"
                      aria-hidden="true"
                      className={`transition-transform duration-200 ${openDropdown === link.label ? "rotate-180" : ""}`}
                    >
                      <path
                        d="M1 2.5l3 3 3-3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <div
                    onMouseEnter={() => openDD(link.label)}
                    onMouseLeave={closeDD}
                    className={`absolute top-full left-0 mt-4 min-w-40 bg-white shadow-lg border border-zinc-100 backdrop-blur-md transition-all duration-200 ${
                      openDropdown === link.label
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-1 pointer-events-none"
                    }`}
                  >
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-5 py-3 text-zinc-700 text-xs tracking-widest uppercase hover:bg-zinc-50 transition-colors duration-150"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${navCls} text-xs font-medium tracking-widest uppercase hover:opacity-60 transition-opacity duration-200`}
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          {/* ── Mobile Left: Hamburger ── */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden flex flex-col justify-center gap-1.25 w-8 h-8 cursor-pointer"
            aria-label="Toggle menu"
          >
            <span
              className={`block h-px transition-all duration-300 ease-in-out origin-center bg-white ${
                mobileOpen ? "w-6 translate-y-1.5 rotate-45" : "w-6"
              }`}
            />
            <span
              className={`block h-px transition-all duration-300 ease-in-out bg-white ${
                mobileOpen ? "w-0 opacity-0" : "w-4 opacity-100"
              }`}
            />
            <span
              className={`block h-px transition-all duration-300 ease-in-out origin-center bg-white ${
                mobileOpen ? "w-6 -translate-y-1.5 -rotate-45" : "w-6"
              }`}
            />
          </button>

          {/* ── Center: Logo ── */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2"
            aria-label="Unapologetic home"
          >
            <Image
              src="/logos/unap_logo_white.png"
              alt="Unapologetic"
              width={44}
              height={44}
              className="object-contain"
              priority
            />
          </Link>

          {/* ── Right: icons ── */}
          <div className="flex items-center gap-4">
            {/* Search — desktop navigates to /search; mobile opens overlay */}
            <Link
              href="/search"
              aria-label="Search"
              className={`hidden md:inline-flex ${iconCls} hover:opacity-60 transition-opacity duration-200`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </Link>
            <button
              onClick={() => {
                setMobileSearchOpen((v) => !v);
                setMobileOpen(false);
              }}
              aria-label="Search"
              className={`md:hidden ${iconCls} hover:opacity-60 transition-opacity duration-200`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Track order — desktop only */}
            <Link
              href="/tracking"
              aria-label="Track order"
              className={`hidden md:inline-flex ${iconCls} hover:opacity-60 transition-opacity duration-200`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
                <rect x="9" y="11" width="14" height="10" rx="2" />
                <path d="M9 15h4M9 19h4" />
              </svg>
            </Link>

            {/* Account — desktop only */}
            <Link
              href="/account"
              aria-label="Account"
              className={`hidden md:inline-flex ${iconCls} hover:opacity-60 transition-opacity duration-200`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </Link>

            {/* Wishlist — desktop always visible; mobile only when there are saved items */}
            {isClient && wishlistCount > 0 && (
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className={`relative md:hidden ${iconCls} hover:opacity-60 transition-opacity duration-200`}
              >
                <Heart size={19} strokeWidth={1.8} fill="currentColor" />
                <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 flex items-center justify-center bg-white text-black text-[0.5rem] font-bold rounded-full px-0.5">
                  {wishlistCount}
                </span>
              </Link>
            )}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className={`relative hidden md:inline-flex ${iconCls} hover:opacity-60 transition-opacity duration-200`}
            >
              <Heart size={19} strokeWidth={1.8} />
              {isClient && wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 flex items-center justify-center bg-white text-black text-[0.5rem] font-bold rounded-full px-0.5">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label="Cart"
              className={`relative ${iconCls} hover:opacity-60 transition-opacity duration-200`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {isClient && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 flex items-center justify-center bg-white text-black text-[0.5rem] font-bold rounded-full px-0.5">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* ── Mobile search overlay — absolutely positioned below full header (incl. subnav) ── */}
          {mobileSearchOpen && (
            <div className="absolute top-full left-0 right-0 bg-zinc-950/98 backdrop-blur-sm md:hidden">
              <form
                onSubmit={handleMobileSearchSubmit}
                className="flex items-center gap-4 px-5 py-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white/50 shrink-0"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={mobileSearchRef}
                  type="search"
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  autoComplete="off"
                  className="flex-1 bg-transparent text-white placeholder:text-white/40 text-sm outline-none border-b border-white/20 py-1.5 focus:border-white/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => {
                    setMobileSearchOpen(false);
                    setMobileSearchQuery("");
                  }}
                  aria-label="Close search"
                  className="text-white/50 hover:text-white transition-colors shrink-0"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <line x1="2" y1="2" x2="14" y2="14" />
                    <line x1="14" y1="2" x2="2" y2="14" />
                  </svg>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* ── Collections subnav — visible on any /collections/** page ── */}
        <AnimatePresence>
          {pathname?.startsWith("/collections") && (
            <motion.div
              key="collections-subnav"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 44, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden bg-white border-b border-zinc-100"
            >
              <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex items-center justify-center h-11 w-max min-w-full px-6">
                  {COLLECTIONS_NAV.map((col) => {
                    const isActive =
                      col.href === "/collections"
                        ? pathname === "/collections"
                        : pathname?.startsWith(col.href);
                    return (
                      <Link
                        key={col.href}
                        href={col.href}
                        className={cn(
                          "shrink-0 px-4 h-full flex items-center text-[0.58rem] tracking-[0.18em] uppercase whitespace-nowrap transition-all duration-200 border-b-2",
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
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── MOBILE MENU ─────────────────────────────────────── */}

      {/* Backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Full-screen panel slides in from left */}
      <div
        className={`fixed inset-0 z-50 bg-white md:hidden flex flex-col transition-transform duration-500 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            aria-label="Unapologetic home"
          >
            <Image
              src="/logos/unap_logo_black.png"
              alt="Unapologetic"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="text-zinc-900 hover:opacity-60 transition-opacity duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto flex flex-col justify-center">
          {navLinks.map((link, i) =>
            link.dropdown ? (
              <MobileCollections
                key={link.href}
                onClose={() => setMobileOpen(false)}
              />
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{ transitionDelay: mobileOpen ? `${i * 60}ms` : "0ms" }}
                className={`block px-8 py-5 border-b border-zinc-100 text-xs tracking-widest uppercase transition-all duration-500 ${
                  mobileOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4"
                } text-zinc-500 hover:text-zinc-900 hover:pl-10`}
              >
                {link.label}
              </Link>
            ),
          )}
          {/* Utility links — only needed on mobile (hidden in desktop header) */}
          {[
            { label: "Search", href: "/search" },
            { label: "Wishlist", href: "/wishlist" },
            { label: "Account", href: "/account" },
          ].map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                transitionDelay: mobileOpen
                  ? `${(navLinks.length + i) * 60}ms`
                  : "0ms",
              }}
              className={`block px-8 py-5 border-b border-zinc-100 text-xs tracking-widest uppercase transition-all duration-500 ${
                mobileOpen
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4"
              } text-zinc-500 hover:text-zinc-900 hover:pl-10`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Bottom: brand tagline + CTA */}
        <div className="px-8 py-10 border-t border-zinc-100 flex flex-col gap-4">
          <p className="eyebrow text-zinc-400">Est. 2024 | A Global Movement</p>
          <Link
            href="/collections"
            onClick={() => setMobileOpen(false)}
            className="border border-zinc-900 bg-transparent text-zinc-900 px-8 py-3 text-[0.7rem] tracking-widest uppercase hover:bg-zinc-900 hover:text-white transition-colors duration-300 text-center"
          >
            Shop Now
          </Link>
          <div className="flex gap-3">
            <Link
              href="/auth/login"
              onClick={() => setMobileOpen(false)}
              className="flex-1 border border-zinc-200 text-zinc-500 px-4 py-2.5 text-[0.6rem] tracking-widest uppercase hover:text-zinc-900 hover:border-zinc-400 transition-colors duration-200 text-center"
            >
              Sign In
            </Link>
            <Link
              href="/tracking"
              onClick={() => setMobileOpen(false)}
              className="flex-1 border border-zinc-200 text-zinc-500 px-4 py-2.5 text-[0.6rem] tracking-widest uppercase hover:text-zinc-900 hover:border-zinc-400 transition-colors duration-200 text-center"
            >
              Track Order
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
