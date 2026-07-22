import {
  completeSignup as apiCompleteSignup,
  extractUser,
  sendOtp,
  verifyOtp,
  type ApiUser,
  type CompleteSignupPayload,
  type OtpPurpose,
} from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
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

/** Send a one-time email code. Use purpose "signup" for new accounts. */
export async function requestOtp(
  email: string,
  purpose: OtpPurpose = "login",
): Promise<{ success: boolean; message?: string }> {
  try {
    const result = await sendOtp(email, purpose);
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
  email: string,
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
    const result = await verifyOtp(email, code, purpose);
    const apiUser = extractUser(result) ?? result.user ?? null;
    return {
      success: true,
      isNewUser: result.isNewUser,
      apiUser: apiUser ?? undefined,
      user: apiUser ? mapApiUser(apiUser, email) : undefined,
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
  email: string,
  purpose: OtpPurpose = "login",
): Promise<{ success: boolean; message?: string }> {
  return requestOtp(email, purpose);
}

/** @deprecated Use confirmOtp */
export async function mockVerifyOtp(
  email: string,
  code: string,
  purpose: OtpPurpose = "login",
): Promise<{
  success: boolean;
  message?: string;
  user?: User;
  apiUser?: ApiUser;
  isNewUser?: boolean;
}> {
  return confirmOtp(email, code, purpose);
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
  email: string,
  otp: string,
): Promise<{
  success: boolean;
  message?: string;
  user?: User;
  apiUser?: ApiUser;
}> {
  return confirmOtp(email, otp, "login");
}

export const orderStatusColor: Partial<Record<OrderStatus, string>> = {
  processing: "text-amber-700",
  shipped: "text-blue-700",
  in_transit: "text-blue-700",
  out_for_delivery: "text-orange-700",
  delivered: "text-emerald-700",
};

export const orderStatusDot: Partial<Record<OrderStatus, string>> = {
  processing: "bg-amber-500",
  shipped: "bg-blue-500",
  in_transit: "bg-blue-500",
  out_for_delivery: "bg-orange-500",
  delivered: "bg-emerald-500",
};

export const orderStatusPill: Partial<Record<OrderStatus, string>> = {
  processing: "bg-amber-50 text-amber-700 border-amber-200",
  shipped: "bg-blue-50 text-blue-700 border-blue-200",
  in_transit: "bg-blue-50 text-blue-700 border-blue-200",
  out_for_delivery: "bg-orange-50 text-orange-700 border-orange-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
};
