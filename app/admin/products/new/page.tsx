"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAdminStore } from "@/lib/stores/admin-store";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Plus, X } from "lucide-react";
import type { ProductColor } from "@/lib/data/types";

const inputCls =
  "bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors duration-200 w-full rounded";

export default function NewProductPage() {
  return (
    <Suspense>
      <NewProductForm />
    </Suspense>
  );
}

function NewProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultCollection = searchParams.get("collection") ?? "";

  const collections = useAdminStore((s) => s.collections);
  const addProduct = useAdminStore((s) => s.addProduct);

  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    tag: "",
    collectionId: defaultCollection,
  });
  const [images, setImages] = useState<string[]>([""]);
  const [colors, setColors] = useState<ProductColor[]>([]);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");

  const setField = (k: keyof typeof form, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.collectionId || !form.id || !form.name || !form.price) return;
    const filteredImages = images.filter((img) => img.trim() !== "");
    addProduct(form.collectionId, {
      id: form.id,
      name: form.name,
      description: form.description,
      price: parseFloat(form.price) || 0,
      images:
        filteredImages.length > 0
          ? filteredImages
          : ["/collections/boxers/boxersWhite.jpeg"],
      colors: colors.length > 0 ? colors : undefined,
      tag: form.tag,
      collectionId: form.collectionId,
    });
    router.push(`/admin/collections/${form.collectionId}`);
  };

  return (
    <div className="p-10 max-w-2xl">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-[0.65rem] tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors duration-200 mb-6"
      >
        <ArrowLeft size={13} />
        Products
      </Link>
      <h1 className="text-3xl font-semibold text-zinc-900 tracking-tight mb-8">
        New Product
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Collection */}
        <div>
          <label className="block text-[0.65rem] tracking-widest uppercase text-zinc-500 mb-1.5">
            Collection *
          </label>
          <select
            required
            value={form.collectionId}
            onChange={(e) => setField("collectionId", e.target.value)}
            className={inputCls}
          >
            <option value="">Select a collection</option>
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.subtitle}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[0.65rem] tracking-widest uppercase text-zinc-500 mb-1.5">
              Product ID *
            </label>
            <input
              required
              autoComplete="off"
              value={form.id}
              onChange={(e) =>
                setField(
                  "id",
                  e.target.value.toLowerCase().replace(/\s+/g, "-"),
                )
              }
              placeholder="e.g. hoodies-4"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-[0.65rem] tracking-widest uppercase text-zinc-500 mb-1.5">
              Name *
            </label>
            <input
              required
              autoComplete="off"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="e.g. Phantom Hoodie"
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className="block text-[0.65rem] tracking-widest uppercase text-zinc-500 mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            autoComplete="off"
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Product description..."
            className={inputCls + " resize-none"}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[0.65rem] tracking-widest uppercase text-zinc-500 mb-1.5">
              Price *
            </label>
            <input
              required
              autoComplete="off"
              value={form.price}
              onChange={(e) => setField("price", e.target.value)}
              placeholder="US$135"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-[0.65rem] tracking-widest uppercase text-zinc-500 mb-1.5">
              Tag
            </label>
            <input
              autoComplete="off"
              value={form.tag}
              onChange={(e) => setField("tag", e.target.value)}
              placeholder="Signature, Limited…"
              className={inputCls}
            />
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-[0.65rem] tracking-widest uppercase text-zinc-500 mb-2">
            Images (paths from /public)
          </label>
          <div className="flex flex-col gap-2">
            {images.map((img, i) => (
              <div key={i} className="flex gap-2">
                <input
                  autoComplete="off"
                  value={img}
                  onChange={(e) => {
                    const next = [...images];
                    next[i] = e.target.value;
                    setImages(next);
                  }}
                  placeholder="/collections/hoodies/hoodie.jpg"
                  className={inputCls}
                />
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, j) => j !== i))}
                    className="text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setImages([...images, ""])}
              className="inline-flex items-center gap-1.5 text-[0.65rem] tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors duration-150 self-start"
            >
              <Plus size={12} />
              Add Image
            </button>
          </div>
        </div>

        {/* Colors */}
        <div>
          <label className="block text-[0.65rem] tracking-widest uppercase text-zinc-500 mb-2">
            Color Options (optional)
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {colors.map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 border border-zinc-200 rounded px-2 py-1"
              >
                <span
                  className="w-3 h-3 rounded-full border border-zinc-200"
                  style={{ background: c.hex }}
                />
                <span className="text-xs text-zinc-700">{c.name}</span>
                <button
                  type="button"
                  onClick={() => setColors(colors.filter((_, j) => j !== i))}
                  className="text-zinc-300 hover:text-red-500 transition-colors"
                >
                  <X size={11} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              autoComplete="off"
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
              placeholder="Color name"
              className={inputCls + " flex-1"}
            />
            <input
              type="color"
              value={newColorHex}
              onChange={(e) => setNewColorHex(e.target.value)}
              className="w-10 h-10 rounded border border-zinc-200 cursor-pointer p-0.5"
            />
            <button
              type="button"
              onClick={() => {
                if (newColorName.trim()) {
                  setColors([
                    ...colors,
                    { name: newColorName.trim(), hex: newColorHex },
                  ]);
                  setNewColorName("");
                }
              }}
              className={buttonVariants({ variant: "secondary", size: "sm" })}
            >
              Add
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit">Create Product</Button>
          <Link
            href="/admin/products"
            className={buttonVariants({ variant: "secondary" })}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
