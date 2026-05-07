/**
 * MOCK TRACKING LIBRARY
 * ─────────────────────
 * This is a placeholder until a real shipping API (e.g. AfterShip, EasyPost,
 * ShipStation) is integrated. Swap out `lookupTrackingNumber` with a real
 * API call and keep the same return shape — the UI will work without changes.
 */

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
  price: string;
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

/* ── Mock data keyed by tracking number ─────────────────────── */
const mockOrders: Record<
  string,
  Omit<TrackingResult, "found" | "trackingNumber">
> = {
  "UNAP-000001": {
    carrier: "DHL Express",
    estimatedDelivery: "May 10, 2026",
    lastUpdated: "May 7, 2026, 6:14 AM",
    status: "in_transit",
    statusLabel: "In Transit",
    customerName: "Kwame Mensah",
    customerContact: "+233 20 000 0001",
    deliveryAddress: "14 Independence Ave, Osu, Accra, Greater Accra",
    destination: "Accra, Ghana",
    orderDate: "May 4, 2026",
    orderItems: [
      {
        name: "Unapologetic Classic Tee",
        variant: "Black / L",
        qty: 1,
        price: "$65",
      },
      { name: "UNAP Structured Cap", variant: "Black", qty: 1, price: "$45" },
    ],
    events: [
      {
        date: "2026-05-07",
        time: "6:14 AM",
        location: "Frankfurt, Germany",
        description: "Departed sort facility — en route to destination",
      },
      {
        date: "2026-05-06",
        time: "11:30 PM",
        location: "Frankfurt, Germany",
        description: "Arrived at sort facility",
      },
      {
        date: "2026-05-05",
        time: "2:00 PM",
        location: "London, UK",
        description: "Shipment picked up by carrier",
      },
      {
        date: "2026-05-04",
        time: "10:00 AM",
        location: "London Warehouse, UK",
        description: "Order packed and ready for pickup",
      },
    ],
  },
  "UNAP-000002": {
    carrier: "FedEx International",
    estimatedDelivery: "May 8, 2026",
    lastUpdated: "May 7, 2026, 8:05 AM",
    status: "out_for_delivery",
    statusLabel: "Out for Delivery",
    customerName: "Adaeze Okonkwo",
    customerContact: "+234 80 000 0002",
    deliveryAddress: "22 Victoria Island Blvd, Eti-Osa, Lagos",
    destination: "Lagos, Nigeria",
    orderDate: "May 2, 2026",
    orderItems: [
      {
        name: "UNAP Oversized Hoodie",
        variant: "Chalk White / M",
        qty: 1,
        price: "$120",
      },
      {
        name: "Unapologetic Track Pants",
        variant: "Black / M",
        qty: 1,
        price: "$95",
      },
    ],
    events: [
      {
        date: "2026-05-07",
        time: "8:05 AM",
        location: "Lagos, Nigeria",
        description: "Out for delivery — expected by end of day",
      },
      {
        date: "2026-05-07",
        time: "5:30 AM",
        location: "Lagos Hub, Nigeria",
        description: "Arrived at delivery facility",
      },
      {
        date: "2026-05-05",
        time: "3:20 PM",
        location: "Dubai, UAE",
        description: "In transit to destination country",
      },
      {
        date: "2026-05-04",
        time: "8:00 AM",
        location: "Dubai, UAE",
        description: "Cleared customs",
      },
      {
        date: "2026-05-03",
        time: "9:00 AM",
        location: "New York, USA",
        description: "Shipment picked up by carrier",
      },
    ],
  },
  "UNAP-000003": {
    carrier: "DHL Express",
    estimatedDelivery: "May 5, 2026",
    lastUpdated: "May 5, 2026, 1:47 PM",
    status: "delivered",
    statusLabel: "Delivered",
    customerName: "Ama Owusu",
    customerContact: "+233 24 000 0003",
    deliveryAddress: "8 Prempeh II St, Adum, Kumasi, Ashanti Region",
    destination: "Kumasi, Ghana",
    orderDate: "Apr 29, 2026",
    orderItems: [
      {
        name: "UNAP Wayfarer Sunglasses",
        variant: "Matte Black",
        qty: 1,
        price: "$85",
      },
      {
        name: "Unapologetic Classic Tee",
        variant: "White / S",
        qty: 2,
        price: "$65",
      },
    ],
    events: [
      {
        date: "2026-05-05",
        time: "1:47 PM",
        location: "Kumasi, Ghana",
        description: "Delivered — signed for by recipient",
      },
      {
        date: "2026-05-05",
        time: "7:00 AM",
        location: "Kumasi, Ghana",
        description: "Out for delivery",
      },
      {
        date: "2026-05-04",
        time: "6:15 PM",
        location: "Accra, Ghana",
        description: "Arrived at destination country facility",
      },
      {
        date: "2026-05-03",
        time: "9:40 AM",
        location: "Accra, Ghana",
        description: "Cleared customs",
      },
      {
        date: "2026-05-02",
        time: "11:00 AM",
        location: "Amsterdam, Netherlands",
        description: "Shipment picked up by carrier",
      },
    ],
  },
  "UNAP-000004": {
    carrier: "UPS Standard",
    estimatedDelivery: "May 12, 2026",
    lastUpdated: "May 7, 2026, 10:00 AM",
    status: "processing",
    statusLabel: "Processing",
    customerName: "Emeka Nwosu",
    customerContact: "+234 70 000 0004",
    deliveryAddress: "5 Cadastral Zone, Wuse 2, Abuja, FCT",
    destination: "Abuja, Nigeria",
    orderDate: "May 7, 2026",
    orderItems: [
      {
        name: "UNAP Structured Cap",
        variant: "Olive / One Size",
        qty: 1,
        price: "$45",
      },
    ],
    events: [
      {
        date: "2026-05-07",
        time: "10:00 AM",
        location: "London Warehouse, UK",
        description: "Order received and being processed",
      },
    ],
  },
};

/* ── Public API ──────────────────────────────────────────────── */

/**
 * Look up a tracking number.
 * Replace the body of this function with a real API call when ready.
 */
export async function lookupTrackingNumber(
  trackingNumber: string,
): Promise<TrackingResult> {
  // Simulate network latency
  await new Promise((res) => setTimeout(res, 900));

  const key = trackingNumber.trim().toUpperCase();
  const order = mockOrders[key];

  if (!order) {
    return {
      found: false,
      trackingNumber: key,
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
  }

  return { found: true, trackingNumber: key, ...order };
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
