"use client";

import Link from "next/link";
import {
  countries,
  regionsByCountry,
  mockSignup,
  type SignupData,
} from "@/lib/auth";
import { useOnboardingStore } from "@/lib/stores/onboarding-store";

const inputCls =
  "bg-white/5 border border-white/20 text-white placeholder-white/30 px-4 py-3 text-sm focus:outline-none focus:border-white/60 transition-colors duration-200";
const selectCls =
  "bg-[#0a0a0a] border border-white/20 text-white px-4 py-3 text-sm focus:outline-none focus:border-white/60 transition-colors duration-200 appearance-none";

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
      <label className="text-[0.65rem] tracking-widest uppercase text-white/60">
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
  const {
    step,
    loading,
    errors,
    email,
    password,
    confirmPassword,
    agreed,
    showPassword,
    firstName,
    lastName,
    phone,
    country,
    region,
    city,
    address,
    landmark,
    whatsapp,
    sameAsPhone,
    setField,
    setErrors,
    clearErrors,
    setLoading,
    nextStep,
    prevStep,
  } = useOnboardingStore();

  const regions = regionsByCountry[country] ?? [];

  /* ── Validation ── */
  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!email) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email.";
    if (!password) e.password = "Password is required.";
    else if (password.length < 8) e.password = "Minimum 8 characters.";
    if (password !== confirmPassword)
      e.confirmPassword = "Passwords do not match.";
    if (!agreed) e.agreed = "You must agree to continue.";
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
    if (!sameAsPhone && !whatsapp.trim())
      e.whatsapp = "WhatsApp number is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    clearErrors();
    if (step === 1 && validateStep1()) nextStep();
    if (step === 2 && validateStep2()) nextStep();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;
    setLoading(true);
    const data: SignupData = {
      email,
      password,
      firstName,
      lastName,
      phone,
      country,
      region,
      city,
      address,
      landmark,
      whatsapp: sameAsPhone ? phone : whatsapp,
    };
    await mockSignup(data);
    setLoading(false);
    nextStep();
  };

  /* ── Welcome screen ── */
  if (step === 4) {
    return (
      <main className="dark min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-20 text-center">
        <p className="text-white/40 text-[0.65rem] tracking-[0.3em] uppercase mb-4">
          You&apos;re one of us now
        </p>
        <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
          Welcome, {firstName}.
        </h1>
        <p className="text-white/60 text-sm max-w-sm leading-relaxed mb-10">
          The rules were never made for people like us. Shop freely, move
          boldly. We handle the rest.
        </p>

        {/* Perks */}
        <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/15 w-full max-w-sm mb-10 text-left">
          {[
            { label: "WhatsApp Updates", desc: "Real-time delivery alerts" },
            { label: "Ships Everywhere", desc: "Ghana, Nigeria and beyond" },
            { label: "Early Access", desc: "New drops before anyone else" },
            { label: "Inner Circle", desc: "Exclusive members only offers" },
          ].map((p) => (
            <div key={p.label} className="bg-black px-5 py-4">
              <p className="text-white text-xs font-medium mb-0.5">{p.label}</p>
              <p className="text-white/40 text-[0.65rem]">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3 w-full max-w-sm">
          <Link
            href="/collections"
            className="flex-1 border border-white/40 bg-transparent text-white px-6 py-3 text-[0.65rem] tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-300 text-center whitespace-nowrap"
          >
            Shop Now
          </Link>
          <Link
            href="/account"
            className="flex-1 border border-white/20 bg-transparent text-white/70 px-6 py-3 text-[0.65rem] tracking-widest uppercase hover:border-white/50 hover:text-white transition-colors duration-300 text-center whitespace-nowrap"
          >
            My Account
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="dark min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm">
        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[0.6rem] font-medium transition-colors duration-300 ${
                    step > s.n
                      ? "bg-white text-black"
                      : step === s.n
                        ? "border border-white text-white"
                        : "border border-white/20 text-white/30"
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
                    step === s.n ? "text-white" : "text-white/30"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px mx-2 mb-4 transition-colors duration-300 ${
                    step > s.n ? "bg-white/40" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── Step 1: Account ── */}
        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              next();
            }}
            className="flex flex-col gap-4"
          >
            <div className="mb-2">
              <p className="text-white/50 text-[0.65rem] tracking-[0.25em] uppercase mb-1">
                Step 1 of 3
              </p>
              <h1 className="text-2xl font-light tracking-tight">
                Create Your Account
              </h1>
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

            <Field label="Password" error={errors.password}>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setField("password", e.target.value)}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  className={`${inputCls} w-full pr-16`}
                />
                <button
                  type="button"
                  onClick={() => setField("showPassword", !showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[0.55rem] tracking-widest uppercase text-white/40 hover:text-white"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </Field>

            <Field label="Confirm Password" error={errors.confirmPassword}>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setField("confirmPassword", e.target.value)}
                placeholder="Re-enter password"
                autoComplete="new-password"
                className={inputCls}
              />
            </Field>

            {/* Terms */}
            <div className="flex flex-col gap-1">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div
                  onClick={() => setField("agreed", !agreed)}
                  className={`mt-0.5 w-4 h-4 shrink-0 border flex items-center justify-center transition-colors duration-200 ${
                    agreed ? "border-white bg-white" : "border-white/30"
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
                <span className="text-white/60 text-xs leading-relaxed">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-white underline underline-offset-2"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-white underline underline-offset-2"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.agreed && (
                <p className="text-red-400 text-[0.65rem]">{errors.agreed}</p>
              )}
            </div>

            <button
              type="submit"
              className="mt-2 w-full border border-white/40 bg-transparent text-white px-8 py-3.5 text-[0.7rem] tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-300"
            >
              Continue
            </button>

            <p className="text-center text-white/40 text-xs mt-2">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-white underline underline-offset-4 hover:opacity-70"
              >
                Sign in
              </Link>
            </p>
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
              <p className="text-white/50 text-[0.65rem] tracking-[0.25em] uppercase mb-1">
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
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 border border-white/20 bg-transparent text-white/70 px-8 py-3.5 text-[0.7rem] tracking-widest uppercase hover:border-white/50 hover:text-white transition-colors duration-300"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 border border-white/40 bg-transparent text-white px-8 py-3.5 text-[0.7rem] tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-300"
              >
                Continue
              </button>
            </div>
          </form>
        )}

        {/* ── Step 3: Delivery ── */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="mb-2">
              <p className="text-white/50 text-[0.65rem] tracking-[0.25em] uppercase mb-1">
                Step 3 of 3
              </p>
              <h1 className="text-2xl font-light tracking-tight">
                Delivery Details
              </h1>
              <p className="text-white/50 text-xs mt-1.5 leading-relaxed">
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
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40"
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
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40"
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
              <p className="text-white/30 text-[0.6rem] leading-relaxed">
                Helps our delivery team find you faster. Especially useful where
                street addresses are not exact.
              </p>
            </Field>

            {/* WhatsApp */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setField("sameAsPhone", !sameAsPhone)}
                  className={`w-4 h-4 shrink-0 border flex items-center justify-center transition-colors duration-200 ${
                    sameAsPhone ? "border-white bg-white" : "border-white/30"
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
                <span className="text-white/60 text-xs">
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
                  <p className="text-white/50 text-[0.6rem]">
                    We send real-time delivery updates via WhatsApp.
                  </p>
                </Field>
              )}
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 border border-white/20 bg-transparent text-white/70 px-8 py-3.5 text-[0.7rem] tracking-widest uppercase hover:border-white/50 hover:text-white transition-colors duration-300"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 border border-white/40 bg-transparent text-white px-8 py-3.5 text-[0.7rem] tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "Creating…" : "Finish"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
