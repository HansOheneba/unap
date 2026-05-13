"use client";

import Link from "next/link";
import { useAdminStore } from "@/lib/stores/admin-store";
import { buttonVariants } from "@/components/ui/button";
import { Layers, Package, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  const collections = useAdminStore((s) => s.collections);
  const allProducts = useAdminStore((s) => s.allProducts);
  const totalProducts = allProducts().length;

  const stats = [
    {
      label: "Collections",
      value: collections.length,
      icon: Layers,
      href: "/admin/collections",
    },
    {
      label: "Products",
      value: totalProducts,
      icon: Package,
      href: "/admin/products",
    },
  ];

  return (
    <div className="p-10">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[0.65rem] tracking-[0.3em] uppercase text-zinc-400 mb-1">
          Admin
        </p>
        <h1 className="text-3xl font-semibold text-zinc-900 tracking-tight">
          Dashboard
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="group bg-white border border-zinc-200 rounded p-7 flex items-center justify-between hover:border-zinc-400 transition-colors duration-200"
          >
            <div>
              <p className="text-[0.65rem] tracking-[0.25em] uppercase text-zinc-400 mb-2">
                {label}
              </p>
              <p className="text-4xl font-semibold text-zinc-900">{value}</p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <Icon size={22} className="text-zinc-300" />
              <ArrowRight
                size={14}
                className="text-zinc-300 group-hover:text-zinc-600 transition-colors duration-200"
              />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-[0.65rem] tracking-[0.25em] uppercase text-zinc-400 mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/collections/new"
            className={buttonVariants({ variant: "default" })}
          >
            New Collection
          </Link>
          <Link
            href="/admin/products/new"
            className={buttonVariants({ variant: "outline" })}
          >
            New Product
          </Link>
        </div>
      </div>

      {/* Recent collections */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[0.65rem] tracking-[0.25em] uppercase text-zinc-400">
            Collections
          </h2>
          <Link
            href="/admin/collections"
            className="text-[0.65rem] tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors duration-200"
          >
            View all
          </Link>
        </div>
        <div className="bg-white border border-zinc-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="text-left px-5 py-3 text-[0.65rem] tracking-widest uppercase text-zinc-400 font-normal">
                  Collection
                </th>
                <th className="text-left px-5 py-3 text-[0.65rem] tracking-widest uppercase text-zinc-400 font-normal">
                  Title
                </th>
                <th className="text-right px-5 py-3 text-[0.65rem] tracking-widest uppercase text-zinc-400 font-normal">
                  Products
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {collections.map((col) => (
                <tr
                  key={col.id}
                  className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50 transition-colors duration-150"
                >
                  <td className="px-5 py-3.5 text-zinc-900 font-medium text-sm">
                    {col.subtitle}
                  </td>
                  <td className="px-5 py-3.5 text-zinc-500 text-sm">
                    {col.title}
                  </td>
                  <td className="px-5 py-3.5 text-right text-zinc-500 text-sm">
                    {col.products.length}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/collections/${col.id}`}
                      className="text-[0.65rem] tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors duration-200"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
