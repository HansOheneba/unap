"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { verifyPayment } from "@/lib/api/orders";
import { useCartStore } from "@/lib/stores/cart-store";
import { buttonVariants } from "@/components/ui/button";

function CallbackInner() {
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

  return (
    <main className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center px-6 py-20 text-center gap-6 max-w-sm mx-auto">
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
      <p className="eyebrow text-zinc-500">Payment Received</p>
      <h1 className="text-2xl font-light tracking-tight">
        You&apos;re in the system.
      </h1>
      <p className="text-zinc-600 text-sm leading-relaxed">
        {orderId ? (
          <>
            Order <span className="text-zinc-900 font-medium">{orderId}</span>{" "}
            is confirmed.
          </>
        ) : (
          "Your order is confirmed."
        )}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Link
          href="/collections"
          className={
            buttonVariants({ variant: "outline", size: "sm" }) +
            " flex-1 justify-center"
          }
        >
          Keep Shopping
        </Link>
        <Link
          href="/tracking"
          className={
            buttonVariants({ variant: "secondary", size: "sm" }) +
            " flex-1 justify-center"
          }
        >
          Track Order
        </Link>
      </div>
    </main>
  );
}

export default function CheckoutCallbackPage() {
  return (
    <Suspense fallback={null}>
      <CallbackInner />
    </Suspense>
  );
}
