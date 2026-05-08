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
  ],
  points: 340,
  joinedDate: "March 2026",
};

export const mockOrders: MockOrder[] = [
  {
    id: "ORD-2026-0041",
    trackingNumber: "UNAP-000001",
    date: "May 4, 2026",
    status: "in_transit",
    statusLabel: "In Transit",
    total: "$110.00",
    items: [
      {
        name: "Unapologetic Classic Tee",
        variant: "Black / L",
        qty: 1,
        price: "$65",
      },
      { name: "UNAP Structured Cap", variant: "Black", qty: 1, price: "$45" },
    ],
  },
  {
    id: "ORD-2026-0028",
    trackingNumber: "UNAP-000003",
    date: "Apr 29, 2026",
    status: "delivered",
    statusLabel: "Delivered",
    total: "$215.00",
    items: [
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

/** Simulate login — replace with real API call */
export async function mockLogin(
  email: string,
  _password: string,
): Promise<{ success: boolean; user?: User }> {
  await new Promise((r) => setTimeout(r, 800));
  if (email) return { success: true, user: mockUser };
  return { success: false };
}

export const orderStatusColor: Record<MockOrder["status"], string> = {
  processing: "text-yellow-400",
  shipped: "text-blue-400",
  in_transit: "text-blue-400",
  out_for_delivery: "text-orange-400",
  delivered: "text-green-400",
};

export const orderStatusDot: Record<MockOrder["status"], string> = {
  processing: "bg-yellow-400",
  shipped: "bg-blue-400",
  in_transit: "bg-blue-400",
  out_for_delivery: "bg-orange-400",
  delivered: "bg-green-400",
};
