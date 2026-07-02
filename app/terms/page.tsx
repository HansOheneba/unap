"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: [
      "By accessing or purchasing from unapologeticnm.com (\"Unapologetic,\" \"we,\" \"us,\" or \"our\"), you agree to be bound by these Terms of Service. If you do not agree, please do not use this site.",
      "We may update these terms from time to time. Continued use of the site after changes are posted means you accept the updated terms.",
    ],
  },
  {
    title: "2. Eligibility",
    body: [
      "You must be at least 18 years old, or the age of majority in your jurisdiction, to create an account or place an order with us.",
    ],
  },
  {
    title: "3. Products & Pricing",
    body: [
      "All products are subject to availability. We reserve the right to limit quantities, discontinue any product, or refuse an order at our discretion.",
      "Prices are listed in Ghanaian Cedis (GHS) unless otherwise stated and are subject to change without notice. We make every effort to display accurate pricing but are not liable for typographical errors.",
    ],
  },
  {
    title: "4. Orders & Payment",
    body: [
      "By placing an order, you confirm that all information provided is accurate and complete. We accept payment via card, Mobile Money, and pay-on-delivery in supported areas.",
      "Orders are confirmed once payment is authorized or, for pay-on-delivery, once the order is placed. We reserve the right to cancel any order suspected of fraud or error.",
    ],
  },
  {
    title: "5. Shipping & Delivery",
    body: [
      "Estimated delivery windows are provided at checkout and on the tracking page. Delivery times are estimates, not guarantees, and can be affected by factors outside our control.",
    ],
  },
  {
    title: "6. Returns & Exchanges",
    body: [
      "Eligible items may be returned or exchanged within the window stated on our Size Guide and order confirmation communications, provided items are unworn, unwashed, and in original packaging.",
      "Contact us before sending anything back so we can guide you through the process.",
    ],
  },
  {
    title: "7. Intellectual Property",
    body: [
      "All content on this site, including logos, graphics, photography, and copy, is the property of Unapologetic and may not be reproduced without written permission.",
    ],
  },
  {
    title: "8. Limitation of Liability",
    body: [
      "Unapologetic is not liable for any indirect, incidental, or consequential damages arising from your use of this site or our products, to the fullest extent permitted by law.",
    ],
  },
  {
    title: "9. Governing Law",
    body: [
      "These terms are governed by the laws of the Republic of Ghana, without regard to conflict of law principles.",
    ],
  },
  {
    title: "10. Contact",
    body: [
      "Questions about these terms? Reach us at hello@mail.unapologeticnm.com or +233 534 946 040.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="bg-white text-zinc-900">
      <section className="pt-24 pb-16 px-8 md:px-20 max-w-360 mx-auto">
        <FadeIn className="flex flex-col gap-6 max-w-2xl">
          <p className="eyebrow">Legal</p>
          <h1 className="leading-none">Terms of Service.</h1>
          <p className="text-zinc-600 text-lg leading-relaxed">
            The ground rules for shopping with us. Straightforward, no fine
            print games.
          </p>
          <p className="text-zinc-400 text-sm">Last updated: June 2026</p>
        </FadeIn>
      </section>

      <section className="px-8 md:px-20 pb-32 max-w-360 mx-auto">
        <div className="flex flex-col gap-14 max-w-3xl">
          {sections.map((section) => (
            <FadeIn key={section.title} className="flex flex-col gap-4">
              <h4 className="text-zinc-900">{section.title}</h4>
              {section.body.map((p, i) => (
                <p
                  key={i}
                  className="text-zinc-600 leading-relaxed text-sm md:text-base"
                >
                  {p}
                </p>
              ))}
            </FadeIn>
          ))}

          <FadeIn className="pt-8 border-t border-zinc-100">
            <p className="text-zinc-500 text-sm">
              Have more questions?{" "}
              <Link
                href="/contact"
                className="text-zinc-900 underline underline-offset-2"
              >
                Get in touch
              </Link>
              .
            </p>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
