import { COLLECTION_META } from "@/lib/data/catalog";
import CollectionListing from "@/components/collections/CollectionListing";

export function generateStaticParams() {
  return COLLECTION_META.map((c) => ({ collection: c.id }));
}

type Props = {
  params: Promise<{ collection: string }>;
};

export default async function CollectionPage({ params }: Props) {
  const { collection } = await params;
  return <CollectionListing collectionId={collection} />;
}
