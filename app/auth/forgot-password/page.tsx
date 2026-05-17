"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const inputCls =
  "bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 text-sm focus:outline-none focus:border-zinc-400 transition-colors duration-200 w-full";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    setError("");
    setLoading(true);
    /* Simulate API call */
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm flex flex-col gap-8">
        {/* Logo / brand */}
        <div className="flex flex-col gap-1 text-center">
          <p className="text-[0.55rem] tracking-[0.4em] uppercase text-zinc-400">
            Unapologetic
          </p>
          <h1 className="text-2xl font-medium tracking-tight">
            Reset Password
          </h1>
        </div>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-5 text-center"
            >
              {/* Envelope icon */}
              <div className="mx-auto w-14 h-14 border border-zinc-200 flex items-center justify-center">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-zinc-600"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-zinc-900 font-medium text-sm">
                  Check your inbox
                </p>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  If an account exists for{" "}
                  <span className="text-zinc-900">{email}</span>, we sent a
                  reset link. It expires in 30 minutes.
                </p>
              </div>
              <p className="text-zinc-400 text-xs">
                Didn&apos;t receive it? Check your spam folder or{" "}
                <button
                  onClick={() => setSent(false)}
                  className="text-zinc-900 underline underline-offset-2 hover:no-underline"
                >
                  try again
                </button>
                .
              </p>
              <Link
                href="/auth/login"
                className="text-[0.65rem] tracking-widest uppercase text-zinc-500 hover:text-zinc-900 transition-colors duration-200 mt-2"
              >
                Back to Login
              </Link>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
            >
              <p className="text-zinc-500 text-sm text-center leading-relaxed -mt-2">
                Enter the email linked to your account and we&apos;ll send you a
                reset link.
              </p>

              <div className="flex flex-col gap-1.5">
                <label className="text-[0.6rem] tracking-widest uppercase text-zinc-500">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={inputCls}
                />
                {error && <p className="text-red-400 text-[0.6rem]">{error}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending…" : "Send Reset Link"}
              </Button>

              <Link
                href="/auth/login"
                className="text-center text-[0.65rem] tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors duration-200"
              >
                Back to Login
              </Link>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
