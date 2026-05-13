"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminStore } from "@/lib/stores/admin-store";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const inputCls =
  "bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors duration-200 w-full rounded";

export default function NewCollectionPage() {
  const router = useRouter();
  const addCollection = useAdminStore((s) => s.addCollection);

  const [form, setForm] = useState({
    id: "",
    subtitle: "",
    title: "",
    tagline: "",
    featured: "",
    align: "left" as "left" | "right",
    cols: 3 as 3 | 4,
  });

  const set = (k: keyof typeof form, v: string | number) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id || !form.subtitle || !form.title) return;
    addCollection({
      ...form,
      href: `/collections/${form.id}`,
    });
    router.push("/admin/collections");
  };

  return (
    <div className="p-10 max-w-2xl">
      {/* Header */}
      <Link
        href="/admin/collections"
        className="inline-flex items-center gap-2 text-[0.65rem] tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors duration-200 mb-6"
      >
        <ArrowLeft size={13} />
        Collections
      </Link>
      <h1 className="text-3xl font-semibold text-zinc-900 tracking-tight mb-8">
        New Collection
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[0.65rem] tracking-widest uppercase text-zinc-500 mb-1.5">
              ID (slug) *
            </label>
            <input
              required
              autoComplete="off"
              value={form.id}
              onChange={(e) => set("id", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
              placeholder="e.g. jackets"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-[0.65rem] tracking-widest uppercase text-zinc-500 mb-1.5">
              Subtitle *
            </label>
            <input
              required
              autoComplete="off"
              value={form.subtitle}
              onChange={(e) => set("subtitle", e.target.value)}
              placeholder="e.g. Jackets"
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className="block text-[0.65rem] tracking-widest uppercase text-zinc-500 mb-1.5">
            Collection Title *
          </label>
          <input
            required
            autoComplete="off"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. The Outer Layer"
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-[0.65rem] tracking-widest uppercase text-zinc-500 mb-1.5">
            Tagline
          </label>
          <input
            autoComplete="off"
            value={form.tagline}
            onChange={(e) => set("tagline", e.target.value)}
            placeholder="Short brand line for the collection"
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-[0.65rem] tracking-widest uppercase text-zinc-500 mb-1.5">
            Cover Image Path
          </label>
          <input
            autoComplete="off"
            value={form.featured}
            onChange={(e) => set("featured", e.target.value)}
            placeholder="/collections/jackets/cover.jpg"
            className={inputCls}
          />
          <p className="text-zinc-400 text-xs mt-1">
            Path relative to /public — this is the hero banner image.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[0.65rem] tracking-widest uppercase text-zinc-500 mb-1.5">
              Hero Text Alignment
            </label>
            <select
              value={form.align}
              onChange={(e) => set("align", e.target.value as "left" | "right")}
              className={inputCls}
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div>
            <label className="block text-[0.65rem] tracking-widest uppercase text-zinc-500 mb-1.5">
              Product Grid Columns
            </label>
            <select
              value={form.cols}
              onChange={(e) => set("cols", Number(e.target.value) as 3 | 4)}
              className={inputCls}
            >
              <option value={3}>3 Columns</option>
              <option value={4}>4 Columns</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit">Create Collection</Button>
          <Link
            href="/admin/collections"
            className={buttonVariants({ variant: "secondary" })}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
