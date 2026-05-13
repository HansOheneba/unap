"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

const videos = [
  "/hero/hero_vid1.mp4",
  "/hero/hero_vid2.mp4",
  "/hero/hero_vid3.mp4",
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const currentRef = useRef<HTMLVideoElement>(null);
  const nextRef = useRef<HTMLVideoElement>(null);

  // Advance to next video with a crossfade
  const handleVideoEnd = () => {
    const next = (currentIndex + 1) % videos.length;
    setNextIndex(next);
    setTransitioning(true);
  };

  useEffect(() => {
    if (transitioning && nextRef.current) {
      nextRef.current.currentTime = 0;
      nextRef.current.play().catch(() => {});
    }
  }, [transitioning, nextIndex]);

  const handleNextCanPlay = () => {
    if (!transitioning) return;
    // After a short crossfade, swap
    const timer = setTimeout(() => {
      setCurrentIndex(nextIndex!);
      setNextIndex(null);
      setTransitioning(false);
    }, 600);
    return () => clearTimeout(timer);
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Current video */}
      <video
        ref={currentRef}
        key={`current-${currentIndex}`}
        src={videos[currentIndex]}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          transitioning ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Next video (preloaded, fades in) */}
      {nextIndex !== null && (
        <video
          ref={nextRef}
          key={`next-${nextIndex}`}
          src={videos[nextIndex]}
          muted
          playsInline
          onCanPlay={handleNextCanPlay}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            transitioning ? "opacity-100" : "opacity-0"
          }`}
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
