"use client";

import { usePathname } from "next/navigation";
import Header from "./header";
import Footer from "./footer";

export default function ConditionalNav({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const noNav = pathname?.startsWith("/account");

  return (
    <>
      {!noNav && <Header />}
      {children}
      {!noNav && <Footer />}
    </>
  );
}
