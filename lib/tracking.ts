/**
 * Order shipment tracking. Backed by the real `GET /tracking/:trackingNumber`
 * endpoint (public, no auth required) — see docs/frontend-api-spec.json.
 *
 * Tracking numbers look like `UNAP-000052`, not Paystack references
 * (`UNAP-ORD-…`) or internal order ids (`ORD-…`).
 */
import { apiRequest, ApiError } from "@/lib/api/client";

export type TrackingStatus =
  | "processing"
  | "shipped"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "exception";

export interface TrackingEvent {
  date: string; // ISO date string
  time: string; // e.g. "9:42 AM"
  location: string;
  description: string;
}

export interface OrderItem {
  name: string;
  variant: string;
  qty: number;
  price: number;
}

export interface TrackingResult {
  found: boolean;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string | null;
  lastUpdated: string;
  status: TrackingStatus;
  statusLabel: string;
  // Customer
  customerName: string;
  customerContact: string;
  // Delivery
  deliveryAddress: string;
  destination: string;
  // Order
  orderDate: string;
  orderItems: OrderItem[];
  // Timeline
  events: TrackingEvent[];
}

const NOT_FOUND: Omit<TrackingResult, "trackingNumber"> = {
  found: false,
  carrier: "",
  estimatedDelivery: null,
  lastUpdated: "",
  status: "exception",
  statusLabel: "Not Found",
  customerName: "",
  customerContact: "",
  deliveryAddress: "",
  destination: "",
  orderDate: "",
  orderItems: [],
  events: [],
};

/** Storefront path for a tracking number, e.g. `/tracking/UNAP-000052`. */
export function trackingPath(trackingNumber: string): string {
  const key = trackingNumber.trim();
  return `/tracking/${encodeURIComponent(key)}`;
}

function parseTrackingDate(value: string): Date | null {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** e.g. "27 Jul 2026" */
export function formatTrackingDate(value: string): string {
  const parsed = parseTrackingDate(value);
  if (!parsed) return value;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** e.g. "27 Jul 2026 · 2:05 PM" */
export function formatTrackingDateTime(value: string): string {
  const parsed = parseTrackingDate(value);
  if (!parsed) return value;
  const date = formatTrackingDate(value);
  const time = parsed.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${date} · ${time}`;
}

/** Newest event first — tracking UI treats index 0 as the active status. */
function sortEventsNewestFirst(events: TrackingEvent[]): TrackingEvent[] {
  return [...events].sort((a, b) => {
    const aMs = Date.parse(`${a.date} ${a.time}`);
    const bMs = Date.parse(`${b.date} ${b.time}`);
    if (!Number.isNaN(aMs) && !Number.isNaN(bMs)) return bMs - aMs;

    const aDate = parseTrackingDate(a.date)?.getTime() ?? 0;
    const bDate = parseTrackingDate(b.date)?.getTime() ?? 0;
    return bDate - aDate;
  });
}

export async function lookupTrackingNumber(
  trackingNumber: string,
): Promise<TrackingResult> {
  const key = trackingNumber.trim().toUpperCase();
  if (!key) return { ...NOT_FOUND, trackingNumber: key };

  try {
    const result = await apiRequest<Partial<TrackingResult>>(
      `/tracking/${encodeURIComponent(key)}`,
      { cache: "no-store" },
    );
    if (!result || result.found === false) {
      return { ...NOT_FOUND, trackingNumber: result?.trackingNumber || key };
    }
    return {
      ...NOT_FOUND,
      ...result,
      found: true,
      trackingNumber: result.trackingNumber || key,
      orderItems: result.orderItems ?? [],
      events: sortEventsNewestFirst(result.events ?? []),
    };
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError("Could not look up this tracking number.", 0);
  }
}

/** Colour + label config per status — used by the UI */
export const statusConfig: Record<
  TrackingStatus,
  { color: string; dot: string }
> = {
  processing: { color: "text-yellow-400", dot: "bg-yellow-400" },
  shipped: { color: "text-blue-400", dot: "bg-blue-400" },
  in_transit: { color: "text-blue-400", dot: "bg-blue-400" },
  out_for_delivery: { color: "text-orange-400", dot: "bg-orange-400" },
  delivered: { color: "text-green-400", dot: "bg-green-400" },
  exception: { color: "text-red-400", dot: "bg-red-400" },
};
