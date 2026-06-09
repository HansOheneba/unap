"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { mockSendOtp, mockVerifyOtp, OTP_LENGTH } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import OtpField from "@/components/auth/otp-field";

const inputCls =
  "bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 text-sm focus:outline-none focus:border-zinc-400 transition-colors duration-200 w-full";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"email" | "otp" | "done">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    setError("");
    setLoading(true);
    const result = await mockSendOtp(email.trim());
    setLoading(false);
    if (!result.success) {
      setError("Could not send your code. Please try again.");
      return;
    }
    setOtp("");
    setPhase("otp");
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== OTP_LENGTH) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setError("");
    setLoading(true);
    const result = await mockVerifyOtp(email.trim(), otp);
    setLoading(false);
    if (!result.success) {
      setError("Invalid or expired code. Please try again.");
      return;
    }
    setPhase("done");
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="flex flex-col gap-1 text-center">
          <p className="text-[0.55rem] tracking-[0.4em] uppercase text-zinc-400">
            Unapologetic
          </p>
          <h1 className="text-2xl font-medium tracking-tight">
            {phase === "done" ? "You Are Verified" : "Get Sign-In Code"}
          </h1>
        </div>

        <AnimatePresence mode="wait">
          {phase === "done" ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-5 text-center"
            >
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
                  <rect x="2" y="4" width="20" height="16" rx="0" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Your email is verified. Use one-time codes to sign in from now
                on.
              </p>
              <Button
                className="w-full"
                onClick={() => router.push("/auth/login")}
              >
                Go to Sign In
              </Button>
            </motion.div>
          ) : phase === "otp" ? (
            <motion.form
              key="otp"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleVerify}
              className="flex flex-col gap-5"
            >
              <p className="text-zinc-500 text-sm text-center leading-relaxed -mt-2">
                Enter the code we sent to{" "}
                <span className="text-zinc-900">{email}</span>.
              </p>

              <OtpField
                id="forgot-otp"
                value={otp}
                onChange={setOtp}
                disabled={loading}
              />

              {error && <p className="text-red-400 text-[0.6rem]">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verifying…" : "Verify Code"}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setPhase("email");
                  setOtp("");
                  setError("");
                }}
                className="text-center text-[0.65rem] tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors duration-200"
              >
                Use a Different Email
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleSendCode}
              className="flex flex-col gap-5"
            >
              <p className="text-zinc-500 text-sm text-center leading-relaxed -mt-2">
                Enter the email linked to your account and we will send a
                one-time sign-in code.
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
                {loading ? "Sending…" : "Send Sign-In Code"}
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
