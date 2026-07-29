import { apiRequest, asList, ApiError } from "@/lib/api/client";

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
  /** Public shipment id for `GET /tracking/:trackingNumber` (e.g. UNAP-000052). */
  trackingNumber?: string | null;
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
): Promise<PlaceOrderResult> {
  console.log("[placeOrder] payload", JSON.stringify(payload, null, 2));

  let data: {
    order?: PlaceOrderResult & {
      id?: string;
      trackingNumber?: string | null;
      payment?: PlaceOrderResult["payment"];
    };
    orderId?: string;
    trackingNumber?: string | null;
    subtotal?: number;
    discount?: number;
    shippingFee?: number;
    total?: number;
    payment?: PlaceOrderResult["payment"];
    id?: string;
  };

  try {
    data = await apiRequest("/orders", {
      method: "POST",
      body: payload,
    });
  } catch (err) {
    if (err instanceof ApiError) {
      console.error(
        "[placeOrder] error",
        JSON.stringify(
          {
            status: err.status,
            message: err.message,
            details: err.details,
          },
          null,
          2,
        ),
      );
    } else {
      console.error("[placeOrder] error", err);
    }
    throw err;
  }

  console.log("[placeOrder] response", JSON.stringify(data, null, 2));

  const order = data.order ?? data;
  const orderId = order.orderId ?? order.id ?? data.orderId;
  if (!orderId) {
    throw new Error("Order created without an id");
  }
  const payment = data.payment ?? order.payment;
  const trackingNumber =
    order.trackingNumber ?? data.trackingNumber ?? null;

  return {
    orderId,
    trackingNumber,
    subtotal: data.subtotal ?? order.subtotal,
    discount: data.discount ?? order.discount,
    shippingFee: data.shippingFee ?? order.shippingFee,
    total: data.total ?? order.total,
    payment,
  };
}

export async function verifyPayment(
  reference: string,
): Promise<{ success: boolean; orderId?: string; trackingNumber?: string }> {
  const data = await apiRequest<{
    success?: boolean;
    orderId?: string;
    trackingNumber?: string | null;
  }>(`/payments/paystack/verify/${encodeURIComponent(reference)}`, {
    cache: "no-store",
  });

  return {
    success: Boolean(data.success ?? true),
    orderId: data.orderId,
    trackingNumber: data.trackingNumber ?? undefined,
  };
}

/** Matches the `OrderSummary` / `Order` schemas in docs/frontend-api-spec.json. */
export type ApiOrderItem = {
  name: string;
  variant?: string | null;
  qty: number;
  price: number;
  imageUrl?: string | null;
};

export type OrderStatus =
  | "processing"
  | "shipped"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | string;

export type ApiOrderSummary = {
  id: string;
  trackingNumber?: string | null;
  date?: string | null;
  status: OrderStatus;
  statusLabel?: string | null;
  total: number;
  currency?: string | null;
  items: ApiOrderItem[];
};

export type ApiOrder = ApiOrderSummary & {
  paymentStatus?: string | null;
  paymentMethod?: string | null;
  paystackReference?: string | null;
  subtotal?: number | null;
  discount?: number | null;
  shippingFee?: number | null;
};

/**
 * `page`/`limit` are documented as optional query params, but the live API's
 * validation currently rejects them ("limit must be a number conforming to
 * the specified constraints") even when sent as numeric strings — the
 * Postman collection ships these two params `disabled` by default for the
 * same reason. Omit them unless the upstream validation bug is fixed.
 */
export async function listOrders(params?: {
  page?: number;
  limit?: number;
}): Promise<ApiOrderSummary[]> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString();
  const payload = await apiRequest<unknown>(`/orders${qs ? `?${qs}` : ""}`, {
    cache: "no-store",
  });
  return asList<ApiOrderSummary>(payload);
}

export async function getOrder(id: string): Promise<ApiOrder> {
  const payload = await apiRequest<ApiOrder | { data?: ApiOrder }>(
    `/orders/${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );
  if (payload && typeof payload === "object" && "id" in payload) {
    return payload as ApiOrder;
  }
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    payload.data
  ) {
    return payload.data;
  }
  throw new Error("Order not found");
}

export async function validatePromoCode(payload: {
  code: string;
  subtotal: number;
  country?: string;
  city?: string;
}): Promise<{
  valid: boolean;
  code?: string;
  label?: string;
  discountType?: string;
  discountValue?: number;
  discountAmount?: number;
  shippingFee?: number;
  shippingZone?: string;
  newTotal?: number;
  message?: string;
}> {
  return apiRequest("/promo/validate", {
    method: "POST",
    body: payload,
  });
}
