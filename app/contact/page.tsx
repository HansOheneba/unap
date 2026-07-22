"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { submitContact } from "@/lib/api/forms";
import { ApiError } from "@/lib/api/client";

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

const inputClass =
  "bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-5 py-3.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors duration-300 w-full";

const directLines = [
  {
    icon: Phone,
    label: "Call or Text",
    value: "+233 534 946 040",
    href: "tel:+233534946040",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@mail.unapologeticnm.com",
    href: "mailto:hello@mail.unapologeticnm.com",
  },
  {
    icon: MapPin,
    label: "Based In",
    value: "Accra, Ghana. Shipping worldwide.",
  },
];

const quickLinks = [
  { label: "Track an Order", href: "/tracking" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "Join the Inner Circle", href: "/inner-circle" },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("Order Support");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setFormError("");
    setSubmitting(true);
    try {
      await submitContact({
        name: name.trim(),
        email: email.trim(),
        topic,
        message: message.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setFormError(
        err instanceof ApiError
          ? err.message
          : "Could not send your message. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="bg-white text-zinc-900">
      {/* ── HEADER ── */}
      <section className="pt-24 pb-16 px-8 md:px-20 max-w-360 mx-auto">
        <FadeIn className="flex flex-col gap-6 max-w-2xl">
          <p className="eyebrow">Get in Touch</p>
          <h1 className="leading-none">Talk to Us. Directly.</h1>
          <p className="text-zinc-600 text-lg leading-relaxed">
            No chatbots. No ticket numbers that go nowhere. Reach a real
            person for orders, sizing, press, or anything else on your mind.
          </p>
        </FadeIn>
      </section>

      {/* ── BODY: direct info + form ── */}
      <section className="px-8 md:px-20 pb-32 max-w-360 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-12">
          {/* Left: direct contact info */}
          <div className="md:col-span-5 flex flex-col gap-10">
            <FadeIn className="flex flex-col gap-8">
              {directLines.map((line) => {
                const Icon = line.icon;
                const content = (
                  <div className="flex items-start gap-4">
                    <Icon
                      size={20}
                      strokeWidth={1.5}
                      className="text-zinc-400 mt-0.5 shrink-0"
                    />
                    <div className="flex flex-col gap-1">
                      <p className="eyebrow text-zinc-400">{line.label}</p>
                      <p className="text-zinc-900 font-medium">{line.value}</p>
                    </div>
                  </div>
                );
                return (
                  <div key={line.label} className="border-t border-zinc-100 pt-8 first:border-t-0 first:pt-0">
                    {line.href ? (
                      <a
                        href={line.href}
                        className="hover:opacity-70 transition-opacity duration-300"
                      >
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </div>
                );
              })}
            </FadeIn>

            <FadeIn delay={0.15} className="flex flex-col gap-4 pt-4">
              <p className="eyebrow text-zinc-400">Follow the Movement</p>
              <a
                href="https://www.instagram.com/unapologeticnm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-900 font-medium border-b border-zinc-900 pb-1 w-fit hover:opacity-70 transition-opacity duration-300"
              >
                @unapologeticnm
              </a>
            </FadeIn>

            <FadeIn delay={0.25} className="flex flex-col gap-4 pt-6 border-t border-zinc-100">
              <p className="eyebrow text-zinc-400">Before You Reach Out</p>
              <div className="flex flex-col gap-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-zinc-600 text-sm hover:text-zinc-900 transition-colors duration-300 w-fit border-b border-transparent hover:border-zinc-300 pb-0.5"
                  >
                    {link.label} &rarr;
                  </Link>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Right: form */}
          <div className="md:col-span-7">
            <FadeIn delay={0.1} className="bg-zinc-50 border border-zinc-100 p-8 md:p-12">
              {submitted ? (
                <div className="flex flex-col gap-4 py-10 items-start">
                  <p className="eyebrow text-zinc-900">Message Received.</p>
                  <p className="text-zinc-600 leading-relaxed max-w-sm">
                    We read every message ourselves. Expect a reply within one
                    business day. Until then, stay unapologetic.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName("");
                      setEmail("");
                      setMessage("");
                      setTopic("Order Support");
                    }}
                    className="text-zinc-500 text-sm underline underline-offset-4 hover:text-zinc-900 transition-colors duration-300 mt-2"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="contact-name" className="eyebrow text-zinc-500">
                        Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Kwame Mensah"
                        className={inputClass}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="contact-email" className="eyebrow text-zinc-500">
                        Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-topic" className="eyebrow text-zinc-500">
                      Topic
                    </label>
                    <select
                      id="contact-topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className={`${inputClass} appearance-none cursor-pointer`}
                    >
                      <option>Order Support</option>
                      <option>Sizing &amp; Fit</option>
                      <option>Returns &amp; Exchanges</option>
                      <option>Wholesale &amp; Press</option>
                      <option>Something Else</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-message" className="eyebrow text-zinc-500">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us what's going on..."
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {formError && (
                    <p className="text-red-500 text-xs border border-red-400/30 bg-red-400/5 px-4 py-3">
                      {formError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className={buttonVariants({ className: "mt-2 w-fit disabled:opacity-50" })}
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </FadeIn>
          </div>
        </div>
      </section>
    </main>
  );
}
