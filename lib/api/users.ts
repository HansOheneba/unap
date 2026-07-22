import { apiRequest, asList } from "@/lib/api/client";
import { extractUser, type ApiUser } from "@/lib/api/auth";

/** Matches the `Address` schema in docs/frontend-api-spec.json. */
export type ApiAddress = {
  id: string;
  label?: string | null;
  firstName: string;
  lastName: string;
  email?: string | null;
  country: string;
  region?: string | null;
  city: string;
  district?: string | null;
  address: string;
  address2?: string | null;
  googleMapsLink?: string | null;
  phone: string;
  postcode?: string | null;
  whatsapp?: string | null;
  isDefault?: boolean;
};

export type AddressPayload = Omit<ApiAddress, "id">;

export type UpdateProfilePayload = Partial<{
  firstName: string;
  lastName: string;
  phone: string;
  whatsapp: string;
  topSize: string;
  bottomSize: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
}>;

export async function getProfile(): Promise<ApiUser | null> {
  const res = await apiRequest<{ user?: ApiUser } | ApiUser>("/users/me", {
    cache: "no-store",
  });
  return extractUser(res);
}

export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<ApiUser | null> {
  const res = await apiRequest<{ user?: ApiUser } | ApiUser>("/users/me", {
    method: "PATCH",
    body: payload,
  });
  return extractUser(res);
}

export async function listAddresses(): Promise<ApiAddress[]> {
  const payload = await apiRequest<unknown>("/users/me/addresses", {
    cache: "no-store",
  });
  return asList<ApiAddress>(payload);
}

export async function createAddress(
  payload: AddressPayload,
): Promise<ApiAddress> {
  return apiRequest<ApiAddress>("/users/me/addresses", {
    method: "POST",
    body: payload,
  });
}

export async function updateAddress(
  id: string,
  payload: Partial<AddressPayload>,
): Promise<ApiAddress> {
  return apiRequest<ApiAddress>(
    `/users/me/addresses/${encodeURIComponent(id)}`,
    { method: "PATCH", body: payload },
  );
}

export async function deleteAddress(id: string): Promise<void> {
  await apiRequest<void>(`/users/me/addresses/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function setDefaultAddress(id: string): Promise<ApiAddress> {
  return apiRequest<ApiAddress>(
    `/users/me/addresses/${encodeURIComponent(id)}/default`,
    { method: "POST", body: {} },
  );
}
