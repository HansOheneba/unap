"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAdminStore } from "@/lib/stores/admin-store";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Plus, X } from "lucide-react";
import type { ProductColor } from "@/lib/data/types";

const inputCls =
  "bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors duration-200 w-full rounded";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const getProduct = useAdminStore((s) => s.getProduct);
  const updateProduct = useAdminStore((s) => s.updateProduct);
  const collections = useAdminStore((s) => s.collections);

  const product = getProduct(id);

  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price ?? "",
    tag: product?.tag ?? "",
  });
  const [images, setImages] = useState<string[]>(product?.images ?? [""]);
  const [colors, setColors] = useState<ProductColor[]>(product?.colors ?? []);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        price: product.price,
        tag: product.tag,
      });
      setImages(product.images);
      setColors(product.colors ?? []);
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!product) {
    return (
      <div className="p-10">
        <p className="text-zinc-500">Product not found.</p>
        <Link
          href="/admin/products"
          className={buttonVariants({ variant: "secondary", size: "sm" }) + " mt-4 inline-block"}
        >
          Back
        </Link>
      </div>
    );
  }

  const setField = (k: keyof typeof form, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const collection = collections.find((c) => c.id === product.collectionId);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredImages = images.filter((img) => img.trim() !== "");
    updateProduct(id, {
      ...form,
      priceNum: parseInt(form.price.replace(/[^0-9]/g, ""), 10),
      images: filteredImages.length > 0 ? filteredImages : product.images,
      colors: colors.length > 0 ? colors : undefined,
    });
    router.push(`/admin/collections/${product.collectionId}`);
  };

  return (
    <div className="p-10 max-w-2xl">
      <Link
        href={`/admin/collections/${product.collectionId}`}
        className="inline-flex items-center gap-2 text-[0.65rem] tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors duration-200 mb-6"
      >
        <ArrowLeft size={13} />
        {collection?.subtitle ?? "Collection"}
      </Link>
      <h1 className="text-3xl font-semibold text-zinc-900 tracking-tight mb-8">
        Edit — {product.name}
      </h1>

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
              Collection
            </label>
            <input
              disabled
              value={collection?.subtitle ?? product.collectionId}
              className={inputCls + " opacity-50 cursor-not-allowed"}
            />
          </div>
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
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-[0.65rem] tracking-widest uppercase text-zinc-500 mb-1.5">
            Description
          </label>
          <textarea
            rows={4}
            autoComplete="off"
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
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
              className={inputCls}
            />
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-[0.65rem] tracking-widest uppercase text-zinc-500 mb-2">
            Images
          </label>
          <div className="flex flex-col gap-2">
            {images.map((img, i) => (
              <div key={i} className="flex gap-2 items-center">
                {img.trim() !== "" && (
                  <div className="relative w-10 h-10 rounded overflow-hidden shrink-0">
                    <Image src={img} alt="" fill className="object-cover" />
                  </div>
                )}
                <input
                  autoComplete="off"
                  value={img}
                  onChange={(e) => {
                    const next = [...images];
                    next[i] = e.target.value;
                    setImages(next);
                  }}
                  placeholder="/collections/..."
                  className={inputCls}
                />
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, j) => j !== i))}
                    className="text-zinc-400 hover:text-red-500 transition-colors shrink-0"
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
            Color Options
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
                  setColors([...colors, { name: newColorName.trim(), hex: newColorHex }]);
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
          <Button type="submit">Save Changes</Button>
          <Link
            href={`/admin/collections/${product.collectionId}`}
            className={buttonVariants({ variant: "secondary" })}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
