"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import {
  customerStatusCopy,
  formatTrackingDate,
  formatTrackingDateTime,
  fulfillmentStageIndex,
  fulfillmentStages,
  lookupTrackingNumber,
  statusConfig,
  trackingPath,
  type TrackingResult,
  type TrackingStatus,
} from "@/lib/tracking";
import { formatPrice } from "@/lib/currency";
import { Button } from "@/components/ui/button";

type TrackingLookupProps = {
  initialTrackingNumber?: string;
};

function FulfillmentTimeline({ status }: { status: TrackingStatus }) {
  const currentIdx = fulfillmentStageIndex(status);
  const isException = status === "exception";

  return (
    <div className="w-full">
      <ol className="flex items-start justify-between gap-1">
        {fulfillmentStages.map((stage, i) => {
          const isDone = !isException && currentIdx >= 0 && i < currentIdx;
          const isCurrent = !isException && i === currentIdx;
          const isUpcoming = isException || currentIdx < 0 || i > currentIdx;
          const label =
            i === 0 && status === "pre_order" ? "Pre-order" : stage.label;

          return (
            <li
              key={stage.key}
              className="relative flex flex-1 flex-col items-center text-center min-w-0"
            >
              {i < fulfillmentStages.length - 1 && (
                <span
                  aria-hidden
                  className={`absolute top-3.5 left-[calc(50%+14px)] right-[calc(-50%+14px)] h-px ${
                    isDone ? "bg-zinc-900" : "bg-zinc-200"
                  }`}
                />
              )}
              <span
                className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                  isDone
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : isCurrent
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-dashed border-zinc-300 bg-white text-transparent"
                }`}
              >
                {isDone || isCurrent ? <Check size={14} strokeWidth={2.5} /> : null}
              </span>
              <p
                className={`mt-2.5 text-[0.65rem] leading-tight tracking-wide ${
                  isCurrent
                    ? "text-zinc-900 font-medium"
                    : isDone
                      ? "text-zinc-600"
                      : isUpcoming
                        ? "text-zinc-400"
                        : "text-zinc-400"
                }`}
              >
                {label}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function TrackingLookup({
  initialTrackingNumber = "",
}: TrackingLookupProps) {
  const router = useRouter();
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lookedUpKey = useRef<string | null>(null);

  const runLookup = async (value: string) => {
    const key = value.trim();
    if (!key) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const data = await lookupTrackingNumber(key);
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not look up this tracking number.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const key = initialTrackingNumber.trim();
    if (!key) return;
    const normalized = key.toUpperCase();
    if (lookedUpKey.current === normalized) return;
    lookedUpKey.current = normalized;
    setTrackingNumber(key);
    void runLookup(key);
  }, [initialTrackingNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const key = trackingNumber.trim().toUpperCase();
    if (!key) return;
    if (key !== initialTrackingNumber.trim().toUpperCase()) {
      router.push(trackingPath(key));
      return;
    }
    await runLookup(key);
  };

  const statusCfg =
    result?.found && result.status
      ? (statusConfig[result.status] ?? statusConfig.exception)
      : null;
  const statusCopy =
    result?.found && result.status
      ? (customerStatusCopy[result.status] ?? customerStatusCopy.exception)
      : null;

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 px-6 py-28 md:px-10">
      <div className="max-w-360 mx-auto">
        <div className="mb-10">
          <p className="text-zinc-500 text-[0.65rem] tracking-[0.25em] uppercase mb-3">
            Order Status
          </p>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-3">
            Track Your Order
          </h1>
          <p className="text-zinc-600 text-sm leading-relaxed max-w-md">
            Enter the tracking number from your confirmation email to see the
            latest status of your shipment.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 mb-12 max-w-xl"
        >
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => {
              setTrackingNumber(e.target.value);
              setResult(null);
              setError(null);
            }}
            placeholder="e.g. UNAP-000052"
            className="flex-1 bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-5 py-3.5 text-sm tracking-wide focus:outline-none focus:border-zinc-400 transition-colors duration-200"
            autoComplete="off"
          />
          <Button type="submit" variant="outline" disabled={loading}>
            {loading ? "Looking up…" : "Track Order"}
          </Button>
        </form>

        {error && (
          <div className="border border-red-200 bg-red-50 p-8 max-w-xl mb-8">
            <p className="text-zinc-900 font-light text-lg mb-2">
              Lookup unavailable
            </p>
            <p className="text-zinc-600 text-sm leading-relaxed">{error}</p>
          </div>
        )}

        {result && !result.found && (
          <div className="border border-zinc-200 bg-white p-8 max-w-xl">
            <p className="text-zinc-900 font-light text-lg mb-2">
              No shipment found
            </p>
            <p className="text-zinc-600 text-sm leading-relaxed">
              We couldn&apos;t find a shipment for{" "}
              <span className="text-zinc-900 font-medium">
                {result.trackingNumber}
              </span>
              . Use a tracking number like{" "}
              <span className="text-zinc-900 font-medium">UNAP-000052</span>{" "}
              from your confirmation email.
            </p>
          </div>
        )}

        {result?.found && statusCfg && statusCopy && (
          <div className="flex flex-col gap-4">
            {/* Fulfillment timeline */}
            <section className="border border-zinc-200 bg-white p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                <div>
                  <p className="text-[0.6rem] tracking-widest uppercase text-zinc-500 mb-2">
                    Fulfillment
                  </p>
                  <p className="text-zinc-500 text-sm mb-1">Your order is</p>
                  <p
                    className={`text-3xl md:text-4xl font-light tracking-tight ${statusCfg.color}`}
                  >
                    {statusCopy.headline}
                  </p>
                  <p className="text-zinc-600 text-sm mt-3 max-w-lg leading-relaxed">
                    {statusCopy.detail}
                  </p>
                  {result.estimatedDelivery &&
                    result.status !== "delivered" &&
                    result.status !== "exception" && (
                      <p className="text-zinc-600 text-sm mt-2">
                        Estimated arrival:{" "}
                        <span className="text-zinc-900 font-medium">
                          {formatTrackingDate(result.estimatedDelivery)}
                        </span>
                      </p>
                    )}
                  {result.status === "delivered" && result.estimatedDelivery && (
                    <p className="text-zinc-600 text-sm mt-2">
                      Delivered on{" "}
                      <span className="text-zinc-900 font-medium">
                        {formatTrackingDate(result.estimatedDelivery)}
                      </span>
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`w-2 h-2 rounded-full ${statusCfg.dot}`}
                  />
                  <span className={`text-sm font-medium ${statusCfg.color}`}>
                    {statusCopy.headline}
                  </span>
                </div>
              </div>

              <FulfillmentTimeline status={result.status} />

              {result.status === "exception" && (
                <div className="mt-6 border border-red-200 bg-red-50 px-5 py-4">
                  <p className="text-red-800 text-sm font-medium mb-1">
                    There is an issue with this shipment
                  </p>
                  <p className="text-red-700/80 text-xs leading-relaxed">
                    Progress is paused. Check the tracking history below or
                    contact support with your tracking number.
                  </p>
                </div>
              )}
            </section>

            <div className="grid md:grid-cols-[280px_1fr] gap-4">
              {/* Meta sidebar */}
              <aside className="border border-zinc-200 bg-white flex flex-col divide-y divide-zinc-100">
                <div className="px-6 py-5">
                  <p className="text-[0.6rem] tracking-widest uppercase text-zinc-500 mb-1">
                    Tracking No.
                  </p>
                  <p className="text-zinc-900 text-sm font-medium mt-1 font-mono">
                    {result.trackingNumber}
                  </p>
                  {result.carrier && (
                    <p className="text-zinc-500 text-xs mt-1">{result.carrier}</p>
                  )}
                </div>

                {(result.customerName || result.customerContact) && (
                  <div className="px-6 py-5">
                    <p className="text-[0.6rem] tracking-widest uppercase text-zinc-500 mb-3">
                      Customer
                    </p>
                    {result.customerName && (
                      <p className="text-zinc-900 text-sm">{result.customerName}</p>
                    )}
                    {result.customerContact && (
                      <p className="text-zinc-600 text-xs mt-1">
                        {result.customerContact}
                      </p>
                    )}
                  </div>
                )}

                {result.deliveryAddress && (
                  <div className="px-6 py-5">
                    <p className="text-[0.6rem] tracking-widest uppercase text-zinc-500 mb-3">
                      Delivery Address
                    </p>
                    <p className="text-zinc-900 text-sm leading-relaxed">
                      {result.deliveryAddress}
                    </p>
                  </div>
                )}

                {result.orderDate && (
                  <div className="px-6 py-5">
                    <p className="text-[0.6rem] tracking-widest uppercase text-zinc-500 mb-3">
                      Order Date
                    </p>
                    <p className="text-zinc-900 text-sm">
                      {formatTrackingDateTime(result.orderDate)}
                    </p>
                  </div>
                )}

                {result.lastUpdated && (
                  <div className="px-6 py-5">
                    <p className="text-[0.6rem] tracking-widest uppercase text-zinc-500 mb-1">
                      Last Updated
                    </p>
                    <p className="text-zinc-600 text-xs mt-1">
                      {formatTrackingDateTime(result.lastUpdated)}
                    </p>
                  </div>
                )}
              </aside>

              {/* Items + history */}
              <div className="flex flex-col gap-4">
                {result.orderItems.length > 0 && (
                  <section className="border border-zinc-200 bg-white p-6 md:px-8 md:py-6">
                    <p className="text-[0.6rem] tracking-widest uppercase text-zinc-500 mb-5">
                      Items ({result.orderItems.length})
                    </p>
                    <div className="flex flex-col gap-3">
                      {result.orderItems.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between gap-4 border border-zinc-100 bg-zinc-50 px-5 py-4"
                        >
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <p className="text-zinc-900 text-sm">{item.name}</p>
                            {item.variant && (
                              <p className="text-zinc-500 text-xs">
                                {item.variant}
                              </p>
                            )}
                            <p className="text-zinc-400 text-xs mt-1">
                              Qty: {item.qty}
                            </p>
                          </div>
                          <p className="text-zinc-900 text-sm font-medium shrink-0">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {result.events.length > 1 && (
                  <section className="border border-zinc-200 bg-white p-6 md:px-8 md:py-6">
                    <p className="text-[0.6rem] tracking-widest uppercase text-zinc-500 mb-8">
                      Updates
                    </p>
                    <ol className="relative border-s border-zinc-200">
                      {result.events.map((ev, i) => (
                        <li key={i} className="mb-8 ms-8 last:mb-0">
                          <span
                            className={`absolute flex items-center justify-center w-7 h-7 rounded-full -start-3.5 ring-4 ring-white ${
                              i === 0 ? statusCfg.dot : "bg-zinc-200"
                            }`}
                          >
                            {i === 0 ? (
                              <span className="w-2 h-2 rounded-full bg-white" />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                            )}
                          </span>

                          <time className="inline-block bg-zinc-50 border border-zinc-200 text-zinc-600 text-[0.6rem] font-medium tracking-widest uppercase px-2 py-0.5 mb-2">
                            {ev.date
                              ? `${formatTrackingDate(ev.date)} · ${ev.time}`
                              : ev.time}
                          </time>

                          <h4
                            className={`text-sm font-medium mb-0.5 ${
                              i === 0 ? "text-zinc-900" : "text-zinc-700"
                            }`}
                          >
                            {ev.description}
                          </h4>
                          {ev.location && (
                            <p className="text-zinc-400 text-xs">
                              {ev.location}
                            </p>
                          )}
                        </li>
                      ))}
                    </ol>
                  </section>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
