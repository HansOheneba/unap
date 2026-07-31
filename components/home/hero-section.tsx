"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const VIDEOS = ["/hero/hero_candy.mp4", "/hero/hero_candy2.mp4"] as const;

/**
 * Single <video> element that advances sources on `ended`.
 * Dual crossfade remounts were decoding ~35MB of video at once and
 * contributing to iPhone Safari tab reloads under memory pressure.
 */
export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.getAttribute("src") !== VIDEOS[index]) {
      el.src = VIDEOS[index];
    }
    void el.play().catch(() => {});
  }, [index]);

  const handleEnded = () => {
    setIndex((i) => (i + 1) % VIDEOS.length);
  };

  return (
    <section className="relative w-full h-dvh overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={VIDEOS[0]}
        autoPlay
        muted
        playsInline
        preload="metadata"
        onEnded={handleEnded}
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
