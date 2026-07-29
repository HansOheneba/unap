"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const HERO_VIDEO = "/hero/hero_candy.mp4";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      <video
        src={HERO_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Cinematic vignette overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-transparent via-black/60 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/10 to-transparent pointer-events-none" />

      {/* Hero copy */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-white text-center">
        <p
          className="eyebrow animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          Est. 2024 | A Global Movement
        </p>
        <h1
          className="text-white animate-fade-up"
          style={{ animationDelay: "0.6s" }}
        >
          You Were Never Meant
          <br />
          To Apologize
        </h1>
        <div className="animate-fade-up" style={{ animationDelay: "0.9s" }}>
          <Link href="/collections">
            <Button variant="outline-white">Shop Collections</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
