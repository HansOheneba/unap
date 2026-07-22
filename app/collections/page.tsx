import { getAllCollectionsWithProducts } from "@/lib/products";
import CollectionsOverview, {
  type OverviewCard,
} from "@/components/collections/CollectionsOverview";

// Catalog data is live — always fetch at request time, never bake into the
// build's static shell.
export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const sections = await getAllCollectionsWithProducts();

  const overviewCards: OverviewCard[] = sections.map(({ collection }) => ({
    id: collection.id,
    label: collection.subtitle,
    img: collection.featured,
    description: collection.tagline,
  }));

  return <CollectionsOverview sections={sections} overviewCards={overviewCards} />;
}
