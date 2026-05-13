"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type MockOrder, orderStatusColor, orderStatusDot } from "@/lib/auth";
import { useOnboardingStore } from "@/lib/stores/onboarding-store";

type Tab = "orders" | "addresses" | "profile";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function AccountPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("orders");
  const orders: MockOrder[] = [];

  const {
    firstName,
    lastName,
    email,
    phone,
    whatsapp,
    sameAsPhone,
    country,
    region,
    city,
    address,
    landmark,
    birthDay,
    birthMonth,
    birthYear,
    topSize,
    bottomSize,
    reset,
  } = useOnboardingStore();

  /* ── Auth guard ── */
  useEffect(() => {
    if (!email) router.replace("/auth/login");
  }, [email, router]);

  if (!email) return null;

  const navItems: { id: Tab; label: string }[] = [
    { id: "orders", label: "My Orders" },
    { id: "addresses", label: "Addresses" },
    { id: "profile", label: "Profile" },
  ];

  const profileFields = [
    { label: "First Name", value: firstName },
    { label: "Last Name", value: lastName },
    { label: "Email", value: email },
    { label: "Phone", value: phone },
    { label: "WhatsApp", value: sameAsPhone ? phone : whatsapp },
    { label: "Country", value: country },
    ...(birthDay && birthMonth && birthYear
      ? [
          {
            label: "Birthday",
            value: `${MONTHS[parseInt(birthMonth) - 1]} ${birthDay}, ${birthYear}`,
          },
        ]
      : []),
    ...(topSize ? [{ label: "Top Size", value: topSize }] : []),
    ...(bottomSize ? [{ label: "Bottom Size", value: bottomSize }] : []),
  ];

  return (
    <main className="h-screen bg-white text-zinc-900 flex flex-col overflow-hidden">
      {/* ── Top bar ── */}
      <header className="shrink-0 flex items-center justify-between px-8 h-16 border-b border-zinc-100">
        <div>
          <p className="text-zinc-500 text-[0.55rem] tracking-[0.3em] uppercase leading-none mb-0.5">
            Account
          </p>
          <p className="text-zinc-900 text-sm font-medium leading-none">
            {firstName} {lastName}
          </p>
        </div>

        <div className="flex items-center gap-5">
          <Link
            href="/tracking"
            className="hidden md:block text-[0.6rem] tracking-widest uppercase text-zinc-500 hover:text-zinc-900 transition-colors duration-200"
          >
            Track Order
          </Link>
          <Link
            href="/collections"
            className="hidden md:block text-[0.6rem] tracking-widest uppercase text-zinc-500 hover:text-zinc-900 transition-colors duration-200"
          >
            Shop
          </Link>
          <button
            onClick={() => {
              reset();
              router.push("/auth/login");
            }}
            className="text-[0.6rem] tracking-widest uppercase text-zinc-600 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-400 px-4 py-2 transition-colors duration-200"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar ── */}
        <aside className="shrink-0 w-48 border-r border-zinc-100 flex flex-col">
          <nav className="flex flex-col pt-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`text-left px-6 py-4 text-[0.65rem] tracking-widest uppercase transition-colors duration-200 ${
                  tab === item.id
                    ? "text-zinc-900 bg-zinc-50 border-l-2 border-l-zinc-900"
                    : "text-zinc-500 hover:text-zinc-900 border-l-2 border-l-transparent hover:bg-zinc-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto border-t border-zinc-100 px-6 py-5 flex flex-col gap-3">
            <Link
              href="/tracking"
              className="text-[0.6rem] tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors duration-200"
            >
              Track Order →
            </Link>
            <Link
              href="/collections"
              className="text-[0.6rem] tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors duration-200"
            >
              Shop →
            </Link>
          </div>
        </aside>

        {/* ── Content pane ── */}
        <div className="flex-1 overflow-y-auto">
          {/* ORDERS */}
          {tab === "orders" && (
            <div>
              <div className="px-10 py-7 border-b border-zinc-100">
                <p className="text-[0.6rem] tracking-widest uppercase text-zinc-500 mb-1">
                  Order History
                </p>
                <p className="text-zinc-900 text-sm">
                  {orders.length} order{orders.length !== 1 ? "s" : ""}
                </p>
              </div>

              {orders.length === 0 ? (
                <div className="px-10 py-16 flex flex-col items-start gap-5">
                  <div>
                    <p className="text-zinc-900 text-sm mb-1.5">
                      Nothing here yet.
                    </p>
                    <p className="text-zinc-500 text-xs max-w-sm leading-relaxed">
                      Your orders will show up here after your first purchase.
                      Time to do something about that.
                    </p>
                  </div>
                  <Link
                    href="/collections"
                    className="border border-zinc-900 text-zinc-900 text-[0.65rem] tracking-widest uppercase px-6 py-3 hover:bg-zinc-900 hover:text-white transition-colors duration-300"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="px-10 py-7 border-b border-zinc-100"
                  >
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div>
                        <p className="text-zinc-900 text-sm font-medium">
                          {order.id}
                        </p>
                        <p className="text-zinc-500 text-xs mt-0.5">
                          Placed {order.date}
                        </p>
                      </div>
                      <div
                        className={`flex items-center gap-1.5 ${orderStatusColor[order.status]}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${orderStatusDot[order.status]}`}
                        />
                        <span className="text-[0.6rem] tracking-widest uppercase">
                          {order.statusLabel}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 mb-5">
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between border border-zinc-100 px-4 py-3"
                        >
                          <div>
                            <p className="text-zinc-900 text-xs">{item.name}</p>
                            <p className="text-zinc-400 text-[0.65rem] mt-0.5">
                              {item.variant} · Qty {item.qty}
                            </p>
                          </div>
                          <p className="text-zinc-700 text-xs">{item.price}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-zinc-500 text-xs">
                        Total:{" "}
                        <span className="text-zinc-900 font-medium">
                          {order.total}
                        </span>
                      </p>
                      <Link
                        href={`/tracking?q=${order.trackingNumber}`}
                        className="text-[0.6rem] tracking-widest uppercase text-zinc-500 border border-zinc-200 px-4 py-2 hover:border-zinc-400 hover:text-zinc-900 transition-colors duration-200"
                      >
                        Track →
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ADDRESSES */}
          {tab === "addresses" && (
            <div>
              <div className="px-10 py-7 border-b border-zinc-100 flex items-center justify-between">
                <div>
                  <p className="text-[0.6rem] tracking-widest uppercase text-zinc-500 mb-1">
                    Saved Addresses
                  </p>
                  <p className="text-zinc-900 text-sm">
                    {address ? "1 address" : "0 addresses"}
                  </p>
                </div>
                <button className="text-[0.6rem] tracking-widest uppercase text-zinc-500 border border-zinc-200 px-4 py-2 hover:border-zinc-400 hover:text-zinc-900 transition-colors duration-200">
                  + Add New
                </button>
              </div>

              {address ? (
                <div className="px-10 py-8">
                  <div className="border border-zinc-100 p-7 max-w-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-zinc-900 text-sm font-medium">Home</p>
                          <span className="text-[0.55rem] tracking-widest uppercase bg-zinc-100 border border-zinc-200 px-2 py-0.5 text-zinc-600">
                            Default
                          </span>
                        </div>
                        <p className="text-zinc-700 text-sm">{address}</p>
                        {city && region && (
                          <p className="text-zinc-600 text-xs">
                            {city}, {region}
                          </p>
                        )}
                        <p className="text-zinc-600 text-xs">{country}</p>
                        {landmark && (
                          <p className="text-zinc-400 text-xs mt-1">
                            Near: {landmark}
                          </p>
                        )}
                      </div>
                      <button className="text-[0.6rem] tracking-widest uppercase text-zinc-500 hover:text-zinc-900 transition-colors shrink-0">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-10 py-14">
                  <p className="text-zinc-900 text-sm mb-1.5">
                    No address saved yet.
                  </p>
                  <p className="text-zinc-500 text-xs">
                    Add a delivery address to speed up checkout.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* PROFILE */}
          {tab === "profile" && (
            <div>
              <div className="px-10 py-7 border-b border-zinc-100 flex items-center justify-between">
                <div>
                  <p className="text-[0.6rem] tracking-widest uppercase text-zinc-500 mb-1">
                    Personal Information
                  </p>
                  <p className="text-zinc-900 text-sm">
                    {firstName} {lastName}
                  </p>
                </div>
                <button className="text-[0.6rem] tracking-widest uppercase text-zinc-500 border border-zinc-200 px-4 py-2 hover:border-zinc-400 hover:text-zinc-900 transition-colors duration-200">
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-zinc-100">
                {profileFields.map((field) => (
                  <div key={field.label} className="bg-white px-8 py-6">
                    <p className="text-[0.6rem] tracking-widest uppercase text-zinc-500 mb-2">
                      {field.label}
                    </p>
                    <p className="text-zinc-900 text-sm">{field.value}</p>
                  </div>
                ))}
              </div>

              <div className="px-10 py-7 border-t border-zinc-100 flex items-center justify-between">
                <div>
                  <p className="text-[0.6rem] tracking-widest uppercase text-zinc-500 mb-1">
                    Password
                  </p>
                  <p className="text-zinc-500 text-sm tracking-widest">
                    &#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;
                  </p>
                </div>
                <button className="text-[0.6rem] tracking-widest uppercase text-zinc-500 border border-zinc-200 px-4 py-2 hover:border-zinc-400 hover:text-zinc-900 transition-colors duration-200">
                  Change
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
