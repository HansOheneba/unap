function getApiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!base) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not configured. Set it to your backend API base (e.g. http://localhost:8000/v1).",
    );
  }
  return base;
}

export function parseCartLineId(id: string): {
  productId: string;
  variantId: string;
  size: string;
} {
  const [productId, variantId, size] = id.split("__");
  if (!productId || !variantId || !size) {
    throw new Error("Invalid cart line item");
  }
  return { productId, variantId, size };
}

export type PlaceOrderPayload = {
  items: {
    productId: string;
    variantId: string;
    size: string;
    quantity: number;
  }[];
  shipping: Record<string, string>;
  payment: { method: "paystack" | "pay_on_delivery" };
  promoCode?: string;
};

export type PlaceOrderResult = {
  orderId: string;
  subtotal?: number;
  discount?: number;
  shippingFee?: number;
  total?: number;
  payment?: {
    method: string;
    status: string;
    reference?: string;
    authorizationUrl?: string;
  };
};

export async function placeOrder(
  payload: PlaceOrderPayload,
  accessToken?: string,
): Promise<PlaceOrderResult> {
  const res = await fetch(`${getApiBase()}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "Could not place order");
  }

  const order = data.order ?? data;
  const orderId = order.id ?? data.orderId;
  const payment = data.payment ?? order.payment;

  return {
    orderId,
    subtotal: data.subtotal ?? order.subtotal,
    discount: data.discount ?? order.discount,
    shippingFee: data.shippingFee ?? order.shippingFee,
    total: data.total ?? order.total,
    payment,
  };
}

export async function verifyPayment(
  reference: string,
): Promise<{ success: boolean; orderId?: string }> {
  const res = await fetch(
    `${getApiBase()}/payments/paystack/verify/${encodeURIComponent(reference)}`,
    { cache: "no-store" },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "Payment verification failed");
  }

  return {
    success: Boolean(data.success),
    orderId: data.orderId,
  };
}
