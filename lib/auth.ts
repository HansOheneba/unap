/**
 * MOCK AUTH LIBRARY
 * ─────────────────
 * Placeholder until a real auth provider (e.g. NextAuth, Supabase, Clerk)
 * is wired in. Swap out these functions — the UI shapes stay the same.
 */

export interface UserAddress {
  id: string;
  label: string; // e.g. "Home", "Office"
  country: string;
  region: string;
  city: string;
  address: string;
  landmark: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsapp: string;
  country: string;
  region: string;
  city: string;
  address: string;
  landmark: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  topSize: string;
  bottomSize: string;
  addresses: UserAddress[];
  points: number;
  joinedDate: string;
}

export interface MockOrder {
  id: string;
  trackingNumber: string;
  date: string;
  status:
    | "processing"
    | "shipped"
    | "in_transit"
    | "out_for_delivery"
    | "delivered";
  statusLabel: string;
  total: string;
  items: { name: string; variant: string; qty: number; price: string }[];
}

/* ── Mock user ────────────────────────────────────────────── */
export const mockUser: User = {
  id: "usr_001",
  firstName: "Kwame",
  lastName: "Mensah",
  email: "kwame.mensah@gmail.com",
  phone: "+233 20 123 4567",
  whatsapp: "+233 20 123 4567",
  country: "Ghana",
  region: "Greater Accra",
  city: "Accra",
  address: "14 Independence Ave, Osu",
  landmark: "Near Osu Oxford Street, behind Frankies",
  birthDay: "12",
  birthMonth: "Jun",
  birthYear: "1996",
  topSize: "L",
  bottomSize: "M",
  addresses: [
    {
      id: "addr_001",
      label: "Home",
      country: "Ghana",
      region: "Greater Accra",
      city: "Accra",
      address: "14 Independence Ave, Osu",
      landmark: "Near Osu Oxford Street, behind Frankies",
      isDefault: true,
    },
    {
      id: "addr_002",
      label: "Office",
      country: "Ghana",
      region: "Greater Accra",
      city: "Accra",
      address: "9 Liberation Rd, Airport Residential",
      landmark: "Inside Stanbic Heights, 7th floor",
      isDefault: false,
    },
  ],
  points: 340,
  joinedDate: "March 2026",
};

/**
 * Product slugs to seed the wishlist with when the mock user signs in.
 * These map to real products in `lib/products.ts`.
 */
export const mockWishlistSlugs: string[] = [
  "luxesoft-premium-boxers",
  "bold-society-cap",
  "outlaw-i",
  "phantom-long-sleeve",
];

export const mockOrders: MockOrder[] = [
  {
    id: "ORD-2026-0052",
    trackingNumber: "UNAP-000007",
    date: "May 14, 2026",
    status: "processing",
    statusLabel: "Processing",
    total: "GHS 1,030",
    items: [
      {
        name: "Classic Hoodie",
        variant: "Midnight Black / L",
        qty: 1,
        price: "GHS 950",
      },
      {
        name: "Classic Knit Beanie",
        variant: "Natural Tan / One Size",
        qty: 1,
        price: "GHS 260",
      },
    ],
  },
  {
    id: "ORD-2026-0048",
    trackingNumber: "UNAP-000005",
    date: "May 9, 2026",
    status: "out_for_delivery",
    statusLabel: "Out for Delivery",
    total: "GHS 1,100",
    items: [
      {
        name: "Signature Track Pant",
        variant: "Midnight Black / M",
        qty: 1,
        price: "GHS 750",
      },
      {
        name: "ComfortFit Cotton Boxers",
        variant: "Midnight Black / M",
        qty: 1,
        price: "GHS 280",
      },
    ],
  },
  {
    id: "ORD-2026-0041",
    trackingNumber: "UNAP-000001",
    date: "May 4, 2026",
    status: "in_transit",
    statusLabel: "In Transit",
    total: "GHS 960",
    items: [
      {
        name: "Revolt Oversized Tee",
        variant: "Washed Black / L",
        qty: 1,
        price: "GHS 580",
      },
      {
        name: "Bold Society Cap",
        variant: "Jet Black / S/M",
        qty: 1,
        price: "GHS 380",
      },
    ],
  },
  {
    id: "ORD-2026-0028",
    trackingNumber: "UNAP-000003",
    date: "Apr 29, 2026",
    status: "delivered",
    statusLabel: "Delivered",
    total: "GHS 2,180",
    items: [
      {
        name: "Outlaw I",
        variant: "Black / One Size",
        qty: 1,
        price: "GHS 1,200",
      },
      {
        name: "LuxeSoft Premium Boxers",
        variant: "Midnight Black / M",
        qty: 1,
        price: "GHS 420",
      },
      {
        name: "ActiveFlex Performance Boxers",
        variant: "Ocean Blue / M",
        qty: 1,
        price: "GHS 350",
      },
    ],
  },
  {
    id: "ORD-2026-0019",
    trackingNumber: "UNAP-000002",
    date: "Apr 18, 2026",
    status: "delivered",
    statusLabel: "Delivered",
    total: "GHS 720",
    items: [
      {
        name: "Phantom Long Sleeve",
        variant: "Warm Brown / S",
        qty: 1,
        price: "GHS 720",
      },
    ],
  },
];

