"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { subscribeNewsletter } from "@/lib/api/forms";
import { ApiError } from "@/lib/api/client";

export default function InnerCircleSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    setSubmitting(true);
    try {
      await subscribeNewsletter({
        email: email.trim(),
        source: "homepage",
      });
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not join right now. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="relative flex flex-col items-center justify-center text-center py-32 md:py-44 px-8 overflow-hidden">
      <Image
        src="/home/manXmanModels.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover brightness-25"
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/50 to-black/80" />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-lg w-full">
        <p className="eyebrow text-white/65">Free to Join</p>
        <h2 className="text-white">Join the Inner Circle</h2>
        <p className="text-white/75 leading-relaxed">
          Sign up free for early drops, member updates, and what we share first
          with the Circle. No spam. Just signal.
        </p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-2 pt-2"
          >
            <p className="eyebrow text-white">You are in.</p>
            <p className="text-white/70 text-sm">
              Welcome to the Inner Circle. Watch your inbox.
            </p>
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-2"
          >
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              disabled={submitting}
              className="flex-1 bg-black border border-white/40 text-white placeholder:text-white/40 px-6 py-3 text-[0.7rem] tracking-widest uppercase outline-none focus:border-white/60 transition-colors duration-300 disabled:opacity-60"
            />
            <Button
              type="submit"
              variant="outline-white"
              disabled={submitting}
              className="shrink-0"
            >
              {submitting ? "Joining…" : "Join Free"}
            </Button>
          </form>
        )}

        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>
    </section>
  );
}
