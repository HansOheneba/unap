"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { mockLogin, mockWishlistSlugs } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { PRODUCTS } from "@/lib/products";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/account";
  const setField = useOnboardingStore((s) => s.setField);
  const wishlistItems = useWishlistStore((s) => s.items);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
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
      // ── Hydrate the onboarding store with the mock user so the
      //    account page shows realistic profile/address data.
      const u = result.user;
      setField("firstName", u.firstName);
      setField("lastName", u.lastName);
      setField("email", u.email);
      setField("phone", u.phone);
      setField("whatsapp", u.whatsapp);
      setField("country", u.country);
      setField("region", u.region);
      setField("city", u.city);
      setField("address", u.address);
      setField("landmark", u.landmark);
      setField("birthDay", u.birthDay);
      setField("birthMonth", u.birthMonth);
      setField("birthYear", u.birthYear);
      setField("topSize", u.topSize);
      setField("bottomSize", u.bottomSize);

      // ── Seed the wishlist (only add slugs that aren't already there).
      const existing = new Set(wishlistItems.map((i) => i.id));
      for (const slug of mockWishlistSlugs) {
        const product = PRODUCTS.find((p) => p.slug === slug);
        if (!product || existing.has(product.id)) continue;
        toggleWishlist({
          id: product.id,
          name: product.name,
          price: product.price,
          img: product.variants[0]?.images[0] ?? "",
          category: product.category,
          slug: product.slug,
        });
      }

      router.push(nextPath);
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm">
        <p className="text-zinc-500 text-[0.65rem] tracking-[0.25em] uppercase mb-3">
          Welcome Back
        </p>
        <h1 className="text-2xl font-light tracking-tight mb-8">Sign In</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.65rem] tracking-widest uppercase text-zinc-500">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 text-sm focus:outline-none focus:border-zinc-400 transition-colors duration-200"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[0.65rem] tracking-widest uppercase text-zinc-500">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-[0.6rem] tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors duration-200"
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
              className="bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 text-sm focus:outline-none focus:border-zinc-400 transition-colors duration-200"
            />
          </div>

          {/* Forgot */}
          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-[0.6rem] tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors duration-200"
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

          <Button type="submit" disabled={loading} className="mt-2 w-full">
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-zinc-100" />
          <span className="text-zinc-300 text-[0.6rem] tracking-widest uppercase">
            Or
          </span>
          <div className="flex-1 h-px bg-zinc-100" />
        </div>

        <p className="text-center text-zinc-500 text-xs">
          New to Unapologetic?{" "}
          <Link
            href="/auth/signup"
            className="text-zinc-900 underline underline-offset-4 hover:opacity-70 transition-opacity duration-200"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
