"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useCartStore } from "@/lib/stores/cart-store";
import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { Button, buttonVariants } from "@/components/ui/button";

type CheckoutStep = "details" | "review" | "confirmed";

const PAYMENT_METHODS = [
  { id: "momo", label: "Mobile Money" },
  { id: "card", label: "Card (Visa / Mastercard)" },
  { id: "cash", label: "Pay on Delivery" },
];

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
      <label className="text-[0.6rem] tracking-widest uppercase text-zinc-500">
        {label}
      </label>
      {children}
      {error && <p className="text-red-400 text-[0.6rem]">{error}</p>}
    </div>
  );
}

const inputCls =
  "bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 text-sm focus:outline-none focus:border-zinc-400 transition-colors duration-200 w-full";

function generateOrderId() {
  return (
    "UNAP-" +
    Date.now().toString(36).toUpperCase() +
    Math.random().toString(36).slice(2, 5).toUpperCase()
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalItems, totalPrice, clearCart } = useCartStore();
  const onboarding = useOnboardingStore();

  const [step, setStep] = useState<CheckoutStep>("details");
  const [orderId] = useState(generateOrderId);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("momo");

  /* Pre-fill from onboarding store if available */
  const [form, setForm] = useState({
    firstName: onboarding.firstName || "",
    lastName: onboarding.lastName || "",
    email: onboarding.email || "",
    phone: onboarding.phone !== "+" ? onboarding.phone : "",
    address: onboarding.address || "",
    city: onboarding.city || "",
    region: onboarding.region || "",
    country: onboarding.country || "Ghana",
    whatsapp: onboarding.sameAsPhone
      ? onboarding.phone !== "+"
        ? onboarding.phone
        : ""
      : onboarding.whatsapp !== "+"
        ? onboarding.whatsapp
        : "",
    notes: "",
  });

  const setFormField = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const count = totalItems();
  const subtotal = totalPrice();

  /* Redirect empty cart */
  if (count === 0 && step !== "confirmed") {
    return (
      <main className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center gap-6 px-6">
        <p className="text-zinc-500 text-sm">Your cart is empty.</p>
        <Link href="/collections" className={buttonVariants({ variant: "outline" })}>
          Shop Collections
        </Link>
      </main>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setLoading(true);
    /* Simulate API call */
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    clearCart();
    setStep("confirmed");
  };

  /* ── Confirmed Screen ── */
  if (step === "confirmed") {
    return (
      <main className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-6 max-w-sm"
        >
          {/* Checkmark */}
          <div className="w-16 h-16 border border-zinc-200 flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>

          <p className="eyebrow text-zinc-500">Order Placed</p>
          <h1 className="text-2xl font-light tracking-tight">
            You&apos;re in the system.
          </h1>
          <p className="text-zinc-600 text-sm leading-relaxed">
            Order <span className="text-zinc-900 font-medium">{orderId}</span>{" "}
            is confirmed. We&apos;ll send updates to{" "}
            <span className="text-zinc-900">{form.email}</span> and WhatsApp.
          </p>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Expect delivery in 3–7 business days depending on your location.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
            <Link href="/collections" className={buttonVariants({ variant: "outline", size: "sm" }) + " flex-1 justify-center"}>
              Keep Shopping
            </Link>
            <Link href="/tracking" className={buttonVariants({ variant: "secondary", size: "sm" }) + " flex-1 justify-center"}>
              Track Order
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900 pt-24 pb-32">
      <div className="max-w-360 mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-10">
          <p className="eyebrow text-zinc-500 mb-2">
            <Link
              href="/cart"
              className="hover:text-zinc-900 transition-colors duration-200"
            >
              Cart
            </Link>
            <ChevronRight
              size={10}
              className="inline mx-2 opacity-40"
              aria-hidden
            />
            Checkout
          </p>
          <h1 className="text-3xl font-light tracking-tight">
            Complete Your Order
          </h1>
        </div>

        {/* Step tabs */}
        <div className="flex items-center gap-2 mb-10 text-[0.6rem] tracking-widest uppercase">
          <button
            onClick={() => step === "review" && setStep("details")}
            className={
              step === "details"
                ? "text-zinc-900"
                : "text-zinc-400 hover:text-zinc-900 transition-colors duration-200"
            }
          >
            1. Details
          </button>
          <ChevronRight size={10} className="text-zinc-300" aria-hidden />
          <span
            className={step === "review" ? "text-zinc-900" : "text-zinc-300"}
          >
            2. Review
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ── Left: Form / Review ── */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === "details" && (
                <motion.form
                  key="details"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (validate()) setStep("review");
                  }}
                  className="flex flex-col gap-5"
                >
                  <p className="eyebrow text-zinc-500 mb-1">
                    Contact & Delivery
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="First Name" error={errors.firstName}>
                      <input
                        type="text"
                        value={form.firstName}
                        onChange={(e) =>
                          setFormField("firstName", e.target.value)
                        }
                        placeholder="Kwame"
                        autoComplete="given-name"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Last Name" error={errors.lastName}>
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={(e) =>
                          setFormField("lastName", e.target.value)
                        }
                        placeholder="Mensah"
                        autoComplete="family-name"
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  <Field label="Email" error={errors.email}>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setFormField("email", e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={inputCls}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Phone" error={errors.phone}>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setFormField("phone", e.target.value)}
                        placeholder="+233 055 000 0000"
                        autoComplete="tel"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="WhatsApp (optional)">
                      <input
                        type="tel"
                        value={form.whatsapp}
                        onChange={(e) =>
                          setFormField("whatsapp", e.target.value)
                        }
                        placeholder="Same as phone"
                        autoComplete="off"
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  <Field label="Delivery Address" error={errors.address}>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => setFormField("address", e.target.value)}
                      placeholder="Street name, house number"
                      autoComplete="street-address"
                      className={inputCls}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="City" error={errors.city}>
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => setFormField("city", e.target.value)}
                        placeholder="Accra"
                        autoComplete="address-level2"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Region / State">
                      <input
                        type="text"
                        value={form.region}
                        onChange={(e) => setFormField("region", e.target.value)}
                        placeholder="Greater Accra"
                        autoComplete="address-level1"
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  <Field label="Country">
                    <input
                      type="text"
                      value={form.country}
                      onChange={(e) => setFormField("country", e.target.value)}
                      placeholder="Ghana"
                      autoComplete="country-name"
                      className={inputCls}
                    />
                  </Field>

                  <Field label="Order Notes (optional)">
                    <textarea
                      value={form.notes}
                      onChange={(e) => setFormField("notes", e.target.value)}
                      placeholder="Any special instructions for your delivery"
                      autoComplete="off"
                      rows={3}
                      className="bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 text-sm focus:outline-none focus:border-zinc-400 transition-colors duration-200 w-full resize-none"
                    />
                  </Field>

                  {/* Payment Method */}
                  <div className="flex flex-col gap-3 mt-2">
                    <p className="eyebrow text-zinc-500">Payment Method</p>
                    <div className="flex flex-col gap-2">
                      {PAYMENT_METHODS.map((pm) => (
                        <label
                          key={pm.id}
                          className={`flex items-center gap-4 border px-4 py-3 cursor-pointer transition-colors duration-200 ${
                            paymentMethod === pm.id
                              ? "border-zinc-900 bg-zinc-50"
                              : "border-zinc-200 hover:border-zinc-400"
                          }`}
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              paymentMethod === pm.id
                                ? "border-zinc-900"
                                : "border-zinc-300"
                            }`}
                          >
                            {paymentMethod === pm.id && (
                              <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                            )}
                          </div>
                          <input
                            type="radio"
                            name="payment"
                            value={pm.id}
                            checked={paymentMethod === pm.id}
                            onChange={() => setPaymentMethod(pm.id)}
                            className="sr-only"
                          />
                          <span className="text-sm text-zinc-900">
                            {pm.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" className="mt-2 w-full">
                    Review Order
                  </Button>
                </motion.form>
              )}

              {step === "review" && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-6"
                >
                  <p className="eyebrow text-zinc-500 mb-1">Review & Confirm</p>

                  {/* Delivery Details */}
                  <div className="border border-zinc-100 p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <p className="eyebrow text-zinc-500">Delivery To</p>
                      <button
                        onClick={() => setStep("details")}
                        className="text-[0.6rem] tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors duration-200"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="text-sm text-zinc-700 leading-relaxed">
                      <p>
                        {form.firstName} {form.lastName}
                      </p>
                      <p className="text-zinc-500">{form.email}</p>
                      <p className="text-zinc-500">{form.phone}</p>
                      <p className="text-zinc-500 mt-1">
                        {form.address}, {form.city}
                        {form.region ? `, ${form.region}` : ""}, {form.country}
                      </p>
                    </div>
                    <div className="border-t border-zinc-100 pt-3">
                      <p className="eyebrow text-zinc-500 mb-1">Payment</p>
                      <p className="text-sm text-zinc-700">
                        {
                          PAYMENT_METHODS.find((p) => p.id === paymentMethod)
                            ?.label
                        }
                      </p>
                    </div>
                    {form.notes && (
                      <div className="border-t border-zinc-100 pt-3">
                        <p className="eyebrow text-zinc-500 mb-1">Notes</p>
                        <p className="text-sm text-zinc-600">{form.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Items */}
                  <div className="flex flex-col gap-px bg-zinc-100">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white flex items-center gap-4 px-5 py-4"
                      >
                        <div className="relative w-12 h-14 shrink-0 overflow-hidden">
                          <Image
                            src={item.img}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-zinc-900 text-sm truncate">
                            {item.name}
                          </p>
                          <p className="text-zinc-500 text-xs mt-0.5">
                            {item.category} · Qty {item.quantity}
                          </p>
                        </div>
                        <p className="text-zinc-900 text-sm shrink-0">
                          US${(item.priceNum * item.quantity).toFixed(0)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button variant="secondary" className="flex-1" onClick={() => setStep("details")}>
                      Back
                    </Button>
                    <Button className="flex-1" onClick={handlePlaceOrder} disabled={loading}>
                      {loading ? "Placing Order…" : "Place Order"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Right: Summary ── */}
          <div className="lg:col-span-1">
            <div className="border border-zinc-100 p-6 flex flex-col gap-5 sticky top-24">
              <p className="eyebrow text-zinc-500">
                Summary ({count} item{count !== 1 ? "s" : ""})
              </p>

              <div className="flex flex-col gap-3 max-h-64 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="relative w-10 h-12 shrink-0 overflow-hidden">
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-zinc-900 text-xs truncate">
                        {item.name}
                      </p>
                      <p className="text-zinc-400 text-[0.6rem]">
                        ×{item.quantity}
                      </p>
                    </div>
                    <p className="text-zinc-900 text-xs shrink-0">
                      US${(item.priceNum * item.quantity).toFixed(0)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-100 pt-4 flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Subtotal</span>
                  <span className="text-zinc-900">
                    US${subtotal.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Shipping</span>
                  <span className="text-zinc-400">TBD</span>
                </div>
                <div className="flex justify-between font-medium mt-1">
                  <span className="text-zinc-900">Total</span>
                  <span className="text-zinc-900">
                    US${subtotal.toFixed(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
