"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  lookupTrackingNumber,
  statusConfig,
  trackingPath,
  type TrackingResult,
} from "@/lib/tracking";
import { formatPrice } from "@/lib/currency";

type TrackingLookupProps = {
  initialTrackingNumber?: string;
};

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

  return (
    <main className="min-h-screen bg-white text-zinc-900 px-6 py-28 md:px-10">
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
            className="flex-1 bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-5 py-3.5 text-sm tracking-wide focus:outline-none focus:border-zinc-400 transition-colors duration-200"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={loading}
            className="border border-zinc-900 bg-transparent text-zinc-900 px-8 py-3.5 text-[0.7rem] tracking-widest uppercase hover:bg-zinc-900 hover:text-white transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? "Looking up…" : "Track Order"}
          </button>
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
          <div className="border border-zinc-100 p-8 max-w-xl">
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

        {result?.found && statusCfg && (
          <div className="grid md:grid-cols-[280px_1fr] gap-px bg-zinc-100 border border-zinc-100">
            <div className="bg-white flex flex-col gap-0 divide-y divide-zinc-100">
              <div className="px-7 py-6">
                <p className="text-[0.6rem] tracking-widest uppercase text-zinc-500 mb-1">
                  Current Status
                </p>
                <div
                  className={`flex items-center gap-2 mt-2 ${statusCfg.color}`}
                >
                  <span className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
                  <span className="text-sm font-medium tracking-wide">
                    {result.statusLabel}
                  </span>
                </div>
              </div>

              <div className="px-7 py-6">
                <p className="text-[0.6rem] tracking-widest uppercase text-zinc-500 mb-1">
                  Tracking No.
                </p>
                <p className="text-zinc-900 text-sm font-medium mt-1">
                  {result.trackingNumber}
                </p>
                {result.carrier && (
                  <p className="text-zinc-500 text-xs mt-1">{result.carrier}</p>
                )}
              </div>

              {(result.customerName || result.customerContact) && (
                <div className="px-7 py-6">
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
                <div className="px-7 py-6">
                  <p className="text-[0.6rem] tracking-widest uppercase text-zinc-500 mb-3">
                    Delivery Address
                  </p>
                  <p className="text-zinc-900 text-sm leading-relaxed">
                    {result.deliveryAddress}
                  </p>
                </div>
              )}

              {result.orderDate && (
                <div className="px-7 py-6">
                  <p className="text-[0.6rem] tracking-widest uppercase text-zinc-500 mb-3">
                    Order Date
                  </p>
                  <p className="text-zinc-900 text-sm">{result.orderDate}</p>
                </div>
              )}

              {result.estimatedDelivery && (
                <div className="px-7 py-6">
                  <p className="text-[0.6rem] tracking-widest uppercase text-zinc-500 mb-1">
                    Estimated Delivery
                  </p>
                  <p className="text-zinc-900 text-sm font-medium mt-1">
                    {result.estimatedDelivery}
                  </p>
                </div>
              )}

              {result.lastUpdated && (
                <div className="px-7 py-6">
                  <p className="text-[0.6rem] tracking-widest uppercase text-zinc-500 mb-1">
                    Last Updated
                  </p>
                  <p className="text-zinc-600 text-xs mt-1">
                    {result.lastUpdated}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white flex flex-col divide-y divide-zinc-100">
              <div className="px-8 py-8">
                <p className="text-zinc-500 text-sm mb-1">Your order is</p>
                <p
                  className={`text-4xl md:text-5xl font-light tracking-tight ${statusCfg.color}`}
                >
                  {result.statusLabel}
                </p>
                {result.estimatedDelivery && result.status !== "delivered" && (
                  <p className="text-zinc-600 text-sm mt-3">
                    Estimated arrival:{" "}
                    <span className="text-zinc-900 font-medium">
                      {result.estimatedDelivery}
                    </span>
                  </p>
                )}
                {result.status === "delivered" && result.estimatedDelivery && (
                  <p className="text-zinc-600 text-sm mt-3">
                    Delivered on{" "}
                    <span className="text-zinc-900 font-medium">
                      {result.estimatedDelivery}
                    </span>
                  </p>
                )}
              </div>

              {result.orderItems.length > 0 && (
                <div className="px-8 py-6">
                  <p className="text-[0.6rem] tracking-widest uppercase text-zinc-500 mb-5">
                    Items in this shipment
                  </p>
                  <div className="flex flex-col gap-4">
                    {result.orderItems.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-4 border border-zinc-100 px-5 py-4"
                      >
                        <div className="flex flex-col gap-0.5">
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
                </div>
              )}

              {result.events.length > 0 && (
                <div className="px-8 py-6">
                  <p className="text-[0.6rem] tracking-widest uppercase text-zinc-500 mb-8">
                    Tracking History
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
                            <svg
                              className="w-3.5 h-3.5 text-black"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                              />
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M17.8 13.938h-.011a7 7 0 1 0-11.464.144h-.016l.14.171c.1.127.2.251.3.371L12 21l5.13-6.248c.194-.209.374-.429.54-.659l.13-.155Z"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-3 h-3 text-zinc-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 10h16M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
                              />
                            </svg>
                          )}
                        </span>

                        <time className="inline-block bg-zinc-50 border border-zinc-200 text-zinc-600 text-[0.6rem] font-medium tracking-widest uppercase px-2 py-0.5 rounded-sm mb-2">
                          {ev.date
                            ? `${new Date(ev.date).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })} · ${ev.time}`
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
                          <p className="text-zinc-400 text-xs">{ev.location}</p>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
