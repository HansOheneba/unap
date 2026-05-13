"use client";

import Link from "next/link";
import Image from "next/image";
import { useAdminStore } from "@/lib/stores/admin-store";
import { buttonVariants } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function AdminCollectionsPage() {
  const collections = useAdminStore((s) => s.collections);
  const removeCollection = useAdminStore((s) => s.removeCollection);

  return (
    <div className="p-10">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[0.65rem] tracking-[0.3em] uppercase text-zinc-400 mb-1">
            Admin
          </p>
          <h1 className="text-3xl font-semibold text-zinc-900 tracking-tight">
            Collections
          </h1>
        </div>
        <Link
          href="/admin/collections/new"
          className={buttonVariants({ variant: "default", size: "sm" })}
        >
          <Plus size={14} className="mr-1.5" />
          New Collection
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {collections.map((col) => (
          <div
            key={col.id}
            className="bg-white border border-zinc-200 rounded overflow-hidden group"
          >
            {/* Cover image */}
            <div className="relative h-44 overflow-hidden">
              <Image
                src={col.featured}
                alt={col.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-0 left-0 p-4">
                <p className="text-[0.6rem] tracking-widest uppercase text-white/70 mb-0.5">
                  {col.subtitle}
                </p>
                <p className="text-white font-semibold text-base leading-tight">
                  {col.title}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="p-4">
              <p className="text-zinc-500 text-sm line-clamp-2 mb-4">
                {col.tagline}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[0.65rem] tracking-widest uppercase text-zinc-400">
                  {col.products.length} product
                  {col.products.length !== 1 ? "s" : ""}
                </span>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/collections/${col.id}`}
                    className={buttonVariants({
                      variant: "secondary",
                      size: "xs",
                    })}
                  >
                    <Pencil size={12} className="mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          `Delete "${col.title}"? This will also remove all its products.`,
                        )
                      ) {
                        removeCollection(col.id);
                      }
                    }}
                    className={
                      buttonVariants({ variant: "ghost", size: "icon-xs" }) +
                      " text-zinc-400 hover:text-red-500"
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
