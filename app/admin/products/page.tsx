"use client";

import Link from "next/link";
import Image from "next/image";
import { useAdminStore } from "@/lib/stores/admin-store";
import { buttonVariants } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useState } from "react";

export default function AdminProductsPage() {
  const collections = useAdminStore((s) => s.collections);
  const removeProduct = useAdminStore((s) => s.removeProduct);
  const [filter, setFilter] = useState("all");

  const visibleCollections =
    filter === "all"
      ? collections
      : collections.filter((c) => c.id === filter);

  const allProductCount = collections.reduce(
    (sum, c) => sum + c.products.length,
    0,
  );

  return (
    <div className="p-10">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[0.65rem] tracking-[0.3em] uppercase text-zinc-400 mb-1">
            Admin
          </p>
          <h1 className="text-3xl font-semibold text-zinc-900 tracking-tight">
            Products
          </h1>
          <p className="text-zinc-400 text-sm mt-1">{allProductCount} total</p>
        </div>
        <Link
          href="/admin/products/new"
          className={buttonVariants({ variant: "default", size: "sm" })}
        >
          <Plus size={14} className="mr-1.5" />
          New Product
        </Link>
      </div>

      {/* Collection filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`text-[0.65rem] tracking-widest uppercase px-3 py-1.5 rounded border transition-colors duration-150 ${
            filter === "all"
              ? "bg-black border-black text-white"
              : "border-zinc-200 text-zinc-500 hover:border-zinc-400"
          }`}
        >
          All
        </button>
        {collections.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`text-[0.65rem] tracking-widest uppercase px-3 py-1.5 rounded border transition-colors duration-150 ${
              filter === c.id
                ? "bg-black border-black text-white"
                : "border-zinc-200 text-zinc-500 hover:border-zinc-400"
            }`}
          >
            {c.subtitle}
          </button>
        ))}
      </div>

      {/* Products table */}
      <div className="bg-white border border-zinc-200 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100">
              <th className="text-left px-5 py-3 text-[0.65rem] tracking-widest uppercase text-zinc-400 font-normal w-12" />
              <th className="text-left px-5 py-3 text-[0.65rem] tracking-widest uppercase text-zinc-400 font-normal">
                Name
              </th>
              <th className="text-left px-5 py-3 text-[0.65rem] tracking-widest uppercase text-zinc-400 font-normal hidden md:table-cell">
                Collection
              </th>
              <th className="text-left px-5 py-3 text-[0.65rem] tracking-widest uppercase text-zinc-400 font-normal hidden md:table-cell">
                Tag
              </th>
              <th className="text-right px-5 py-3 text-[0.65rem] tracking-widest uppercase text-zinc-400 font-normal">
                Price
              </th>
              <th className="px-5 py-3 w-24" />
            </tr>
          </thead>
          <tbody>
            {visibleCollections.map((col) =>
              col.products.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50 transition-colors duration-150"
                >
                  <td className="px-5 py-3">
                    <div className="relative w-9 h-9 rounded overflow-hidden">
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="36px"
                      />
                    </div>
                  </td>
                  <td className="px-5 py-3 text-zinc-900 font-medium">
                    {p.name}
                  </td>
                  <td className="px-5 py-3 text-zinc-500 hidden md:table-cell">
                    {col.subtitle}
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="text-[0.6rem] tracking-widest uppercase bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded">
                      {p.tag}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right text-zinc-900">
                    {p.price}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className={buttonVariants({ variant: "ghost", size: "icon-xs" }) + " text-zinc-400 hover:text-zinc-900"}
                      >
                        <Pencil size={13} />
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm(`Remove "${p.name}"?`))
                            removeProduct(p.id);
                        }}
                        className={buttonVariants({ variant: "ghost", size: "icon-xs" }) + " text-zinc-400 hover:text-red-500"}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
