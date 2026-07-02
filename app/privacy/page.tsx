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
    title: "1. What We Collect",
    body: [
      "When you create an account, place an order, or sign up for the Inner Circle, we collect information like your name, email, phone number, delivery address, and order history.",
      "We also collect basic usage data (pages visited, device type, general location) to improve the site and understand what resonates with our community.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    body: [
      "To process and deliver your orders, communicate order and shipping updates, respond to support requests, and, if you opt in, send you drops, restocks, and Inner Circle updates.",
      "We do not sell your personal information to third parties.",
    ],
  },
  {
    title: "3. Payment Information",
    body: [
      "Card and Mobile Money payments are processed by our third-party payment processor. We do not store your full card or MoMo credentials on our servers.",
    ],
  },
  {
    title: "4. Sharing Your Information",
    body: [
      "We share necessary details (like your name, address, and phone number) with delivery partners solely to fulfill your order. We may also share data with service providers who help us run the site, always under confidentiality obligations.",
    ],
  },
  {
    title: "5. Cookies",
    body: [
      "We use cookies and local storage to keep you signed in, remember your cart and wishlist, and understand how the site is used. You can disable cookies in your browser, though some features may not work as expected.",
    ],
  },
  {
    title: "6. Your Rights",
    body: [
      "You can access, update, or request deletion of your personal data at any time by contacting us. You can also unsubscribe from marketing emails using the link in any campaign, or from your account settings.",
    ],
  },
  {
    title: "7. Data Security",
    body: [
      "We take reasonable technical and organizational measures to protect your information. No method of transmission or storage is 100% secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    title: "8. Children's Privacy",
    body: [
      "Our site is not directed at anyone under 18. We do not knowingly collect personal information from children.",
    ],
  },
  {
    title: "9. Changes to This Policy",
    body: [
      "We may update this policy periodically. Material changes will be reflected by an updated \"Last updated\" date on this page.",
    ],
  },
  {
    title: "10. Contact",
    body: [
      "Questions about your data? Reach us at hello@mail.unapologeticnm.com or +233 534 946 040.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="bg-white text-zinc-900">
      <section className="pt-24 pb-16 px-8 md:px-20 max-w-360 mx-auto">
        <FadeIn className="flex flex-col gap-6 max-w-2xl">
          <p className="eyebrow">Legal</p>
          <h1 className="leading-none">Privacy Policy.</h1>
          <p className="text-zinc-600 text-lg leading-relaxed">
            What we collect, why we collect it, and how we keep it safe.
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
