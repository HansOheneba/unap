"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { mockOrders, orderStatusColor, orderStatusDot } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const order = mockOrders.find((o) => o.id === id);

  if (!order) {
    return (
      <main className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center gap-5 px-6">
        <p className="text-zinc-500 text-sm">Order not found.</p>
        <Link
          href="/account"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Back to Account
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900 pt-24 pb-32">
      <div className="max-w-360 mx-auto px-6 md:px-12">
        {/* Back */}
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-[0.65rem] tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors duration-200 mb-8"
        >
          <ArrowLeft size={12} />
          My Account
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-[0.6rem] tracking-widest uppercase text-zinc-400 mb-1">
              Order
            </p>
            <h1 className="text-2xl font-medium tracking-tight">{order.id}</h1>
            <p className="text-zinc-500 text-sm mt-1">Placed {order.date}</p>
          </div>
          <div
            className={`flex items-center gap-2 ${orderStatusColor[order.status]}`}
          >
            <span
              className={`w-2 h-2 rounded-full ${orderStatusDot[order.status]}`}
            />
            <span className="text-[0.65rem] tracking-widest uppercase font-medium">
              {order.statusLabel}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <p className="text-[0.6rem] tracking-widest uppercase text-zinc-500">
              Items ({order.items.length})
            </p>
            <div className="flex flex-col gap-px bg-zinc-100">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="bg-white flex items-center justify-between gap-4 px-5 py-4"
                >
                  <div>
                    <p className="text-zinc-900 text-sm">{item.name}</p>
                    <p className="text-zinc-400 text-xs mt-0.5">
                      {item.variant} · Qty {item.qty}
                    </p>
                  </div>
                  <p className="text-zinc-900 text-sm shrink-0">{item.price}</p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-zinc-100 pt-4 flex justify-between text-sm">
              <span className="text-zinc-500">Order Total</span>
              <span className="text-zinc-900 font-medium">{order.total}</span>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-5">
            {/* Tracking */}
            <div className="border border-zinc-100 p-5">
              <p className="text-[0.6rem] tracking-widest uppercase text-zinc-500 mb-3">
                Tracking
              </p>
              <p className="text-zinc-900 text-sm font-mono mb-3">
                {order.trackingNumber}
              </p>
              <Link
                href={`/tracking?q=${order.trackingNumber}`}
                className={
                  buttonVariants({ variant: "outline", size: "sm" }) +
                  " w-full justify-center"
                }
              >
                Track Shipment
              </Link>
            </div>

            {/* Status timeline */}
            <div className="border border-zinc-100 p-5">
              <p className="text-[0.6rem] tracking-widest uppercase text-zinc-500 mb-4">
                Status
              </p>
              {(
                [
                  { key: "processing", label: "Order Placed" },
                  { key: "shipped", label: "Shipped" },
                  { key: "in_transit", label: "In Transit" },
                  { key: "out_for_delivery", label: "Out for Delivery" },
                  { key: "delivered", label: "Delivered" },
                ] as const
              ).map((step, i, arr) => {
                const statuses = arr.map((s) => s.key);
                const currentIdx = statuses.indexOf(order.status);
                const stepIdx = i;
                const isDone = stepIdx <= currentIdx;
                const isCurrent = stepIdx === currentIdx;
                return (
                  <div
                    key={step.key}
                    className="flex items-start gap-3 mb-3 last:mb-0"
                  >
                    <div className="flex flex-col items-center shrink-0">
                      <div
                        className={`w-2.5 h-2.5 rounded-full mt-0.5 ${
                          isCurrent
                            ? "bg-zinc-900"
                            : isDone
                              ? "bg-zinc-400"
                              : "bg-zinc-200"
                        }`}
                      />
                      {i < arr.length - 1 && (
                        <div
                          className={`w-px flex-1 min-h-[1.5rem] mt-1 ${isDone ? "bg-zinc-300" : "bg-zinc-100"}`}
                        />
                      )}
                    </div>
                    <p
                      className={`text-xs leading-none mt-0.5 ${
                        isCurrent
                          ? "text-zinc-900 font-medium"
                          : isDone
                            ? "text-zinc-500"
                            : "text-zinc-300"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
