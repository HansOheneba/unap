import HeroSection from "@/components/home/hero-section";
import CreedCta from "@/components/home/creed-cta";
import CollectionsPreview from "@/components/home/collections-preview";
import MovementSection from "@/components/home/movement-section";
// import FutureSection from "@/components/home/future-section";
import InnerCircleSection from "@/components/home/inner-circle-section";
import { getFeaturedProducts } from "@/lib/products";

// Product data comes live from the catalog API — never prerender/cache this
// route at build time, always fetch fresh at request time.
export const dynamic = "force-dynamic";

export default async function Home() {
  const featuredProducts = await getFeaturedProducts(4);

  return (
    <main className="flex flex-col">
      <HeroSection />
      <CollectionsPreview products={featuredProducts} />
      <CreedCta />
      <MovementSection />
      {/* <FutureSection /> */}
      <InnerCircleSection />
    </main>
  );
}
