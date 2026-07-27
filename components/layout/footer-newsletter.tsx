"use client";

import { useState } from "react";
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
        <p className="text-[0.7rem] font-semibold tracking-widest uppercase text-white">
          You are on the list.
        </p>
        <p className="text-white/70 text-sm">
          Watch your inbox for drops and Inner Circle updates.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 pt-2">
      <p className="text-[0.7rem] font-semibold tracking-widest uppercase text-white">
        Join the Inner Circle
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-2 max-w-sm"
      >
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          disabled={submitting}
          className="flex-1 bg-transparent border border-white/40 text-white placeholder:text-white/40 px-4 py-3 text-[0.7rem] tracking-widest uppercase outline-none focus:border-white transition-colors duration-300 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={submitting}
          className="text-[0.7rem] font-semibold tracking-widest uppercase text-black bg-white border border-white px-6 py-3 shrink-0 hover:bg-black hover:text-white hover:border-white transition-colors duration-300 disabled:opacity-60"
        >
          {submitting ? "Joining…" : "Get First Access"}
        </button>
      </form>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
