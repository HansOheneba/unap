"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const VIDEOS = ["/hero/hero-vid1.mp4", "/hero/hero-vid2.mp4"] as const;
const POSTER = "/hero/hero-poster.jpg";

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
};

function shouldLoadHeroVideo(): boolean {
  if (typeof window === "undefined") return false;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }

  const connection = (
    navigator as Navigator & { connection?: NetworkInformation }
  ).connection;

  if (connection?.saveData) return false;
  if (
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g"
  ) {
    return false;
  }

  return true;
}

/**
 * Single <video> element that advances sources on `ended`.
 * Dual crossfade remounts were decoding ~35MB of video at once and
 * contributing to iPhone Safari tab reloads under memory pressure.
 *
 * Sources are 720p, audio-stripped, fast-start MP4s (~1.7–2.4MB each).
 * A poster paints immediately; video is skipped on Save-Data / 2G /
 * prefers-reduced-motion so slow connections keep a static hero.
 */
export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [loadVideo, setLoadVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setLoadVideo(shouldLoadHeroVideo());
  }, []);

  useEffect(() => {
    if (!loadVideo) return;
    const el = videoRef.current;
    if (!el) return;

    if (el.getAttribute("src") !== VIDEOS[index]) {
      el.src = VIDEOS[index];
    }
    void el.play().catch(() => {});
  }, [index, loadVideo]);

  const handleEnded = () => {
    setIndex((i) => (i + 1) % VIDEOS.length);
  };

  return (
    <section className="relative w-full h-dvh overflow-hidden bg-black">
      {/* Instant paint while video buffers (or as fallback on slow links) */}
      <Image
        src={POSTER}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        aria-hidden
      />

      {loadVideo ? (
        <video
          ref={videoRef}
          muted
          playsInline
          preload="none"
          poster={POSTER}
          onEnded={handleEnded}
          onPlaying={() => setVideoReady(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : null}

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
