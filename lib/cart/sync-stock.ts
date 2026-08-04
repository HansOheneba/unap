import { getCollectionWithProducts, getProductBySlug } from "@/lib/products";
import { getOrderableStock } from "@/lib/preorder";
import { parseCartLineId } from "@/lib/api/orders";
import { useCartStore, type CartItem } from "@/lib/stores/cart-store";

export type StockAdjustment = {
  id: string;
  name: string;
  previousQuantity: number;
  quantity: number;
  removed: boolean;
};

async function resolveSlug(
  item: Pick<CartItem, "id" | "slug" | "category">,
): Promise<string | null> {
  if (item.slug) return item.slug;
  if (!item.category) return null;

  try {
    const { productId } = parseCartLineId(item.id);
    const collection = await getCollectionWithProducts(item.category);
    const match = collection?.products.find((p) => p.id === productId);
    return match?.slug ?? null;
  } catch {
    return null;
  }
}

/** Live stock for a cart line from the catalog API. `null` if it cannot be resolved. */
export async function fetchLineStock(
  item: Pick<CartItem, "id" | "slug" | "category" | "isPreorder">,
): Promise<{
  stock: number;
  slug: string;
  isPreorder: boolean;
  availableDate: string | null;
} | null> {
  const slug = await resolveSlug(item);
  if (!slug) return null;

  const product = await getProductBySlug(slug, item.category);
  if (!product) return { stock: 0, slug, isPreorder: false, availableDate: null };

  try {
    const { variantId, size } = parseCartLineId(item.id);
    const variant = product.variants.find((v) => v.id === variantId);
    const sizeRow = variant?.sizes.find((s) => s.size === size);
    const rawStock = sizeRow?.stock ?? 0;
    const isPreorder = product.isPreorder;
    return {
      stock: getOrderableStock(rawStock, isPreorder),
      slug,
      isPreorder,
      availableDate: product.availableDate,
    };
  } catch {
    return null;
  }
}

/**
 * Revalidates stock for every cart line and clamps quantities.
 * Returns lines that changed so the UI can notify the shopper.
 */
export async function syncCartStocks(
  items: CartItem[],
): Promise<StockAdjustment[]> {
  const setItemStock = useCartStore.getState().setItemStock;
  const adjustments: StockAdjustment[] = [];

  await Promise.all(
    items.map(async (item) => {
      const resolved = await fetchLineStock(item);
      if (!resolved) return;

      // Keep pre-order metadata fresh when revalidating.
      if (resolved.isPreorder || item.isPreorder) {
        useCartStore.setState({
          items: useCartStore.getState().items.map((line) =>
            line.id === item.id
              ? {
                  ...line,
                  isPreorder: resolved.isPreorder,
                  availableDate: resolved.availableDate,
                }
              : line,
          ),
        });
      }

      const result = setItemStock(item.id, resolved.stock, resolved.slug);
      if (!result) return;
      if (result.removed || result.quantity !== result.previousQuantity) {
        adjustments.push({
          id: item.id,
          name: item.name,
          previousQuantity: result.previousQuantity,
          quantity: result.quantity,
          removed: result.removed,
        });
      }
    }),
  );

  return adjustments;
}
