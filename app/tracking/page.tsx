"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TrackingLookup } from "@/components/tracking/tracking-lookup";
import { trackingPath } from "@/lib/tracking";

function TrackingQueryRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.trim();

  useEffect(() => {
    if (!q) return;
    router.replace(trackingPath(q));
  }, [q, router]);

  if (q) {
    return (
      <main className="min-h-screen bg-zinc-50 text-zinc-900 flex items-center justify-center px-6">
        <p className="text-zinc-500 text-sm">Loading tracking…</p>
      </main>
    );
  }

  return <TrackingLookup />;
}

export default function TrackingPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-zinc-50 text-zinc-900 flex items-center justify-center px-6">
          <p className="text-zinc-500 text-sm">Loading…</p>
        </main>
      }
    >
      <TrackingQueryRedirect />
    </Suspense>
  );
}
