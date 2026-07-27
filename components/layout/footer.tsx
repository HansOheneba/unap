import Image from "next/image";
import Link from "next/link";
import FooterNewsletter from "@/components/layout/footer-newsletter";

const explore = [
  { label: "Collections", href: "/collections" },
  { label: "The Creed", href: "/the-creed" },
  { label: "Movement", href: "/movement" },
  { label: "Future", href: "/future" },
  { label: "Inner Circle", href: "/inner-circle" },
];

const connect = [
  { label: "Instagram", href: "https://www.instagram.com/unapologeticnm" },
  { label: "TikTok", href: "https://tiktok.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "Twitter / X", href: "https://x.com" },
];

const support = [
  { label: "Contact", href: "/contact" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "Track Order", href: "/tracking" },
];

const legal = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white overflow-hidden">
      {/* ── TOP BAND: full-width brand statement ────── */}
      <div className="border-b border-white/10 px-8 md:px-20 py-10 flex items-center justify-between gap-6">
        <p className="eyebrow text-white/70 hidden md:block">
          Est. 2024 | A Global Movement
        </p>
        <p className="eyebrow text-white/70 text-center md:text-left">
          Presence is power. Silence is a lie. The cloth speaks first.
        </p>
      </div>

      {/* ── MAIN BODY ──────────────────────────────── */}
      <div className="px-8 md:px-20 pt-20 pb-14 max-w-360 mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">
        {/* Brand column */}
        <div className="md:col-span-4 flex flex-col gap-8">
          <Link href="/" className="inline-block">
            <Image
              src="/logos/unap_logo_white.png"
              alt="Unapologetic"
              width={52}
              height={52}
              className="object-contain"
            />
          </Link>

          <p className="text-white/85 leading-relaxed max-w-xs">
            A global movement for those who were told to tone it down and never
            did. Designed for the unapologetic. Built for the ones who take up
            space on purpose.
          </p>

          <div className="flex flex-col gap-1.5">
            <a
              href="tel:+233534946040"
              className="text-white/70 text-sm hover:text-white transition-colors duration-300 w-fit"
            >
              +233 534 946 040
            </a>
            <a
              href="mailto:hello@mail.unapologeticnm.com"
              className="text-white/70 text-sm hover:text-white transition-colors duration-300 w-fit"
            >
              hello@mail.unapologeticnm.com
            </a>
          </div>

          <FooterNewsletter />
        </div>

        {/* Nav columns */}
        <div className="md:col-span-8 grid grid-cols-3 gap-10">
          {/* Explore */}
          <div className="flex flex-col gap-6">
            <p className="eyebrow text-white/90">Explore</p>
            <ul className="flex flex-col gap-4">
              {explore.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/75 text-sm hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-6">
            <p className="eyebrow text-white/90">Connect</p>
            <ul className="flex flex-col gap-4">
              {connect.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/75 text-sm hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-6">
            <p className="eyebrow text-white/90">Support</p>
            <ul className="flex flex-col gap-4">
              {support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/75 text-sm hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── GIANT WORDMARK ─────────────────────────── */}
      <div className="px-6 md:px-14 overflow-hidden select-none pointer-events-none">
        <p
          className="text-white/8 font-extrabold uppercase leading-none tracking-tighter whitespace-nowrap"
          style={{
            fontSize: "clamp(5rem, 16vw, 18rem)",
            fontFamily: "var(--font-space-grotesk)",
            letterSpacing: "-0.04em",
          }}
          aria-hidden="true"
        >
          Unapologetic
        </p>
      </div>

      {/* ── BOTTOM BAR ─────────────────────────────── */}
      <div className="border-t border-white/10 px-8 md:px-20 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="eyebrow text-white/70">
          &copy; 2026 Unapologetic. All Rights Reserved.
        </p>
        <div className="flex items-center gap-6">
          {legal.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="eyebrow text-white/70 hover:text-white transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p className="eyebrow text-white/70">Become Unapologetic.</p>
      </div>
    </footer>
  );
}
