"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { mockLogin } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    const result = await mockLogin(email, password);
    setLoading(false);
    if (result.success) {
      router.push("/account");
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-20">


      <div className="w-full max-w-sm">
        <p className="text-white/50 text-[0.65rem] tracking-[0.25em] uppercase mb-3">
          Welcome Back
        </p>
        <h1 className="text-2xl font-light tracking-tight mb-8">Sign In</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.65rem] tracking-widest uppercase text-white/60">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="bg-white/5 border border-white/20 text-white placeholder-white/30 px-4 py-3 text-sm focus:outline-none focus:border-white/60 transition-colors duration-200"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[0.65rem] tracking-widest uppercase text-white/60">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-[0.6rem] tracking-widest uppercase text-white/40 hover:text-white transition-colors duration-200"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="bg-white/5 border border-white/20 text-white placeholder-white/30 px-4 py-3 text-sm focus:outline-none focus:border-white/60 transition-colors duration-200"
            />
          </div>

          {/* Forgot */}
          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-[0.6rem] tracking-widest uppercase text-white/40 hover:text-white transition-colors duration-200"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-xs border border-red-400/30 bg-red-400/5 px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full border border-white/40 bg-transparent text-white px-8 py-3.5 text-[0.7rem] tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/30 text-[0.6rem] tracking-widest uppercase">
            Or
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <p className="text-center text-white/50 text-xs">
          New to Unapologetic?{" "}
          <Link
            href="/auth/signup"
            className="text-white underline underline-offset-4 hover:opacity-70 transition-opacity duration-200"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
