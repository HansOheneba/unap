"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  // formatAuthPhoneInput,
  mockLogin,
  mockSendOtp,
  // normalizePhoneForApi,
  OTP_LENGTH,
  type OtpIdentifier,
  type User,
} from "@/lib/auth";
import { Button } from "@/components/ui/button";
import OtpField from "@/components/auth/otp-field";
// Phone OTP login is temporarily disabled while SMS delivery is being fixed.
// import OtpChannelToggle, {
//   type OtpChannel,
// } from "@/components/auth/otp-channel-toggle";
import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { useAuthStore } from "@/lib/stores/auth-store";

const inputCls =
  "bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 text-sm focus:outline-none focus:border-zinc-400 transition-colors duration-200 w-full";

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
  const setAuthUser = useAuthStore((s) => s.setUser);

  // Phone channel temporarily disabled — email OTP only.
  const [phase, setPhase] = useState<"identity" | "otp">("identity");
  const [email, setEmail] = useState("");
  // const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const identifier = (): OtpIdentifier | null => {
    const value = email.trim();
    if (!value || !/\S+@\S+\.\S+/.test(value)) return null;
    return { channel: "email", email: value };
    // Phone OTP (disabled):
    // const digits = normalizePhoneForApi(phone);
    // if (digits.length < 9) return null;
    // return { channel: "phone", phone: digits };
  };

  const destinationLabel = email.trim() || "your email";

  const hydrateSession = (u: User) => {
    setField("firstName", u.firstName);
    setField("lastName", u.lastName);
    setField("email", u.email);
    setField("phone", u.phone || "+");
    setField("whatsapp", u.whatsapp || "+");
    setField("country", u.country || "Ghana");
    setField("region", u.region);
    setField("city", u.city);
    setField("address", u.address);
    setField("landmark", u.landmark);
    setField("googleMapsLink", u.googleMapsLink);
    setField("birthDay", u.birthDay);
    setField("birthMonth", u.birthMonth);
    setField("birthYear", u.birthYear);
    setField("topSize", u.topSize);
    setField("bottomSize", u.bottomSize);
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const id = identifier();
    if (!id) {
      setError("Enter a valid email address.");
      return;
    }
    setLoading(true);
    const result = await mockSendOtp(id, "login");
    setLoading(false);
    if (!result.success) {
      setError(result.message || "Could not send your code. Please try again.");
      return;
    }
    setOtp("");
    setPhase("otp");
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const id = identifier();
    if (!id) {
      setError("Enter a valid email address.");
      return;
    }
    if (otp.length !== OTP_LENGTH) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setLoading(true);
    const result = await mockLogin(id, otp);
    setLoading(false);
    if (result.success) {
      // Cookies were minted by the proxy on this verify call. Prefer the
      // user from the response; otherwise re-check the session endpoint.
      if (result.apiUser) {
        setAuthUser(result.apiUser);
      } else {
        await useAuthStore.getState().hydrate();
      }
      if (result.user) hydrateSession(result.user);
      else if (id.channel === "email") setField("email", id.email);
      // else setField("phone", phone.trim() || id.phone);
      router.push(nextPath);
    } else {
      setError(result.message || "Invalid or expired code. Please try again.");
    }
  };

  const handleResend = async () => {
    setError("");
    const id = identifier();
    if (!id) {
      setError("Enter a valid email address.");
      return;
    }
    setLoading(true);
    const result = await mockSendOtp(id, "login");
    setLoading(false);
    if (!result.success) {
      setError(result.message || "Could not resend your code. Please try again.");
      return;
    }
    setOtp("");
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm">
        <p className="text-zinc-500 text-[0.65rem] tracking-[0.25em] uppercase mb-3">
          Welcome Back
        </p>
        <h1 className="text-2xl font-light tracking-tight mb-2">Sign In</h1>
        <p className="text-zinc-500 text-sm mb-8">
          {phase === "identity"
            ? "We will send you a one-time code by email."
            : `Enter the code we sent to ${destinationLabel}.`}
        </p>

        {phase === "identity" ? (
          <form onSubmit={handleSendCode} className="flex flex-col gap-4">
            {/* Phone OTP login temporarily disabled
            <OtpChannelToggle
              value={channel}
              disabled={loading}
              onChange={(next) => {
                setChannel(next);
                setError("");
              }}
            />
            */}

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
                className={inputCls}
              />
            </div>
            {/* Phone OTP input (disabled)
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.65rem] tracking-widest uppercase text-zinc-500">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatAuthPhoneInput(e.target.value))}
                placeholder="020 111 2223"
                autoComplete="tel"
                className={inputCls}
              />
            </div>
            */}

            {error && (
              <p className="text-red-400 text-xs border border-red-400/30 bg-red-400/5 px-4 py-3">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="mt-2 w-full">
              {loading ? "Sending code…" : "Send Sign-In Code"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <label
                htmlFor="login-otp"
                className="text-[0.65rem] tracking-widest uppercase text-zinc-500 text-center"
              >
                One-Time Code
              </label>
              <OtpField
                id="login-otp"
                value={otp}
                onChange={setOtp}
                disabled={loading}
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs border border-red-400/30 bg-red-400/5 px-4 py-3">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Verifying…" : "Sign In"}
            </Button>

            <div className="flex flex-col items-center gap-3 text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="text-[0.6rem] tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors duration-200 disabled:opacity-50"
              >
                Resend Code
              </button>
              <button
                type="button"
                onClick={() => {
                  setPhase("identity");
                  setOtp("");
                  setError("");
                }}
                className="text-[0.6rem] tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors duration-200"
              >
                Use a Different Email
              </button>
            </div>
          </form>
        )}

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
            href={
              nextPath && nextPath !== "/account"
                ? `/auth/signup?next=${encodeURIComponent(nextPath)}`
                : "/auth/signup"
            }
            className="text-zinc-900 underline underline-offset-4 hover:opacity-70 transition-opacity duration-200"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
