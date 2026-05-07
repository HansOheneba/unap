"use client";

import { useState } from "react";
import {
  lookupTrackingNumber,
  statusConfig,
  type TrackingResult,
} from "@/lib/tracking";

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackingResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;
    setLoading(true);
    setResult(null);
    const data = await lookupTrackingNumber(trackingNumber);
    setResult(data);
    setLoading(false);
  };

  const statusCfg = result?.found ? statusConfig[result.status] : null;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-28 md:px-10">
      <div className="max-w-5xl mx-auto">
        {/* ── Page header ── */}
        <div className="mb-10">
          <p className="text-white/50 text-[0.65rem] tracking-[0.25em] uppercase mb-3">
            Order Status
          </p>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-3">
            Track Your Order
          </h1>
          <p className="text-white/70 text-sm leading-relaxed max-w-md">
            Enter the tracking number from your confirmation email to see the
            latest status of your shipment.
          </p>
        </div>

        {/* ── Search form ── */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 mb-3 max-w-xl"
        >
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => {
              setTrackingNumber(e.target.value);
              setResult(null);
            }}
            placeholder="e.g. UNAP-000001"
            className="flex-1 bg-white/8 border border-white/25 text-white placeholder-white/40 px-5 py-3.5 text-sm tracking-wide focus:outline-none focus:border-white/70 transition-colors duration-200"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={loading}
            className="border border-white/50 bg-transparent text-white px-8 py-3.5 text-[0.7rem] tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? "Looking up…" : "Track Order"}
          </button>
        </form>
        <p className="text-white/35 text-[0.6rem] tracking-widest uppercase mb-12">
          Demo — try: UNAP-000001 · UNAP-000002 · UNAP-000003 · UNAP-000004
        </p>

        {/* ── Result ── */}
        {result && !result.found && (
          <div className="border border-white/20 p-8 max-w-xl">
            <p className="text-white font-light text-lg mb-2">
              No shipment found
            </p>
            <p className="text-white/70 text-sm leading-relaxed">
              We couldn&apos;t find a shipment for{" "}
              <span className="text-white font-medium">
                {result.trackingNumber}
              </span>
              . Please double-check the number from your confirmation email.
            </p>
          </div>
        )}

        {result?.found && statusCfg && (
          <div className="grid md:grid-cols-[280px_1fr] gap-px bg-white/10 border border-white/15">
            {/* ── LEFT PANEL ── */}
            <div className="bg-black flex flex-col gap-0 divide-y divide-white/10">
              {/* Status badge */}
              <div className="px-7 py-6">
                <p className="text-[0.6rem] tracking-widest uppercase text-white/50 mb-1">
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

              {/* Tracking + carrier */}
              <div className="px-7 py-6">
                <p className="text-[0.6rem] tracking-widest uppercase text-white/50 mb-1">
                  Tracking No.
                </p>
                <p className="text-white text-sm font-medium mt-1">
                  {result.trackingNumber}
                </p>
                <p className="text-white/60 text-xs mt-1">{result.carrier}</p>
              </div>

              {/* Customer */}
              <div className="px-7 py-6">
                <p className="text-[0.6rem] tracking-widest uppercase text-white/50 mb-3">
                  Customer
                </p>
                <p className="text-white text-sm">{result.customerName}</p>
                <p className="text-white/70 text-xs mt-1">
                  {result.customerContact}
                </p>
              </div>

              {/* Delivery address */}
              <div className="px-7 py-6">
                <p className="text-[0.6rem] tracking-widest uppercase text-white/50 mb-3">
                  Delivery Address
                </p>
                <p className="text-white text-sm leading-relaxed">
                  {result.deliveryAddress}
                </p>
              </div>

              {/* Order info */}
              <div className="px-7 py-6">
                <p className="text-[0.6rem] tracking-widest uppercase text-white/50 mb-3">
                  Order Date
                </p>
                <p className="text-white text-sm">{result.orderDate}</p>
              </div>

              {/* Est. delivery */}
              {result.estimatedDelivery && (
                <div className="px-7 py-6">
                  <p className="text-[0.6rem] tracking-widest uppercase text-white/50 mb-1">
                    Estimated Delivery
                  </p>
                  <p className="text-white text-sm font-medium mt-1">
                    {result.estimatedDelivery}
                  </p>
                </div>
              )}

              {/* Last updated */}
              <div className="px-7 py-6">
                <p className="text-[0.6rem] tracking-widest uppercase text-white/50 mb-1">
                  Last Updated
                </p>
                <p className="text-white/80 text-xs mt-1">
                  {result.lastUpdated}
                </p>
              </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="bg-black flex flex-col divide-y divide-white/10">
              {/* Big status headline */}
              <div className="px-8 py-8">
                <p className="text-white/60 text-sm mb-1">Your order is</p>
                <p
                  className={`text-4xl md:text-5xl font-light tracking-tight ${statusCfg.color}`}
                >
                  {result.statusLabel}
                </p>
                {result.estimatedDelivery && result.status !== "delivered" && (
                  <p className="text-white/70 text-sm mt-3">
                    Estimated arrival —{" "}
                    <span className="text-white font-medium">
                      {result.estimatedDelivery}
                    </span>
                  </p>
                )}
                {result.status === "delivered" && (
                  <p className="text-white/70 text-sm mt-3">
                    Delivered on{" "}
                    <span className="text-white font-medium">
                      {result.estimatedDelivery}
                    </span>
                  </p>
                )}
              </div>

              {/* Order items */}
              <div className="px-8 py-6">
                <p className="text-[0.6rem] tracking-widest uppercase text-white/50 mb-5">
                  Items in this shipment
                </p>
                <div className="flex flex-col gap-4">
                  {result.orderItems.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-4 border border-white/10 px-5 py-4"
                    >
                      <div className="flex flex-col gap-0.5">
                        <p className="text-white text-sm">{item.name}</p>
                        <p className="text-white/60 text-xs">{item.variant}</p>
                        <p className="text-white/50 text-xs mt-1">
                          Qty: {item.qty}
                        </p>
                      </div>
                      <p className="text-white text-sm font-medium shrink-0">
                        {item.price}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tracking history */}
              <div className="px-8 py-6">
                <p className="text-[0.6rem] tracking-widest uppercase text-white/50 mb-8">
                  Tracking History
                </p>
                <ol className="relative border-s border-white/15">
                  {result.events.map((ev, i) => (
                    <li key={i} className="mb-8 ms-8 last:mb-0">
                      {/* Circle icon dot */}
                      <span
                        className={`absolute flex items-center justify-center w-7 h-7 rounded-full -start-3.5 ring-4 ring-black ${
                          i === 0 ? statusCfg.dot : "bg-white/10"
                        }`}
                      >
                        {i === 0 ? (
                          /* active — truck / location pin */
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
                          /* past — calendar dot */
                          <svg
                            className="w-3 h-3 text-white/60"
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

                      {/* Date badge */}
                      <time className="inline-block bg-white/8 border border-white/20 text-white/80 text-[0.6rem] font-medium tracking-widest uppercase px-2 py-0.5 rounded-sm mb-2">
                        {new Date(ev.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        · {ev.time}
                      </time>

                      {/* Status text */}
                      <h4
                        className={`text-sm font-medium mb-0.5 ${
                          i === 0 ? "text-white" : "text-white/80"
                        }`}
                      >
                        {ev.description}
                      </h4>
                      <p className="text-white/50 text-xs">{ev.location}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
