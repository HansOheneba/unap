"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const collectionItems = [
  { label: "Tops", href: "/collections/tops" },
  { label: "Head Wears", href: "/collections/head-wears" },
  { label: "Pants", href: "/collections/pants" },
  { label: "Sunglasses", href: "/collections/sunglasses" },
];

type NavLink =
  | { label: string; href: string; dropdown?: never }
  | { label: string; href: string; dropdown: typeof collectionItems };

const navLinks: NavLink[] = [
  { label: "Collections", href: "/collections", dropdown: collectionItems },
  { label: "The Creed", href: "/the-creed" },
  { label: "Inner Circle", href: "/inner-circle" },
];

/* ── Mobile collections accordion ─────────────────────────── */
function MobileCollections({ onClose }: { onClose: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-white/8">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center justify-between w-full px-8 py-5 text-white/70 text-xs tracking-widest uppercase hover:text-white transition-colors duration-200"
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
              className="py-3 pr-8 text-white/40 text-xs tracking-widest uppercase hover:text-white transition-colors duration-200 border-t border-white/5"
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
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => {
    const id = setTimeout(() => setMobileOpen(false), 0);
    return () => clearTimeout(id);
  }, [pathname]);

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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          scrolled
            ? "bg-black"
            : "bg-linear-to-b from-black/55 via-black/15 to-transparent"
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
                  <button className="flex items-center gap-1 text-white text-xs font-medium tracking-widest uppercase hover:opacity-60 transition-opacity duration-200">
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
                    className={`absolute top-full left-0 mt-4 min-w-40 bg-black/90 backdrop-blur-md transition-all duration-200 ${
                      openDropdown === link.label
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-1 pointer-events-none"
                    }`}
                  >
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-5 py-3 text-white text-xs tracking-widest uppercase hover:bg-white/10 transition-colors duration-150"
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
                  className="text-white text-xs font-medium tracking-widest uppercase hover:opacity-60 transition-opacity duration-200"
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
              className={`block h-px bg-white transition-all duration-300 ease-in-out origin-center ${
                mobileOpen ? "w-6 translate-y-1.5 rotate-45" : "w-6"
              }`}
            />
            <span
              className={`block h-px bg-white transition-all duration-300 ease-in-out ${
                mobileOpen ? "w-0 opacity-0" : "w-4 opacity-100"
              }`}
            />
            <span
              className={`block h-px bg-white transition-all duration-300 ease-in-out origin-center ${
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

          {/* ── Right: Search + Track + User + Cart ── */}
          <div className="flex items-center gap-5">
            <button
              aria-label="Search"
              className="text-white hover:opacity-60 transition-opacity duration-200"
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
            <Link
              href="/tracking"
              aria-label="Track order"
              className="text-white hover:opacity-60 transition-opacity duration-200"
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
            <Link
              href="/account"
              aria-label="Account"
              className="text-white hover:opacity-60 transition-opacity duration-200"
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
            <button
              aria-label="Cart"
              className="relative text-white hover:opacity-60 transition-opacity duration-200"
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
            </button>
          </div>
        </div>
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
        className={`fixed inset-0 z-50 bg-black md:hidden flex flex-col transition-transform duration-500 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            aria-label="Unapologetic home"
          >
            <Image
              src="/logos/unap_logo_white.png"
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
            className="text-white hover:opacity-60 transition-opacity duration-200"
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
                className={`block px-8 py-5 border-b border-white/8 text-xs tracking-widest uppercase transition-all duration-500 ${
                  mobileOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4"
                } text-white/70 hover:text-white hover:pl-10`}
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>

        {/* Bottom: brand tagline + CTA */}
        <div className="px-8 py-10 border-t border-white/8 flex flex-col gap-4">
          <p className="eyebrow text-white/25">Est. 2024 | A Global Movement</p>
          <Link
            href="/collections"
            onClick={() => setMobileOpen(false)}
            className="border border-white/40 bg-transparent text-white px-8 py-3 text-[0.7rem] tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-300 text-center"
          >
            Shop Now
          </Link>
          <div className="flex gap-3">
            <Link
              href="/auth/login"
              onClick={() => setMobileOpen(false)}
              className="flex-1 border border-white/15 text-white/60 px-4 py-2.5 text-[0.6rem] tracking-widest uppercase hover:text-white hover:border-white/35 transition-colors duration-200 text-center"
            >
              Sign In
            </Link>
            <Link
              href="/tracking"
              onClick={() => setMobileOpen(false)}
              className="flex-1 border border-white/15 text-white/60 px-4 py-2.5 text-[0.6rem] tracking-widest uppercase hover:text-white hover:border-white/35 transition-colors duration-200 text-center"
            >
              Track Order
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
