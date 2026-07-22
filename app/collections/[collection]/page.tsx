import { notFound } from "next/navigation";
import { getCollectionWithProducts } from "@/lib/products";
import CollectionListing from "@/components/collections/CollectionListing";

// Collection contents are live — always fetch at request time.
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ collection: string }>;
};

export default async function CollectionPage({ params }: Props) {
  const { collection: collectionSlug } = await params;
  const result = await getCollectionWithProducts(collectionSlug);

  if (!result) notFound();

  return (
    <CollectionListing
      collectionId={collectionSlug}
      collection={result.collection}
      products={result.products}
    />
  );
}
