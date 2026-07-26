"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { verifyPayment } from "@/lib/api/orders";
import { useCartStore } from "@/lib/stores/cart-store";
import { buttonVariants } from "@/components/ui/button";

function OrderConfirmationInner() {
  const searchParams = useSearchParams();
  const clearCart = useCartStore((s) => s.clearCart);
  const reference =
    searchParams.get("reference") || searchParams.get("trxref") || "";

  const [status, setStatus] = useState<"loading" | "success" | "failed">(() =>
    reference ? "loading" : "failed",
  );
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!reference) return;

    verifyPayment(reference)
      .then((result) => {
        if (result.success) {
          clearCart();
          setOrderId(result.orderId ?? null);
          setStatus("success");
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"));
  }, [reference, clearCart]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center px-6 py-20 text-center">
        <p className="eyebrow text-zinc-500 mb-3">Payment</p>
        <h1 className="text-2xl font-light tracking-tight">
          Verifying your payment…
        </h1>
      </main>
    );
  }

  if (status === "failed") {
    return (
      <main className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center px-6 py-20 text-center gap-6 max-w-sm mx-auto">
        <p className="eyebrow text-zinc-500">Payment</p>
        <h1 className="text-2xl font-light tracking-tight">
          Payment not confirmed
        </h1>
        <p className="text-zinc-600 text-sm leading-relaxed">
          We could not verify this payment. You can try again from checkout.
        </p>
        <Link href="/checkout" className={buttonVariants()}>
          Back to Checkout
        </Link>
      </main>
    );
  }

  const trackingHref = orderId
    ? `/tracking?q=${encodeURIComponent(orderId)}`
    : "/tracking";

  return (
    <main className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center px-6 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-6 max-w-sm"
      >
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
          {orderId ? (
            <>
              Order <span className="text-zinc-900 font-medium">{orderId}</span>{" "}
              is confirmed. Payment received.
            </>
          ) : (
            "Your order is confirmed. Payment received."
          )}
        </p>
        <p className="text-zinc-400 text-xs leading-relaxed">
          Expect delivery within 48 hours. You can track your order anytime.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
          <Link
            href={trackingHref}
            className={buttonVariants({ size: "sm" }) + " flex-1 justify-center"}
          >
            Track Your Order
          </Link>
          <Link
            href="/collections"
            className={
              buttonVariants({ variant: "outline", size: "sm" }) +
              " flex-1 justify-center"
            }
          >
            Keep Shopping
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center px-6 py-20 text-center">
          <p className="eyebrow text-zinc-500 mb-3">Payment</p>
          <h1 className="text-2xl font-light tracking-tight">
            Verifying your payment…
          </h1>
        </main>
      }
    >
      <OrderConfirmationInner />
    </Suspense>
  );
}
