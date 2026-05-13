"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LayoutDashboard, Package, Layers, ChevronRight } from "lucide-react";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  {
    href: "/admin/collections",
    label: "Collections",
    icon: Layers,
    exact: false,
  },
  { href: "/admin/products", label: "Products", icon: Package, exact: false },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-zinc-50">
      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside className="w-60 shrink-0 bg-black flex flex-col min-h-screen sticky top-0">
        {/* Logo */}
        <div className="px-6 py-7 border-b border-white/10">
          <Link href="/admin">
            <Image
              src="/logos/unap_logo_white.png"
              alt="Unapologetic"
              width={110}
              height={28}
              className="object-contain"
            />
          </Link>
          <p className="text-white/40 text-[0.6rem] tracking-[0.2em] uppercase mt-2">
            Admin
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 flex flex-col gap-1">
          {navLinks.map(({ href, label, icon: Icon, exact }) => {
            const active = exact
              ? pathname === href
              : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-[0.75rem] tracking-widest uppercase font-medium transition-colors duration-200 ${
                  active
                    ? "bg-white text-black"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-white/10">
          <Link
            href="/"
            className="text-white/40 hover:text-white/70 text-[0.65rem] tracking-widest uppercase transition-colors duration-200 flex items-center gap-1.5"
          >
            View Store
            <ChevronRight size={11} />
          </Link>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
