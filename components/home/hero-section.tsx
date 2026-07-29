"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const VIDEOS = ["/hero/hero_candy.mp4", "/hero/hero_candy2.mp4"] as const;
const CROSSFADE_MS = 700;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [incoming, setIncoming] = useState<number | null>(null);
  const nextRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (incoming === null || !nextRef.current) return;
    const el = nextRef.current;
    el.currentTime = 0;
    void el.play().catch(() => {});
  }, [incoming]);

  useEffect(() => {
    if (incoming === null) return;
    const id = window.setTimeout(() => {
      setCurrent(incoming);
      setIncoming(null);
    }, CROSSFADE_MS);
    return () => window.clearTimeout(id);
  }, [incoming]);

  const handleEnded = () => {
    if (incoming !== null) return;
    setIncoming((current + 1) % VIDEOS.length);
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      <video
        key={`current-${current}`}
        src={VIDEOS[current]}
        autoPlay
        muted
        playsInline
        onEnded={handleEnded}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          incoming !== null ? "opacity-0" : "opacity-100"
        }`}
      />

      {incoming !== null && (
        <video
          ref={nextRef}
          key={`next-${incoming}`}
          src={VIDEOS[incoming]}
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-100"
        />
      )}

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
