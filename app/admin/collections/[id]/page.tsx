"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAdminStore } from "@/lib/stores/admin-store";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2, Plus } from "lucide-react";

const inputCls =
  "bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors duration-200 w-full rounded";

export default function EditCollectionPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const getCollection = useAdminStore((s) => s.getCollection);
  const updateCollection = useAdminStore((s) => s.updateCollection);
  const removeProduct = useAdminStore((s) => s.removeProduct);

  const col = getCollection(id);

  const [form, setForm] = useState({
    subtitle: col?.subtitle ?? "",
    title: col?.title ?? "",
    tagline: col?.tagline ?? "",
    featured: col?.featured ?? "",
    align: (col?.align ?? "left") as "left" | "right",
    cols: (col?.cols ?? 3) as 3 | 4,
  });

  useEffect(() => {
    if (col) {
      setForm({
        subtitle: col.subtitle,
        title: col.title,
        tagline: col.tagline,
        featured: col.featured,
        align: col.align,
        cols: col.cols,
      });
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!col) {
    return (
      <div className="p-10">
        <p className="text-zinc-500">Collection not found.</p>
        <Link
          href="/admin/collections"
          className={
            buttonVariants({ variant: "secondary", size: "sm" }) +
            " mt-4 inline-block"
          }
        >
          Back
        </Link>
      </div>
    );
  }

  const set = (k: keyof typeof form, v: string | number) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCollection(id, form);
    router.push("/admin/collections");
  };

  return (
    <div className="p-10">
      {/* Header */}
      <Link
        href="/admin/collections"
        className="inline-flex items-center gap-2 text-[0.65rem] tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors duration-200 mb-6"
      >
        <ArrowLeft size={13} />
        Collections
      </Link>
      <h1 className="text-3xl font-semibold text-zinc-900 tracking-tight mb-8">
        Edit — {col.subtitle}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: collection form */}
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.65rem] tracking-widest uppercase text-zinc-500 mb-1.5">
                ID
              </label>
              <input
                disabled
                value={id}
                className={inputCls + " opacity-50 cursor-not-allowed"}
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
              className={inputCls}
            />
            {form.featured && (
              <div className="mt-2 relative h-28 rounded overflow-hidden">
                <Image
                  src={form.featured}
                  alt="Cover preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.65rem] tracking-widest uppercase text-zinc-500 mb-1.5">
                Hero Text Alignment
              </label>
              <select
                value={form.align}
                onChange={(e) =>
                  set("align", e.target.value as "left" | "right")
                }
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
            <Button type="submit">Save Changes</Button>
            <Link
              href="/admin/collections"
              className={buttonVariants({ variant: "secondary" })}
            >
              Cancel
            </Link>
          </div>
        </form>

        {/* Right: products in this collection */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[0.65rem] tracking-[0.25em] uppercase text-zinc-400">
              Products ({col.products.length})
            </h2>
            <Link
              href={`/admin/products/new?collection=${id}`}
              className={buttonVariants({ variant: "secondary", size: "xs" })}
            >
              <Plus size={12} className="mr-1" />
              Add Product
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            {col.products.length === 0 && (
              <p className="text-zinc-400 text-sm">No products yet.</p>
            )}
            {col.products.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 bg-white border border-zinc-200 rounded p-3"
              >
                <div className="relative w-10 h-10 rounded overflow-hidden shrink-0">
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-900 text-sm font-medium truncate">
                    {p.name}
                  </p>
                  <p className="text-zinc-400 text-xs">{p.price}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className={
                      buttonVariants({ variant: "ghost", size: "icon-xs" }) +
                      " text-zinc-400 hover:text-zinc-900"
                    }
                  >
                    <Pencil size={12} />
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm(`Remove "${p.name}"?`)) removeProduct(p.id);
                    }}
                    className={
                      buttonVariants({ variant: "ghost", size: "icon-xs" }) +
                      " text-zinc-400 hover:text-red-500"
                    }
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
