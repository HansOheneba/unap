"use client";

import { useState, useRef, useEffect } from "react";

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
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-transparent pointer-events-none" />

      {/* Hero copy */}
      <div className="absolute bottom-16 left-0 right-0 flex flex-col items-center gap-4 px-8 text-white text-center">
        <p className="text-xs tracking-[0.4em] uppercase opacity-50 font-light">
          Est. 2024 &mdash; A Global Movement
        </p>
        <h1 className="font-light tracking-tighter leading-none uppercase text-white">
          You Were Never Meant
          <br />
          To Apologize
        </h1>
      </div>

      {/* Video progress dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {videos.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (i !== currentIndex) {
                setNextIndex(i);
                setTransitioning(true);
              }
            }}
            aria-label={`Go to video ${i + 1}`}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex ? "bg-white scale-125" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
