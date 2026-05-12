import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

export default function CreedCta() {
  return (
    <section className="bg-black text-white py-32 px-8 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left: text */}
        <div className="flex flex-col gap-8">
          <p className="eyebrow">The Awakening</p>

          <h2 className="max-w-lg">Society Taught You to Shrink</h2>

          <div className="flex flex-col gap-4 text-white/70">
            <p>
              They told you to be quiet. To ask permission. To shrink your
              desires, dim your fire, and apologize for the space you occupy.
              They taught you that boldness is arrogance. That confidence is
              vanity. That wanting more is greed.
            </p>
            <p className="italic">We exist to destroy that lie.</p>
          </div>

          <Link href="/the-creed">
            <Button variant="outline">Read the Creed</Button>
          </Link>
        </div>

        {/* Right: image */}
        <div className="relative aspect-4/5 overflow-hidden group">
          <Image
            src="/home/manStudio.jpg"
            alt="The Creed"
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-[filter] duration-700"
          />
          {/* subtle corner label */}
          <div className="absolute bottom-5 right-5 pointer-events-none">
            <p className="eyebrow text-white/70">Unapologetic Since Birth</p>
          </div>
        </div>
      </div>
    </section>
  );
}
