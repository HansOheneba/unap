import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { listProductReviews } from "@/lib/api/catalog";
import ProductDetailClient from "@/components/products/ProductDetailClient";

// Product data (stock, price, reviews) is live — always fetch at request time.
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ collection: string; productId: string }>;
};

export default async function CollectionProductPage({ params }: Props) {
  const { collection, productId } = await params;
  const product = await getProductBySlug(productId, collection);

  if (!product) notFound();

  const [relatedProducts, reviewsPage] = await Promise.all([
    getRelatedProducts(product, 4),
    listProductReviews(product.slug, { limit: 10 }).catch(() => ({
      items: [],
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    })),
  ]);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
      initialReviews={reviewsPage.items}
    />
  );
}
