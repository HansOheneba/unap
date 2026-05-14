import { notFound } from "next/navigation";
import { PRODUCTS, getProductBySlug, getRelatedProducts } from "@/lib/products";
import ProductDetailClient from "@/components/products/ProductDetailClient";

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({
    collection: p.category,
    productId: p.slug,
  }));
}

type Props = {
  params: Promise<{ collection: string; productId: string }>;
};

export default async function CollectionProductPage({ params }: Props) {
  const { productId } = await params;
  const product = getProductBySlug(productId);

  if (!product) notFound();

  const relatedProducts = getRelatedProducts(product, 4);

  return (
    <ProductDetailClient product={product} relatedProducts={relatedProducts} />
  );
}
