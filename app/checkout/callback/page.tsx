"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Legacy Paystack return path. Canonical landing is `/order-confirmation`.
 */
function CallbackRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const qs = searchParams.toString();
    router.replace(qs ? `/order-confirmation?${qs}` : "/order-confirmation");
  }, [router, searchParams]);

  return (
    <main className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center px-6 py-20 text-center">
      <p className="eyebrow text-zinc-500 mb-3">Payment</p>
      <h1 className="text-2xl font-light tracking-tight">
        Verifying your payment…
      </h1>
    </main>
  );
}

export default function CheckoutCallbackPage() {
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
      <CallbackRedirect />
    </Suspense>
  );
}