/* ── Region data ─────────────────────────────────────────── */
export const regionsByCountry: Record<string, string[]> = {
  Ghana: [
    "Greater Accra",
    "Ashanti",
    "Western",
    "Eastern",
    "Central",
    "Volta",
    "Northern",
    "Upper East",
    "Upper West",
    "Brong-Ahafo",
    "Oti",
    "Bono",
    "Bono East",
    "Ahafo",
    "Savannah",
    "North East",
    "Western North",
  ],
  Nigeria: [
    "Lagos",
    "Abuja (FCT)",
    "Rivers",
    "Kano",
    "Oyo",
    "Anambra",
    "Delta",
    "Edo",
    "Enugu",
    "Kaduna",
    "Cross River",
    "Imo",
    "Ogun",
    "Kwara",
    "Osun",
  ],
  Kenya: ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika"],
  "South Africa": [
    "Gauteng",
    "Western Cape",
    "KwaZulu-Natal",
    "Eastern Cape",
    "Limpopo",
  ],
  UK: ["England", "Scotland", "Wales", "Northern Ireland"],
  USA: ["New York", "California", "Texas", "Florida", "Georgia", "Illinois"],
  Other: ["Other"],
};

export const countries = Object.keys(regionsByCountry);

/* ── Mock operations ─────────────────────────────────────── */

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  region: string;
  city: string;
  address: string;
  landmark: string;
  whatsapp: string;
}

/** Simulate signup — replace with real API call */
export async function mockSignup(
  data: SignupData,
): Promise<{ success: boolean }> {
  await new Promise((r) => setTimeout(r, 1000));
  console.log("Mock signup:", data);
  return { success: true };
}

/** Simulate login — always succeeds with mockUser in this demo build. */
export async function mockLogin(
  _email: string,
  _password: string,
): Promise<{ success: boolean; user: User }> {
  await new Promise((r) => setTimeout(r, 800));
  return { success: true, user: mockUser };
}

export const orderStatusColor: Record<MockOrder["status"], string> = {
  processing: "text-amber-700",
  shipped: "text-blue-700",
  in_transit: "text-blue-700",
  out_for_delivery: "text-orange-700",
  delivered: "text-emerald-700",
};

export const orderStatusDot: Record<MockOrder["status"], string> = {
  processing: "bg-amber-500",
  shipped: "bg-blue-500",
  in_transit: "bg-blue-500",
  out_for_delivery: "bg-orange-500",
  delivered: "bg-emerald-500",
};

export const orderStatusPill: Record<MockOrder["status"], string> = {
  processing: "bg-amber-50 text-amber-700 border-amber-200",
  shipped: "bg-blue-50 text-blue-700 border-blue-200",
  in_transit: "bg-blue-50 text-blue-700 border-blue-200",
  out_for_delivery: "bg-orange-50 text-orange-700 border-orange-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
};
