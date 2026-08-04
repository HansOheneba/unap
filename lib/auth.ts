import {
  completeSignup as apiCompleteSignup,
  extractUser,
  normalizePhoneForApi,
  sendOtp,
  verifyOtp,
  type ApiUser,
  type CompleteSignupPayload,
  type OtpIdentifier,
  type OtpPurpose,
} from "@/lib/api/auth";

export type { OtpIdentifier, OtpPurpose };
export { normalizePhoneForApi };

/** Soft-format phone for auth OTP (supports local 0XX… and +233…). */
export function formatAuthPhoneInput(raw: string): string {
  const trimmed = raw.trimStart();
  const hasPlus = trimmed.startsWith("+");
  const digits = raw.replace(/\D/g, "").slice(0, 15);
  if (!digits) return hasPlus ? "+" : "";

  if (hasPlus) {
    const country = digits.slice(0, 3);
    const rest = digits.slice(3);
    const groups = rest.match(/.{1,3}/g) ?? [];
    return ["+" + country, ...groups].join(" ").trim();
  }

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  if (digits.length <= 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)} ${digits.slice(10)}`;
}
import { ApiError } from "@/lib/api/client";
import {
  addressPayloadFromProfile,
  createAddress,
} from "@/lib/api/users";
import type { OrderStatus } from "@/lib/api/orders";

export interface UserAddress {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  region: string;
  city: string;
  district: string;
  address: string;
  address2: string;
  googleMapsLink: string;
  phone: string;
  postcode: string;
  whatsapp: string;
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
  googleMapsLink: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  topSize: string;
  bottomSize: string;
  addresses: UserAddress[];
  points: number;
  joinedDate: string;
  profileComplete?: boolean;
}

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

export const OTP_LENGTH = 6;

export interface SignupData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  region: string;
  city: string;
  address: string;
  landmark: string;
  googleMapsLink: string;
  whatsapp: string;
  agreedToTerms?: boolean;
}

export function mapApiUser(apiUser: ApiUser, fallbackEmail = ""): User {
  return {
    id: apiUser.id || "",
    firstName: apiUser.firstName || "",
    lastName: apiUser.lastName || "",
    email: apiUser.email || fallbackEmail,
    phone: apiUser.phone || "",
    whatsapp: apiUser.whatsapp || apiUser.phone || "",
    country: apiUser.country || "Ghana",
    region: apiUser.region || "",
    city: apiUser.city || "",
    address: apiUser.address || "",
    landmark: apiUser.landmark || "",
    googleMapsLink: apiUser.googleMapsLink || "",
    birthDay: apiUser.birthDay || "",
    birthMonth: apiUser.birthMonth || "",
    birthYear: apiUser.birthYear || "",
    topSize: apiUser.topSize || "",
    bottomSize: apiUser.bottomSize || "",
    addresses: [],
    points: apiUser.points ?? 0,
    joinedDate: apiUser.joinedDate || "",
    profileComplete: apiUser.profileComplete ?? undefined,
  };
}

function toErrorMessage(err: unknown, fallback: string) {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

/** Send a one-time email or SMS code. Use purpose "signup" for new accounts. */
export async function requestOtp(
  identifier: OtpIdentifier,
  purpose: OtpPurpose = "login",
): Promise<{ success: boolean; message?: string }> {
  try {
    const result = await sendOtp(identifier, purpose);
    return {
      success: true,
      message:
        result && typeof result === "object" ? result.message : undefined,
    };
  } catch (err) {
    return { success: false, message: toErrorMessage(err, "Could not send code") };
  }
}

/**
 * Verify OTP and return the user when present. Tokens are never returned here:
 * a successful call already caused the proxy to mint httpOnly session cookies
 * server-side, so this layer only needs to reflect the user profile back to the UI.
 */
export async function confirmOtp(
  identifier: OtpIdentifier,
  code: string,
  purpose: OtpPurpose = "login",
): Promise<{
  success: boolean;
  message?: string;
  isNewUser?: boolean;
  user?: User;
  apiUser?: ApiUser;
}> {
  try {
    const result = await verifyOtp(identifier, code, purpose);
    const apiUser = extractUser(result) ?? result.user ?? null;
    const fallbackEmail =
      identifier.channel === "email" ? identifier.email : "";
    return {
      success: true,
      isNewUser: result.isNewUser,
      apiUser: apiUser ?? undefined,
      user: apiUser ? mapApiUser(apiUser, fallbackEmail) : undefined,
    };
  } catch (err) {
    return {
      success: false,
      message: toErrorMessage(err, "Invalid or expired code"),
    };
  }
}

/** Finish signup profile after OTP verification. Requires auth session. */
export async function finishSignup(
  data: SignupData & { agreedToTerms?: boolean },
): Promise<{ success: boolean; message?: string; user?: User; apiUser?: ApiUser }> {
  try {
    const payload: CompleteSignupPayload = {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      country: data.country,
      region: data.region,
      city: data.city,
      address: data.address,
      landmark: data.landmark || undefined,
      googleMapsLink: data.googleMapsLink || undefined,
      whatsapp: data.whatsapp || undefined,
      agreedToTerms: data.agreedToTerms ?? true,
    };
    const result = await apiCompleteSignup(payload);
    const apiUser = extractUser(result);

    // Signup writes shipping fields onto the user profile, but the Address Book
    // is a separate resource. Create the default Home address so /account shows it.
    const addressPayload = addressPayloadFromProfile({
      ...data,
      email: data.email,
    });
    if (addressPayload) {
      try {
        await createAddress(addressPayload);
      } catch (err) {
        console.error("[finishSignup] could not create default address:", err);
      }
    }

    return {
      success: true,
      apiUser: apiUser ?? undefined,
      user: apiUser ? mapApiUser(apiUser, data.email) : undefined,
    };
  } catch (err) {
    return {
      success: false,
      message: toErrorMessage(err, "Could not complete signup"),
    };
  }
}

/** @deprecated Use requestOtp */
export async function mockSendOtp(
  identifier: OtpIdentifier,
  purpose: OtpPurpose = "login",
): Promise<{ success: boolean; message?: string }> {
  return requestOtp(identifier, purpose);
}

/** @deprecated Use confirmOtp */
export async function mockVerifyOtp(
  identifier: OtpIdentifier,
  code: string,
  purpose: OtpPurpose = "login",
): Promise<{
  success: boolean;
  message?: string;
  user?: User;
  apiUser?: ApiUser;
  isNewUser?: boolean;
}> {
  return confirmOtp(identifier, code, purpose);
}

/** @deprecated Use finishSignup */
export async function mockSignup(
  data: SignupData,
): Promise<{
  success: boolean;
  message?: string;
  user?: User;
  apiUser?: ApiUser;
}> {
  return finishSignup(data);
}

/** Login after OTP verification. */
export async function mockLogin(
  identifier: OtpIdentifier,
  otp: string,
): Promise<{
  success: boolean;
  message?: string;
  user?: User;
  apiUser?: ApiUser;
}> {
  return confirmOtp(identifier, otp, "login");
}

export const orderStatusColor: Partial<Record<OrderStatus, string>> = {
  pre_order: "text-zinc-800",
  processing: "text-amber-700",
  ready_for_pickup: "text-blue-700",
  picked_up: "text-blue-700",
  shipped: "text-blue-700",
  in_transit: "text-blue-700",
  out_for_delivery: "text-orange-700",
  delivered: "text-emerald-700",
};

export const orderStatusDot: Partial<Record<OrderStatus, string>> = {
  pre_order: "bg-zinc-900",
  processing: "bg-amber-500",
  ready_for_pickup: "bg-blue-500",
  picked_up: "bg-blue-500",
  shipped: "bg-blue-500",
  in_transit: "bg-blue-500",
  out_for_delivery: "bg-orange-500",
  delivered: "bg-emerald-500",
};

export const orderStatusPill: Partial<Record<OrderStatus, string>> = {
  pre_order: "bg-zinc-100 text-zinc-800 border-zinc-300",
  processing: "bg-amber-50 text-amber-700 border-amber-200",
  ready_for_pickup: "bg-blue-50 text-blue-700 border-blue-200",
  picked_up: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-blue-50 text-blue-700 border-blue-200",
  in_transit: "bg-blue-50 text-blue-700 border-blue-200",
  out_for_delivery: "bg-orange-50 text-orange-700 border-orange-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
};
