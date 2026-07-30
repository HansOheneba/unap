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
  | "ready_for_pickup"
  | "picked_up"
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
      status: normalizeTrackingStatus(result.status),
      statusLabel:
        customerStatusCopy[normalizeTrackingStatus(result.status)].headline,
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
  processing: { color: "text-amber-700", dot: "bg-amber-500" },
  ready_for_pickup: { color: "text-blue-700", dot: "bg-blue-500" },
  picked_up: { color: "text-blue-700", dot: "bg-blue-500" },
  shipped: { color: "text-blue-700", dot: "bg-blue-500" },
  in_transit: { color: "text-blue-700", dot: "bg-blue-500" },
  out_for_delivery: { color: "text-orange-700", dot: "bg-orange-500" },
  delivered: { color: "text-emerald-700", dot: "bg-emerald-500" },
  exception: { color: "text-red-700", dot: "bg-red-500" },
};

/**
 * Customer-facing fulfillment stages (aligned with admin ops pipeline).
 * Labels avoid "pickup" so customers don't think they must collect the order.
 */
export const fulfillmentStages = [
  { key: "processing", label: "Processing" },
  { key: "ready_for_pickup", label: "Awaiting rider" },
  { key: "picked_up", label: "Rider collected" },
  { key: "in_transit", label: "In transit" },
  { key: "delivered", label: "Delivered" },
] as const;

export type FulfillmentStageKey = (typeof fulfillmentStages)[number]["key"];

/** Map API / legacy statuses onto the 5-step customer timeline. */
const STATUS_TO_STAGE_INDEX: Record<TrackingStatus, number> = {
  processing: 0,
  ready_for_pickup: 1,
  picked_up: 2,
  shipped: 2,
  in_transit: 3,
  out_for_delivery: 3,
  delivered: 4,
  exception: -1,
};

export function fulfillmentStageIndex(status: TrackingStatus): number {
  return STATUS_TO_STAGE_INDEX[status] ?? -1;
}

export function normalizeTrackingStatus(status: string | undefined): TrackingStatus {
  switch (status) {
    case "processing":
    case "ready_for_pickup":
    case "picked_up":
    case "shipped":
    case "in_transit":
    case "out_for_delivery":
    case "delivered":
    case "exception":
      return status;
    default:
      return "exception";
  }
}

/** Customer-facing copy. Prefer these over raw API statusLabel. */
export const customerStatusCopy: Record<
  TrackingStatus,
  { headline: string; detail: string }
> = {
  processing: {
    headline: "Being prepared",
    detail: "We're getting your order ready for dispatch.",
  },
  ready_for_pickup: {
    headline: "Waiting for our rider",
    detail:
      "A rider will collect your order and bring it to your delivery address. You do not need to pick it up yourself.",
  },
  picked_up: {
    headline: "Collected by rider",
    detail: "Your order is with our rider and heading your way.",
  },
  shipped: {
    headline: "On its way",
    detail: "Your order has left our facility.",
  },
  in_transit: {
    headline: "In transit",
    detail:
      "Your order is on the way to you. Check your email for rider details.",
  },
  out_for_delivery: {
    headline: "Out for delivery",
    detail:
      "Your order is with the rider for final delivery. Check your email for rider details.",
  },
  delivered: {
    headline: "Delivered",
    detail: "Your order has been delivered.",
  },
  exception: {
    headline: "Needs attention",
    detail:
      "There is an issue with this shipment. Check the tracking history or contact support.",
  },
};
