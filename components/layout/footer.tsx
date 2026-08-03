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

const navSections = [
  { title: "Explore", links: explore, external: false },
  { title: "Connect", links: connect, external: true },
  { title: "Support", links: support, external: false },
] as const;

function NavLinkList({
  links,
  external,
}: {
  links: readonly { label: string; href: string }[];
  external: boolean;
}) {
  return (
    <ul className="flex flex-col">
      {links.map((link) => (
        <li key={link.label}>
          {external ? (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-2.5 text-[0.9375rem] leading-snug tracking-[-0.01em] text-white/75 transition-colors duration-200 hover:text-white active:opacity-70 md:py-1.5 md:text-sm"
            >
              {link.label}
            </a>
          ) : (
            <Link
              href={link.href}
              className="block py-2.5 text-[0.9375rem] leading-snug tracking-[-0.01em] text-white/75 transition-colors duration-200 hover:text-white active:opacity-70 md:py-1.5 md:text-sm"
            >
              {link.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  return (
    <footer className="bg-black text-white overflow-hidden">
      {/* Top band */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-360 flex-col items-center gap-2 px-5 py-6 text-center sm:px-8 md:flex-row md:justify-between md:gap-6 md:px-20 md:py-8 md:text-left">
          <p className="eyebrow text-white/70 hidden md:block">
            Est. 2024 | A Global Movement
          </p>
          <p className="max-w-[22rem] text-[0.7rem] font-light uppercase leading-relaxed tracking-[0.18em] text-white/70 sm:tracking-[0.28em] md:max-w-none md:tracking-[0.4em]">
            Presence is power. Silence is a lie. The cloth speaks first.
          </p>
        </div>
      </div>

      {/* Main body */}
      <div className="mx-auto max-w-360 px-5 pt-12 pb-10 sm:px-8 md:px-20 md:pt-20 md:pb-14">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          {/* Brand column */}
          <div className="flex flex-col gap-6 md:col-span-4 md:gap-8">
            <Link
              href="/"
              className="inline-block w-fit transition-opacity duration-200 active:opacity-70"
            >
              <Image
                src="/logos/unap_logo_white.png"
                alt="Unapologetic"
                width={52}
                height={52}
                className="object-contain"
              />
            </Link>

            <p className="max-w-xs text-[0.9375rem] leading-relaxed text-white/85 md:text-base">
              A global movement for those who were told to tone it down and never
              did. Designed for the unapologetic. Built for the ones who take up
              space on purpose.
            </p>

            <div className="flex flex-col gap-1">
              <a
                href="tel:+233534946040"
                className="w-fit py-1 text-sm text-white/70 transition-colors duration-200 hover:text-white active:opacity-70"
              >
                +233 534 946 040
              </a>
              <a
                href="mailto:hello@mail.unapologeticnm.com"
                className="w-fit break-all py-1 text-sm text-white/70 transition-colors duration-200 hover:text-white active:opacity-70"
              >
                hello@mail.unapologeticnm.com
              </a>
            </div>

            <FooterNewsletter />
          </div>

          {/* Desktop nav columns */}
          <div className="hidden md:col-span-8 md:grid md:grid-cols-3 md:gap-10">
            {navSections.map((section) => (
              <div key={section.title} className="flex flex-col gap-5">
                <p className="eyebrow text-white/90">{section.title}</p>
                <NavLinkList links={section.links} external={section.external} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile nav: Apple-style disclosure rows */}
        <nav
          aria-label="Footer"
          className="mt-10 border-t border-white/10 md:hidden"
        >
          {navSections.map((section) => (
            <details
              key={section.title}
              className="group border-b border-white/10"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/90 transition-opacity duration-200 marker:content-none active:opacity-70 [&::-webkit-details-marker]:hidden">
                {section.title}
                <span
                  aria-hidden="true"
                  className="relative size-3 shrink-0"
                >
                  <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-white/70" />
                  <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-white/70 transition-transform duration-200 ease-out group-open:scale-y-0" />
                </span>
              </summary>
              <div className="pb-4 pl-0">
                <NavLinkList links={section.links} external={section.external} />
              </div>
            </details>
          ))}
        </nav>
      </div>

      {/* Giant wordmark */}
      <div className="overflow-hidden px-4 select-none pointer-events-none sm:px-6 md:px-14">
        <p
          className="translate-x-[-2%] whitespace-nowrap font-extrabold uppercase leading-none text-white/8"
          style={{
            fontSize: "clamp(3.5rem, 18vw, 18rem)",
            fontFamily: "var(--font-space-grotesk)",
            letterSpacing: "-0.04em",
          }}
          aria-hidden="true"
        >
          Unapologetic
        </p>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-360 flex-col items-center gap-5 px-5 py-7 text-center sm:px-8 md:flex-row md:items-center md:justify-between md:gap-6 md:px-20 md:py-6 md:text-left">
          <p className="text-[0.65rem] font-light uppercase leading-relaxed tracking-[0.16em] text-white/70 sm:tracking-[0.28em] md:tracking-[0.4em]">
            &copy; 2026 Unapologetic. All Rights Reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-1 text-[0.65rem] font-light uppercase tracking-[0.16em] text-white/70 transition-colors duration-200 hover:text-white active:opacity-70 sm:tracking-[0.28em] md:tracking-[0.4em]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <p className="hidden text-[0.65rem] font-light uppercase tracking-[0.4em] text-white/70 md:block">
            Become Unapologetic.
          </p>
        </div>
      </div>
    </footer>
  );
}
