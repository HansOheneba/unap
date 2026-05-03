import HeroSection from "@/components/home/hero-section";
import CreedCta from "@/components/home/creed-cta";
import CollectionsPreview from "@/components/home/collections-preview";

export default function Home() {
  return (
    <main className="flex flex-col">
      <HeroSection />
      <CreedCta />
      <CollectionsPreview />
    </main>
  );
}
