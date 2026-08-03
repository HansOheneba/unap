"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { subscribeNewsletter } from "@/lib/api/forms";
import { ApiError } from "@/lib/api/client";

export default function FooterNewsletter() {
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
        source: "footer",
      });
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not subscribe right now. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col gap-2 pt-2">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white">
          You are on the list.
        </p>
        <p className="text-sm leading-relaxed text-white/70">
          Watch your inbox for drops and Inner Circle updates.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-3 pt-2">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white">
        Join the Inner Circle
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-2 sm:flex-row"
      >
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          disabled={submitting}
          className="min-h-12 w-full flex-1 border border-white/40 bg-transparent px-4 py-3 text-[0.7rem] uppercase tracking-[0.18em] text-white outline-none transition-colors duration-200 placeholder:text-white/40 focus:border-white disabled:opacity-60 sm:tracking-widest"
        />
        <Button
          type="submit"
          disabled={submitting}
          className="min-h-12 w-full shrink-0 border-white bg-white px-6 text-black hover:border-white hover:bg-black hover:text-white active:scale-[0.98] sm:w-auto"
        >
          {submitting ? "Joining…" : "Get First Access"}
        </Button>
      </form>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
