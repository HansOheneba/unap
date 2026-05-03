import HeroSection from "@/components/home/hero-section";
import CreedCta from "@/components/home/creed-cta";
import CollectionsPreview from "@/components/home/collections-preview";
import MovementSection from "@/components/home/movement-section";
import FutureSection from "@/components/home/future-section";
import InnerCircleSection from "@/components/home/inner-circle-section";

export default function Home() {
  return (
    <main className="flex flex-col">
      <HeroSection />
      <CreedCta />
      <CollectionsPreview />
      <MovementSection />
      <FutureSection />
      <InnerCircleSection />
    </main>
  );
}
