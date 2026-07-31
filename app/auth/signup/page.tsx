"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  countries,
  regionsByCountry,
  mockSendOtp,
  mockSignup,
  mockVerifyOtp,
  OTP_LENGTH,
  type SignupData,
} from "@/lib/auth";
import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useCartStore } from "@/lib/stores/cart-store";
import { Button } from "@/components/ui/button";
import OtpField from "@/components/auth/otp-field";

const inputCls =
  "bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 text-sm focus:outline-none focus:border-zinc-400 transition-colors duration-200";
const selectCls =
  "bg-white border border-zinc-200 text-zinc-900 px-4 py-3 text-sm focus:outline-none focus:border-zinc-400 transition-colors duration-200 appearance-none";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[0.65rem] tracking-widest uppercase text-zinc-500">
        {label}
      </label>
      {children}
      {error && <p className="text-red-400 text-[0.65rem]">{error}</p>}
    </div>
  );
}

function formatPhoneInput(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "+";
  const a = digits.slice(0, 3);
  const b = digits.slice(3, 6);
  const c = digits.slice(6, 10);
  const d = digits.slice(10, 15);
  return ["+" + a, b, c, d].filter(Boolean).join(" ");
}

const STEPS = [
  { n: 1, label: "Account" },
  { n: 2, label: "About You" },
  { n: 3, label: "Delivery" },
];

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupPageInner />
    </Suspense>
  );
}

function SignupPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");
  const cartItemCount = useCartStore((s) => s.items.length);
  const wasShopping =
    nextPath === "/checkout" ||
    nextPath === "/cart" ||
    cartItemCount > 0;
  const loginHref = nextPath
    ? `/auth/login?next=${encodeURIComponent(nextPath)}`
    : "/auth/login";
  const continueHref = wasShopping ? "/cart" : nextPath || "/collections";
  const continueLabel = wasShopping ? "Back to Cart" : "Shop Now";

  const {
    step,
    loading,
    errors,
    email,
    agreed,
    firstName,
    lastName,
    phone,
    country,
    region,
    city,
    address,
    landmark,
    googleMapsLink,
    whatsapp,
    sameAsPhone,
    setField,
    setErrors,
    clearErrors,
    setLoading,
    nextStep,
    prevStep,
  } = useOnboardingStore();
  const setAuthUser = useAuthStore((s) => s.setUser);

  const regions = regionsByCountry[country] ?? [];
  const [step1Phase, setStep1Phase] = useState<"email" | "otp">("email");
  const [otp, setOtp] = useState("");
  const [otpSending, setOtpSending] = useState(false);

  /* ── Validation ── */
  const validateStep1Email = () => {
    const e: Record<string, string> = {};
    if (!email) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email.";
    if (!agreed) e.agreed = "You must agree to continue.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep1Otp = () => {
    const e: Record<string, string> = {};
    if (otp.length !== OTP_LENGTH) e.otp = "Enter the 6-digit code from your email.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = "First name is required.";
    if (!lastName.trim()) e.lastName = "Last name is required.";
    if (phone.replace(/\D/g, "").length < 7)
      e.phone = "Enter a valid phone number.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e: Record<string, string> = {};
    if (!region) e.region = "Please select a region.";
    if (!city.trim()) e.city = "City is required.";
    if (!address.trim()) e.address = "Delivery address is required.";
    if (
      googleMapsLink.trim() &&
      !/^https?:\/\/.+/i.test(googleMapsLink.trim())
    ) {
      e.googleMapsLink = "Paste a valid Google Maps link (https://...).";
    }
    if (!sameAsPhone && !whatsapp.trim())
      e.whatsapp = "WhatsApp number is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    clearErrors();
    if (step === 2 && validateStep2()) nextStep();
  };

  const handleSendSignupCode = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (!validateStep1Email()) return;
    setOtpSending(true);
    const result = await mockSendOtp(email.trim(), "signup");
    setOtpSending(false);
    if (!result.success) {
      setErrors({
        email: result.message || "Could not send your code. Please try again.",
      });
      return;
    }
    setOtp("");
    setStep1Phase("otp");
  };

  const handleVerifySignupCode = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (!validateStep1Otp()) return;
    setOtpSending(true);
    const result = await mockVerifyOtp(email.trim(), otp, "signup");
    setOtpSending(false);
    if (!result.success) {
      setErrors({
        otp: result.message || "Invalid or expired code. Please try again.",
      });
      return;
    }
    // httpOnly session cookies were already minted server-side by the proxy.
    if (result.apiUser) {
      setAuthUser(result.apiUser);
    } else {
      await useAuthStore.getState().hydrate();
    }
    nextStep();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;
    setLoading(true);
    const data: SignupData = {
      email,
      firstName,
      lastName,
      phone,
      country,
      region,
      city,
      address,
      landmark,
      googleMapsLink,
      whatsapp: sameAsPhone ? phone : whatsapp,
    };
    const result = await mockSignup({ ...data, agreedToTerms: agreed });
    setLoading(false);
    if (!result.success) {
      setErrors({
        address: result.message || "Could not complete signup. Please try again.",
      });
      return;
    }
    if (result.apiUser) setAuthUser(result.apiUser);
    // Shoppers came from checkout/cart. Send them back to their bag so they
    // never land on an empty account orders screen mid-purchase.
    if (wasShopping) {
      router.replace("/cart");
      return;
    }
    nextStep();
  };

  /* ── Welcome screen ── */
  if (step === 4) {
    return (
      <main className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center px-6 py-20 text-center">
        <p className="text-zinc-400 text-[0.65rem] tracking-[0.3em] uppercase mb-4">
          You&apos;re one of us now
        </p>
        <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
          Welcome, {firstName}.
        </h1>
        <p className="text-zinc-600 text-sm max-w-sm leading-relaxed mb-10">
          The rules were never made for people like us. Shop freely, move
          boldly. We handle the rest.
        </p>

        {/* Perks */}
        <div className="grid grid-cols-2 gap-px bg-zinc-100 border border-zinc-100 w-full max-w-sm mb-10 text-left">
          {[
            { label: "Early Access", desc: "New drops before anyone else" },
            { label: "Inner Circle", desc: "Exclusive members only offers" },
          ].map((p) => (
            <div key={p.label} className="bg-white px-5 py-4">
              <p className="text-zinc-900 text-xs font-medium mb-0.5">
                {p.label}
              </p>
              <p className="text-zinc-400 text-[0.65rem]">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3 w-full max-w-sm">
          <Link
            href={continueHref}
            className="flex-1 border border-zinc-900 bg-transparent text-zinc-900 px-6 py-3 text-[0.65rem] tracking-widest uppercase hover:bg-zinc-900 hover:text-white transition-colors duration-300 text-center whitespace-nowrap"
          >
            {continueLabel}
          </Link>
          <Link
            href="/account"
            className="flex-1 border border-zinc-200 bg-transparent text-zinc-600 px-6 py-3 text-[0.65rem] tracking-widest uppercase hover:border-zinc-400 hover:text-zinc-900 transition-colors duration-300 text-center whitespace-nowrap"
          >
            My Account
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm">
        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[0.6rem] font-medium transition-colors duration-300 ${
                    step > s.n
                      ? "bg-zinc-900 text-white"
                      : step === s.n
                        ? "border border-zinc-900 text-zinc-900"
                        : "border border-zinc-200 text-zinc-300"
                  }`}
                >
                  {step > s.n ? (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M2 5l2.5 2.5L8 3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    s.n
                  )}
                </div>
                <span
                  className={`text-[0.55rem] tracking-widest uppercase transition-colors duration-300 ${
                    step === s.n ? "text-zinc-900" : "text-zinc-300"
                  }`}
 >
 {s.label}
 </span>
 </div>
 {i < STEPS.length - 1 && (
 <div
 className={`flex-1 h-px mx-2 mb-4 transition-colors duration-300 ${
                    step > s.n ? "bg-zinc-400" : "bg-zinc-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── Step 1: Account ── */}
        {step === 1 && step1Phase === "email" && (
          <form onSubmit={handleSendSignupCode} className="flex flex-col gap-4">
            <div className="mb-2">
              <p className="text-zinc-500 text-[0.65rem] tracking-[0.25em] uppercase mb-1">
                Step 1 of 3
              </p>
              <h1 className="text-2xl font-light tracking-tight">
                Create Your Account
              </h1>
              <p className="text-zinc-500 text-sm mt-2">
                Verify your email with a one-time code.
              </p>
            </div>

            <Field label="Email Address" error={errors.email}>
              <input
                type="email"
                value={email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className={inputCls}
              />
            </Field>

            <div className="flex flex-col gap-1">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div
                  onClick={() => setField("agreed", !agreed)}
                  className={`mt-0.5 w-4 h-4 shrink-0 border flex items-center justify-center transition-colors duration-200 ${
                    agreed ? "border-zinc-900 bg-zinc-900" : "border-zinc-300"
                  }`}
                >
                  {agreed && (
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M1.5 4l2 2L6.5 2"
                        stroke="black"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-zinc-600 text-xs leading-relaxed">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-zinc-900 underline underline-offset-2"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-zinc-900 underline underline-offset-2"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.agreed && (
                <p className="text-red-400 text-[0.65rem]">{errors.agreed}</p>
              )}
            </div>

            <Button type="submit" disabled={otpSending} className="mt-2 w-full">
              {otpSending ? (
                <Loader2 size={16} className="animate-spin" aria-hidden />
              ) : (
                "Send Verification Code"
              )}
            </Button>

            <p className="text-center text-zinc-400 text-xs mt-2">
              Already have an account?{" "}
              <Link
                href={loginHref}
                className="text-zinc-900 underline underline-offset-4 hover:opacity-70"
              >
                Sign in
              </Link>
            </p>
          </form>
        )}

        {step === 1 && step1Phase === "otp" && (
          <form onSubmit={handleVerifySignupCode} className="flex flex-col gap-5">
            <div className="mb-2">
              <p className="text-zinc-500 text-[0.65rem] tracking-[0.25em] uppercase mb-1">
                Step 1 of 3
              </p>
              <h1 className="text-2xl font-light tracking-tight">
                Verify Your Email
              </h1>
              <p className="text-zinc-500 text-sm mt-2">
                Enter the code we sent to {email}.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <label
                htmlFor="signup-otp"
                className="text-[0.65rem] tracking-widest uppercase text-zinc-500 text-center"
              >
                One-Time Code
              </label>
              <OtpField
                id="signup-otp"
                value={otp}
                onChange={setOtp}
                disabled={otpSending}
              />
              {errors.otp && (
                <p className="text-red-400 text-[0.65rem] text-center">
                  {errors.otp}
                </p>
              )}
            </div>

            <Button type="submit" disabled={otpSending} className="w-full">
              {otpSending ? (
                <Loader2 size={16} className="animate-spin" aria-hidden />
              ) : (
                "Verify & Continue"
              )}
            </Button>

            <div className="flex flex-col items-center gap-3 text-center">
              <button
                type="button"
                onClick={async () => {
                  clearErrors();
                  setOtpSending(true);
                  const result = await mockSendOtp(email.trim(), "signup");
                  setOtpSending(false);
                  if (!result.success) {
                    setErrors({
                      otp:
                        result.message ||
                        "Could not resend your code. Please try again.",
                    });
                    return;
                  }
                  setOtp("");
                }}
                disabled={otpSending}
                className="text-[0.6rem] tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors duration-200 disabled:opacity-50"
              >
                Resend Code
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep1Phase("email");
                  setOtp("");
                  clearErrors();
                }}
                className="text-[0.6rem] tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors duration-200"
              >
                Use a Different Email
              </button>
            </div>
          </form>
        )}

        {/* ── Step 2: About You ── */}
        {step === 2 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              next();
            }}
            className="flex flex-col gap-4"
          >
            <div className="mb-2">
              <p className="text-zinc-500 text-[0.65rem] tracking-[0.25em] uppercase mb-1">
                Step 2 of 3
              </p>
              <h1 className="text-2xl font-light tracking-tight">About You</h1>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="First Name" error={errors.firstName}>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setField("firstName", e.target.value)}
                  placeholder="Kwame"
                  autoComplete="given-name"
                  className={inputCls}
                />
              </Field>
              <Field label="Last Name" error={errors.lastName}>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setField("lastName", e.target.value)}
                  placeholder="Mensah"
                  autoComplete="family-name"
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="Phone Number" error={errors.phone}>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  const formatted = formatPhoneInput(e.target.value);
                  setField("phone", formatted);
                  if (sameAsPhone) setField("whatsapp", formatted);
                }}
                placeholder="+233 059 207 8493"
                autoComplete="tel"
                className={inputCls}
              />
            </Field>

            <div className="flex gap-3 mt-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={prevStep}
              >
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Continue
              </Button>
            </div>
          </form>
        )}

        {/* ── Step 3: Delivery ── */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="mb-2">
              <p className="text-zinc-500 text-[0.65rem] tracking-[0.25em] uppercase mb-1">
                Step 3 of 3
              </p>
              <h1 className="text-2xl font-light tracking-tight">
                Delivery Details
              </h1>
              <p className="text-zinc-500 text-xs mt-1.5 leading-relaxed">
                We ship across West Africa and beyond. This helps us get your
                order to you faster.
              </p>
            </div>

            {/* Country */}
            <Field label="Country">
              <div className="relative">
                <select
                  value={country}
                  onChange={(e) => {
                    setField("country", e.target.value);
                    setField("region", "");
                  }}
                  className={`${selectCls} w-full`}
                >
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  width="10"
                  height="10"
                  viewBox="0 0 8 8"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M1 2.5l3 3 3-3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </Field>

            {/* Region */}
            <Field label="Region / State" error={errors.region}>
              <div className="relative">
                <select
                  value={region}
                  onChange={(e) => setField("region", e.target.value)}
                  className={`${selectCls} w-full`}
                >
                  <option value="">Select region…</option>
                  {regions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  width="10"
                  height="10"
                  viewBox="0 0 8 8"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M1 2.5l3 3 3-3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </Field>

            {/* City */}
            <Field label="City / Town" error={errors.city}>
              <input
                type="text"
                value={city}
                onChange={(e) => setField("city", e.target.value)}
                placeholder="e.g. Accra"
                autoComplete="address-level2"
                className={inputCls}
              />
            </Field>

            {/* Address */}
            <Field label="Delivery Address" error={errors.address}>
              <input
                type="text"
                value={address}
                onChange={(e) => setField("address", e.target.value)}
                placeholder="Street name, house number, area"
                autoComplete="street-address"
                className={inputCls}
              />
            </Field>

            {/* Landmark - important in West Africa */}
            <Field label="Nearest Landmark (optional)">
              <input
                type="text"
                value={landmark}
                onChange={(e) => setField("landmark", e.target.value)}
                placeholder="e.g. Near Total filling station, Osu"
                autoComplete="off"
                className={inputCls}
              />
              <p className="text-zinc-400 text-[0.6rem] leading-relaxed">
                Helps our delivery team find you faster. Especially useful where
                street addresses are not exact.
              </p>
            </Field>

            <Field
              label="Google Maps Link (optional)"
              error={errors.googleMapsLink}
            >
              <input
                type="url"
                value={googleMapsLink}
                onChange={(e) => setField("googleMapsLink", e.target.value)}
                placeholder="https://maps.app.goo.gl/..."
                autoComplete="off"
                className={inputCls}
              />
              <p className="text-zinc-400 text-[0.6rem] leading-relaxed">
                Optional for now. You can add it at checkout so our riders can
                find your exact location.
              </p>
            </Field>

            {/* WhatsApp */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setField("sameAsPhone", !sameAsPhone)}
                  className={`w-4 h-4 shrink-0 border flex items-center justify-center transition-colors duration-200 ${
                    sameAsPhone
                      ? "border-zinc-900 bg-zinc-900"
                      : "border-zinc-300"
                  }`}
                >
                  {sameAsPhone && (
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M1.5 4l2 2L6.5 2"
                        stroke="black"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-zinc-600 text-xs">
                  My WhatsApp number is the same as my phone number
                </span>
              </label>

              {!sameAsPhone && (
                <Field label="WhatsApp Number" error={errors.whatsapp}>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) =>
                      setField("whatsapp", formatPhoneInput(e.target.value))
                    }
                    placeholder="+233 059 207 8493"
                    autoComplete="off"
                    className={inputCls}
                  />
                  <p className="text-zinc-400 text-[0.6rem]">
                    We send real-time delivery updates via WhatsApp.
                  </p>
                </Field>
              )}
            </div>

            <div className="flex gap-3 mt-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={prevStep}
              >
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <Loader2 size={16} className="animate-spin" aria-hidden />
                ) : (
                  "Finish"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
