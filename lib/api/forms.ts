import { apiRequest } from "@/lib/api/client";

export async function subscribeNewsletter(payload: {
  email: string;
  firstName?: string;
  source?: "inner_circle" | "footer" | "homepage" | "movement";
}): Promise<{ success?: boolean; message?: string }> {
  return apiRequest("/newsletter/subscribe", {
    method: "POST",
    body: payload,
  });
}

export async function submitContact(payload: {
  name: string;
  email: string;
  topic: string;
  message: string;
}): Promise<{ success?: boolean; message?: string }> {
  return apiRequest("/contact", {
    method: "POST",
    body: payload,
  });
}

export async function createStockAlert(payload: {
  email: string;
  productId: string;
  variantId: string;
  size: string;
}): Promise<{ success?: boolean; message?: string }> {
  return apiRequest("/stock-alerts", {
    method: "POST",
    body: payload,
  });
}
