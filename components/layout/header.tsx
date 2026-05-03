"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

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
  { label: "The Creed", href: "/the-creed" },
  { label: "Collections", href: "/collections", dropdown: collectionItems },
  { label: "Movement", href: "/movement" },
  { label: "Future", href: "/future" },
  { label: "Inner Circle", href: "/inner-circle" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        scrolled
          ? "bg-black"
          : "bg-linear-to-b from-black/55 via-black/20 to-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-8 py-5">
        {/* Left: Nav links */}
        <nav className="flex items-center gap-7">
          {navLinks.map((link) =>
            link.dropdown ? (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="flex items-center gap-1 text-white text-xs font-medium tracking-widest uppercase hover:opacity-60 transition-opacity duration-200">
                  {link.label}
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    fill="none"
                    aria-hidden="true"
                    className={`transition-transform duration-200 ${
                      openDropdown === link.label ? "rotate-180" : ""
                    }`}
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

                {/* Dropdown */}
                <div
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

        {/* Center: Logo */}
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

        {/* Right: Search + Cart */}
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
  );
}
