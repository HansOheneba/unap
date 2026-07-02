"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { buttonVariants } from "@/components/ui/button";

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function NotFound() {
  return (
    <main className="relative bg-black text-white min-h-[80vh] flex items-center justify-center overflow-hidden px-8">
      <Image
        src="/home/manStudio.jpg"
        alt=""
        fill
        className="object-cover brightness-25"
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black" />

      <FadeIn className="relative z-10 flex flex-col items-center text-center gap-6 max-w-lg py-24">
        <p className="eyebrow text-white/60">Error 404</p>
        <h1 className="text-white leading-none">This Page Never Existed.</h1>
        <p className="text-white/70 text-lg leading-relaxed max-w-sm">
          Maybe it moved. Maybe you took a wrong turn. Either way, we do not
          apologize for it, and neither should you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link href="/" className={buttonVariants({ variant: "outline-white" })}>
            Back to Home
          </Link>
          <Link href="/collections" className={buttonVariants({ variant: "outline-white" })}>
            Shop Collections
          </Link>
        </div>
      </FadeIn>
    </main>
  );
}
