/**
 * Paystack payment helpers.
 * Wire up when PAYSTACK_PUBLIC_KEY and backend initialize/verify endpoints are ready.
 */

export type PaystackInitResponse = {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
};

/** Backend initializes Paystack transaction after order is created. */
export async function initializePaystackPayment(_payload: {
  orderId: string;
  email: string;
  amount: number;
}): Promise<PaystackInitResponse> {
  // Replace with: POST /payments/paystack/initialize
  throw new Error("Paystack is not connected yet. Add API keys and backend endpoint.");
}

/** Open Paystack checkout (inline popup or redirect). */
export function openPaystackCheckout(_accessCode: string): void {
  // When ready: load @paystack/inline-js with NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
  throw new Error("Paystack checkout is not connected yet.");
}
