import { ApiError, apiRequest } from "@/lib/api/client";

function logAuthError(label: string, err: unknown) {
  if (err instanceof ApiError) {
    console.error(label, {
      message: err.message,
      status: err.status,
      details: err.details,
    });
    return;
  }
  console.error(label, err);
}

export type OtpPurpose = "login" | "signup";

/** Identity used for passwordless OTP (email or SMS). */
export type OtpIdentifier =
  | { channel: "email"; email: string }
  | { channel: "phone"; phone: string };

export type ApiUser = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  country?: string | null;
  region?: string | null;
  city?: string | null;
  address?: string | null;
  landmark?: string | null;
  googleMapsLink?: string | null;
  birthDay?: string | null;
  birthMonth?: string | null;
  birthYear?: string | null;
  topSize?: string | null;
  bottomSize?: string | null;
  points?: number | null;
  joinedDate?: string | null;
  profileComplete?: boolean | null;
};

export type SendOtpResult = {
  success?: boolean;
  expiresInSeconds?: number;
  message?: string;
};

/**
 * accessToken/refreshToken are intentionally absent here: the proxy route
 * (`app/api/backend/[...path]/route.ts`) mints them into httpOnly cookies and
 * strips them from the JSON before it reaches the browser.
 */
export type VerifyOtpResult = {
  success?: boolean;
  isNewUser?: boolean;
  expiresIn?: number;
  user?: ApiUser;
};

export type CompleteSignupPayload = {
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  region: string;
  city: string;
  address: string;
  landmark?: string;
  googleMapsLink?: string;
  whatsapp?: string;
  agreedToTerms: boolean;
};

/** Digits-only phone for `/auth/otp/*` (matches Postman SMS examples). */
export function normalizePhoneForApi(phone: string): string {
  return phone.replace(/\D/g, "");
}

function otpRequestBody(identifier: OtpIdentifier, purpose: OtpPurpose) {
  if (identifier.channel === "email") {
    return { email: identifier.email.trim().toLowerCase(), purpose };
  }
  return { phone: normalizePhoneForApi(identifier.phone), purpose };
}

export async function sendOtp(
  identifier: OtpIdentifier,
  purpose: OtpPurpose,
): Promise<SendOtpResult> {
  const body = otpRequestBody(identifier, purpose);
  console.log("[auth/otp/send] request", body);
  try {
    const payload = await apiRequest<SendOtpResult | null>("/auth/otp/send", {
      method: "POST",
      body,
    });
    console.log("[auth/otp/send] response", payload);
    // OTP send is side-effecting; a 2xx with an empty/null body still means the
    // code was accepted for delivery (matches Postman / live API behavior).
    return payload ?? { success: true };
  } catch (err) {
    logAuthError("[auth/otp/send] error", err);
    throw err;
  }
}

export async function verifyOtp(
  identifier: OtpIdentifier,
  code: string,
  purpose: OtpPurpose,
): Promise<VerifyOtpResult> {
  const body = {
    ...otpRequestBody(identifier, purpose),
    code: code.trim(),
  };
  console.log("[auth/otp/verify] request", {
    ...body,
    code: body.code ? `[${body.code.length} digits]` : "",
  });
  try {
    const payload = await apiRequest<
      VerifyOtpResult & { data?: VerifyOtpResult }
    >("/auth/otp/verify", {
      method: "POST",
      body,
    });
    console.log("[auth/otp/verify] response", payload);
    // Support both flat `{ user, accessToken }` and nested `{ data: { user } }`.
    if (
      payload &&
      typeof payload === "object" &&
      "user" in payload &&
      payload.user
    ) {
      return payload;
    }
    if (
      payload &&
      typeof payload === "object" &&
      "data" in payload &&
      payload.data &&
      typeof payload.data === "object"
    ) {
      return payload.data;
    }
    return payload ?? {};
  } catch (err) {
    logAuthError("[auth/otp/verify] error", err);
    throw err;
  }
}

export async function completeSignup(
  payload: CompleteSignupPayload,
): Promise<{ success?: boolean; user?: ApiUser } | ApiUser> {
  return apiRequest("/auth/signup/complete", {
    method: "POST",
    body: payload,
  });
}

/** Clears the httpOnly session cookies server-side (and calls upstream /auth/logout). */
export async function logout(): Promise<void> {
  await apiRequest<void>("/auth/logout", { method: "POST" });
}

export async function getMe(): Promise<{ user: ApiUser } | ApiUser> {
  return apiRequest("/auth/me", { method: "GET" });
}

/** Normalize /auth/me and profile responses that may be `{ user }` or bare user. */
export function extractUser(
  payload: { user?: ApiUser } | ApiUser | null | undefined,
): ApiUser | null {
  if (!payload) return null;
  if ("user" in payload && payload.user) return payload.user;
  if ("id" in payload && typeof payload.id === "string") {
    return payload as ApiUser;
  }
  return null;
}
