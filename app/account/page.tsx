"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Package,
  Heart,
  MapPin,
  User as UserIcon,
  Truck,
  ShoppingBag,
  LogOut,
  ChevronRight,
  X,
} from "lucide-react";
import { mockOrders, orderStatusPill, type UserAddress } from "@/lib/auth";
import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { getProductBySlug, type Product } from "@/lib/products";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import QuickAddModal from "@/components/products/QuickAddModal";
import { toast } from "@/lib/stores/toast-store";
import { formatPrice } from "@/lib/currency";
import { cn } from "@/lib/utils";

const inputCls =
  "bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition-colors duration-200 w-full";

type Tab = "orders" | "wishlist" | "addresses" | "profile";

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

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[0.6rem] tracking-widest uppercase text-zinc-600 font-medium">
        {label}
      </label>
      {children}
      {error && <p className="text-red-600 text-[0.65rem]">{error}</p>}
    </div>
  );
}

const VALID_TABS: Tab[] = ["orders", "wishlist", "addresses", "profile"];

export default function AccountPage() {
  return (
    <Suspense fallback={null}>
      <AccountPageInner />
    </Suspense>
  );
}

function AccountPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (() => {
    const t = searchParams.get("tab");
    return t && (VALID_TABS as string[]).includes(t) ? (t as Tab) : "orders";
  })();
  const [tab, setTab] = useState<Tab>(initialTab);
  const orders = mockOrders;

  // ── Wishlist ─────────────────────────────────────────────────────────
  const wishlistItems = useWishlistStore((s) => s.items);
  const removeWishlist = useWishlistStore((s) => s.remove);
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);

  // ── Profile edit state ──────────────────────────────────────────────
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    whatsapp: "",
    topSize: "",
    bottomSize: "",
  });

  // ── Change password state ───────────────────────────────────────────
  const [changingPassword, setChangingPassword] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({});
  const [pwSaved, setPwSaved] = useState(false);

  // ── Address state ───────────────────────────────────────────────────
  type AddrForm = Omit<UserAddress, "id" | "isDefault">;
  const ADDR_BLANK: AddrForm = {
    label: "Home",
    country: "",
    region: "",
    city: "",
    address: "",
    landmark: "",
  };
  const [addingAddress, setAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrForm, setAddrForm] = useState<AddrForm>(ADDR_BLANK);
  const [addrErrors, setAddrErrors] = useState<Record<string, string>>({});

  // ── Confirmation modals ─────────────────────────────────────────────
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [confirmDeleteAddrId, setConfirmDeleteAddrId] = useState<string | null>(
    null,
  );
  const [confirmRemoveWishlistId, setConfirmRemoveWishlistId] = useState<
    string | null
  >(null);

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
    setField,
    reset,
  } = useOnboardingStore();

  // Local addresses list seeded from onboarding store delivery info
  const [addresses, setAddresses] = useState<UserAddress[]>(() =>
    address
      ? [
          {
            id: "addr_001",
            label: "Home",
            country,
            region,
            city,
            address,
            landmark,
            isDefault: true,
          },
        ]
      : [],
  );

  /* ── Auth guard ── */
  useEffect(() => {
    if (!email) {
      const nextUrl = tab === "orders" ? "/account" : `/account?tab=${tab}`;
      router.replace(`/auth/login?next=${encodeURIComponent(nextUrl)}`);
    }
  }, [email, router, tab]);

  if (!email) return null;

  // ── Profile handlers ─────────────────────────────────────────────────
  function openEditProfile() {
    setProfileDraft({
      firstName,
      lastName,
      email,
      phone,
      whatsapp: sameAsPhone ? phone : whatsapp,
      topSize,
      bottomSize,
    });
    setEditingProfile(true);
  }
  function saveProfile() {
    setField("firstName", profileDraft.firstName);
    setField("lastName", profileDraft.lastName);
    setField("email", profileDraft.email);
    setField("phone", profileDraft.phone || "+");
    setField("whatsapp", profileDraft.whatsapp || "+");
    setField("topSize", profileDraft.topSize);
    setField("bottomSize", profileDraft.bottomSize);
    setEditingProfile(false);
    toast.success("Profile updated", "Your account details have been saved.");
  }

  // ── Password handlers ────────────────────────────────────────────────
  function validatePassword() {
    const e: Record<string, string> = {};
    if (!pwForm.current.trim()) e.current = "Required";
    if (pwForm.next.length < 8) e.next = "Minimum 8 characters";
    if (pwForm.next !== pwForm.confirm) e.confirm = "Passwords do not match";
    setPwErrors(e);
    return Object.keys(e).length === 0;
  }
  async function savePassword() {
    if (!validatePassword()) return;
    await new Promise((r) => setTimeout(r, 700));
    setPwSaved(true);
    toast.success(
      "Password updated",
      "Use your new password next time you sign in.",
    );
    setTimeout(() => {
      setChangingPassword(false);
      setPwSaved(false);
      setPwForm({ current: "", next: "", confirm: "" });
      setPwErrors({});
    }, 1500);
  }

  // ── Address handlers ─────────────────────────────────────────────────
  function validateAddr() {
    const e: Record<string, string> = {};
    if (!addrForm.address.trim()) e.address = "Required";
    if (!addrForm.city.trim()) e.city = "Required";
    if (!addrForm.country.trim()) e.country = "Required";
    setAddrErrors(e);
    return Object.keys(e).length === 0;
  }
  function openAddAddress() {
    setAddrForm(ADDR_BLANK);
    setAddrErrors({});
    setEditingAddressId(null);
    setAddingAddress(true);
  }
  function openEditAddress(addr: UserAddress) {
    setAddrForm({
      label: addr.label,
      country: addr.country,
      region: addr.region,
      city: addr.city,
      address: addr.address,
      landmark: addr.landmark,
    });
    setAddrErrors({});
    setEditingAddressId(addr.id);
    setAddingAddress(true);
  }
  function saveAddress() {
    if (!validateAddr()) return;
    const isEdit = !!editingAddressId;
    if (editingAddressId) {
      setAddresses((prev) =>
        prev.map((a) =>
          a.id === editingAddressId ? { ...a, ...addrForm } : a,
        ),
      );
    } else {
      const newAddr: UserAddress = {
        ...addrForm,
        id: `addr_${Date.now()}`,
        isDefault: addresses.length === 0,
      };
      setAddresses((prev) => [...prev, newAddr]);
    }
    setAddingAddress(false);
    toast.success(
      isEdit ? "Address updated" : "Address saved",
      `${addrForm.label || "Address"} \u00b7 ${addrForm.city || addrForm.country}`,
    );
  }
  function deleteAddress(id: string) {
    const addr = addresses.find((a) => a.id === id);
    setAddresses((prev) => {
      const filtered = prev.filter((a) => a.id !== id);
      if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
    toast.info(
      "Address removed",
      addr ? `${addr.label} is no longer saved.` : undefined,
    );
  }
  function setDefaultAddress(id: string) {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    toast.success("Default address updated");
  }

  async function handleSignOut() {
    setSigningOut(true);
    // Brief pause so the user perceives the action
    await new Promise((r) => setTimeout(r, 400));
    reset();
    setConfirmSignOut(false);
    setSigningOut(false);
    toast.info("Signed out", "You've been logged out of your account.");
    router.push("/auth/login");
  }

  function confirmWishlistRemoval(id: string) {
    const item = wishlistItems.find((w) => w.id === id);
    removeWishlist(id);
    setConfirmRemoveWishlistId(null);
    toast.info("Removed from wishlist", item?.name);
  }

  const accountNav: {
    id: Tab;
    label: string;
    icon: React.ElementType;
    count?: number;
  }[] = [
    { id: "orders", label: "My Orders", icon: Package, count: orders.length },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: Heart,
      count: wishlistItems.length,
    },
    {
      id: "addresses",
      label: "Addresses",
      icon: MapPin,
      count: addresses.length,
    },
    { id: "profile", label: "Profile", icon: UserIcon },
  ];

  const supportNav = [
    { href: "/tracking", label: "Track Order", icon: Truck },
    { href: "/collections", label: "Continue Shopping", icon: ShoppingBag },
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
            value: `${MONTHS[parseInt(birthMonth) - 1] ?? birthMonth} ${birthDay}, ${birthYear}`,
          },
        ]
      : []),
    ...(topSize ? [{ label: "Top Size", value: topSize }] : []),
    ...(bottomSize ? [{ label: "Bottom Size", value: bottomSize }] : []),
  ];

  const sectionTitle: Record<Tab, string> = {
    orders: "My Orders",
    wishlist: "My Wishlist",
    addresses: "Address Book",
    profile: "Personal Information",
  };
  const sectionSubtitle: Record<Tab, string> = {
    orders: "Track and review every purchase you've made.",
    wishlist: "Pieces you've saved for later.",
    addresses: "Manage where we deliver.",
    profile: "Keep your details current for faster checkout.",
  };

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="max-w-360 mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="text-xs text-zinc-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-zinc-900 transition-colors">
            Home
          </Link>
          <ChevronRight size={12} className="text-zinc-300" />
          <span className="text-zinc-900">My Account</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* ── SIDEBAR ───────────────────────────────────────────── */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
              {/* User card */}
              <div className="px-5 py-5 border-b border-zinc-100 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-medium shrink-0">
                  {(firstName?.[0] ?? "?").toUpperCase()}
                  {(lastName?.[0] ?? "").toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">
                    {firstName} {lastName}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">{email}</p>
                </div>
              </div>

              {/* Account nav */}
              <div className="py-2">
                <p className="px-5 pt-2 pb-1.5 text-[10px] tracking-[0.2em] uppercase text-zinc-400 font-medium">
                  Account
                </p>
                {accountNav.map((item) => {
                  const Icon = item.icon;
                  const active = tab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setTab(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-colors border-l-2",
                        active
                          ? "bg-zinc-50 text-zinc-900 border-l-zinc-900 font-medium"
                          : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 border-l-transparent",
                      )}
                    >
                      <Icon size={16} strokeWidth={active ? 2 : 1.6} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {typeof item.count === "number" && item.count > 0 && (
                        <span
                          className={cn(
                            "text-[10px] tabular-nums px-1.5 py-0.5 rounded-full border",
                            active
                              ? "bg-zinc-900 text-white border-zinc-900"
                              : "bg-zinc-100 text-zinc-600 border-zinc-200",
                          )}
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Support nav */}
              <div className="py-2 border-t border-zinc-100">
                <p className="px-5 pt-2 pb-1.5 text-[10px] tracking-[0.2em] uppercase text-zinc-400 font-medium">
                  Support
                </p>
                {supportNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 border-l-2 border-l-transparent transition-colors"
                    >
                      <Icon size={16} strokeWidth={1.6} />
                      <span className="flex-1 text-left">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Sign out */}
              <div className="border-t border-zinc-100 p-3">
                <button
                  onClick={() => setConfirmSignOut(true)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-zinc-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut size={16} strokeWidth={1.6} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* ── CONTENT ─────────────────────────────────────────── */}
          <section className="flex-1 min-w-0">
            <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
              {/* Section header */}
              <div className="px-6 md:px-8 py-6 border-b border-zinc-100">
                <h1 className="text-xl md:text-2xl font-medium text-zinc-900">
                  {sectionTitle[tab]}
                </h1>
                <p className="text-sm text-zinc-600 mt-1">
                  {sectionSubtitle[tab]}
                </p>
              </div>

              {/* ── ORDERS ─────────────────────────────────────── */}
              {tab === "orders" && (
                <div className="p-6 md:p-8">
                  {orders.length === 0 ? (
                    <div className="py-12 text-center">
                      <Package
                        className="w-10 h-10 text-zinc-300 mx-auto mb-3"
                        strokeWidth={1.5}
                      />
                      <p className="text-zinc-900 text-sm font-medium mb-1">
                        No orders yet
                      </p>
                      <p className="text-zinc-500 text-xs mb-5">
                        Your orders will show up here after your first purchase.
                      </p>
                      <Link
                        href="/collections"
                        className="inline-block bg-zinc-900 text-white text-xs tracking-widest uppercase px-6 py-3 hover:bg-zinc-700 transition-colors"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {orders.map((order) => (
                        <article
                          key={order.id}
                          className="border border-zinc-200 rounded-lg overflow-hidden hover:border-zinc-300 transition-colors"
                        >
                          {/* Order header */}
                          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 bg-zinc-50 border-b border-zinc-200">
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                              <div>
                                <p className="text-[10px] tracking-widest uppercase text-zinc-500">
                                  Order
                                </p>
                                <p className="text-sm font-medium text-zinc-900">
                                  {order.id}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] tracking-widest uppercase text-zinc-500">
                                  Placed
                                </p>
                                <p className="text-sm text-zinc-700">
                                  {order.date}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] tracking-widest uppercase text-zinc-500">
                                  Total
                                </p>
                                <p className="text-sm font-medium text-zinc-900">
                                  {order.total}
                                </p>
                              </div>
                            </div>
                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase border px-2.5 py-1 rounded-full font-medium",
                                orderStatusPill[order.status],
                              )}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {order.statusLabel}
                            </span>
                          </div>

                          {/* Order items */}
                          <div className="divide-y divide-zinc-100">
                            {order.items.map((item, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between gap-4 px-5 py-3.5"
                              >
                                <div className="min-w-0">
                                  <p className="text-sm text-zinc-900 truncate">
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-zinc-500 mt-0.5">
                                    {item.variant} · Qty {item.qty}
                                  </p>
                                </div>
                                <p className="text-sm text-zinc-700 shrink-0">
                                  {item.price}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-zinc-100 bg-zinc-50">
                            <Link
                              href={`/tracking?id=${encodeURIComponent(order.trackingNumber)}`}
                              className="text-[10px] tracking-widest uppercase text-zinc-600 hover:text-zinc-900 px-3 py-2 transition-colors"
                            >
                              Track
                            </Link>
                            <Link
                              href={`/account/orders/${order.id}`}
                              className="text-[10px] tracking-widest uppercase bg-zinc-900 text-white px-4 py-2 hover:bg-zinc-700 transition-colors"
                            >
                              View Details
                            </Link>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── WISHLIST ───────────────────────────────────── */}
              {tab === "wishlist" && (
                <div className="p-6 md:p-8">
                  {wishlistItems.length === 0 ? (
                    <div className="py-12 text-center">
                      <Heart
                        className="w-10 h-10 text-zinc-300 mx-auto mb-3"
                        strokeWidth={1.5}
                      />
                      <p className="text-zinc-900 text-sm font-medium mb-1">
                        Your wishlist is empty
                      </p>
                      <p className="text-zinc-500 text-xs mb-5">
                        Save pieces you love to find them again later.
                      </p>
                      <Link
                        href="/collections"
                        className="inline-block bg-zinc-900 text-white text-xs tracking-widest uppercase px-6 py-3 hover:bg-zinc-700 transition-colors"
                      >
                        Browse Collections
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {wishlistItems.map((item) => (
                        <div
                          key={item.id}
                          className="border border-zinc-200 rounded-lg overflow-hidden group"
                        >
                          <Link
                            href={`/collections/${item.category}/${item.slug}`}
                            className="block relative aspect-4/5 bg-zinc-100"
                          >
                            {item.img && (
                              <Image
                                src={item.img}
                                alt={item.name}
                                fill
                                sizes="(max-width:768px) 50vw, 25vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            )}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setConfirmRemoveWishlistId(item.id);
                              }}
                              aria-label="Remove from wishlist"
                              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-zinc-700 hover:text-red-600 flex items-center justify-center transition-colors shadow-sm"
                            >
                              <X size={14} />
                            </button>
                          </Link>
                          <div className="p-3">
                            <Link
                              href={`/collections/${item.category}/${item.slug}`}
                              className="block"
                            >
                              <p className="text-sm text-zinc-900 truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-zinc-500 mt-0.5">
                                {formatPrice(item.price)}
                              </p>
                            </Link>
                            <button
                              onClick={() => {
                                const product = getProductBySlug(item.id);
                                if (!product) {
                                  toast.error(
                                    "Product unavailable",
                                    "This piece is no longer in our catalog.",
                                  );
                                  return;
                                }
                                setQuickAddProduct(product);
                              }}
                              className="mt-3 w-full text-[10px] tracking-widest uppercase border border-zinc-900 text-zinc-900 py-2 hover:bg-zinc-900 hover:text-white transition-colors"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── ADDRESSES ──────────────────────────────────── */}
              {tab === "addresses" && (
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-sm text-zinc-600">
                      {addresses.length} saved address
                      {addresses.length === 1 ? "" : "es"}
                    </p>
                    {!addingAddress && (
                      <Button
                        variant="secondary"
                        size="xs"
                        onClick={openAddAddress}
                      >
                        + Add New
                      </Button>
                    )}
                  </div>

                  {/* Add / Edit form */}
                  {addingAddress && (
                    <div className="border border-zinc-200 rounded-lg p-5 md:p-6 mb-6 bg-zinc-50">
                      <p className="text-xs tracking-widest uppercase text-zinc-700 font-medium mb-5">
                        {editingAddressId ? "Edit Address" : "New Address"}
                      </p>
                      <div className="flex flex-col gap-4 max-w-lg">
                        <Field label="Label (e.g. Home, Office)">
                          <input
                            type="text"
                            value={addrForm.label}
                            onChange={(e) =>
                              setAddrForm((f) => ({
                                ...f,
                                label: e.target.value,
                              }))
                            }
                            placeholder="Home"
                            autoComplete="off"
                            className={inputCls}
                          />
                        </Field>
                        <Field
                          label="Street Address"
                          error={addrErrors.address}
                        >
                          <input
                            type="text"
                            value={addrForm.address}
                            onChange={(e) =>
                              setAddrForm((f) => ({
                                ...f,
                                address: e.target.value,
                              }))
                            }
                            placeholder="14 Independence Ave"
                            autoComplete="street-address"
                            className={inputCls}
                          />
                        </Field>
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="City" error={addrErrors.city}>
                            <input
                              type="text"
                              value={addrForm.city}
                              onChange={(e) =>
                                setAddrForm((f) => ({
                                  ...f,
                                  city: e.target.value,
                                }))
                              }
                              placeholder="Accra"
                              autoComplete="address-level2"
                              className={inputCls}
                            />
                          </Field>
                          <Field label="Region / State">
                            <input
                              type="text"
                              value={addrForm.region}
                              onChange={(e) =>
                                setAddrForm((f) => ({
                                  ...f,
                                  region: e.target.value,
                                }))
                              }
                              placeholder="Greater Accra"
                              autoComplete="address-level1"
                              className={inputCls}
                            />
                          </Field>
                        </div>
                        <Field label="Country" error={addrErrors.country}>
                          <input
                            type="text"
                            value={addrForm.country}
                            onChange={(e) =>
                              setAddrForm((f) => ({
                                ...f,
                                country: e.target.value,
                              }))
                            }
                            placeholder="Ghana"
                            autoComplete="country-name"
                            className={inputCls}
                          />
                        </Field>
                        <Field label="Landmark (optional)">
                          <input
                            type="text"
                            value={addrForm.landmark}
                            onChange={(e) =>
                              setAddrForm((f) => ({
                                ...f,
                                landmark: e.target.value,
                              }))
                            }
                            placeholder="Near Osu Oxford Street"
                            autoComplete="off"
                            className={inputCls}
                          />
                        </Field>
                        <div className="flex gap-3 mt-1">
                          <Button size="sm" onClick={saveAddress}>
                            Save Address
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setAddingAddress(false);
                              setAddrErrors({});
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Address list */}
                  {addresses.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className={cn(
                            "border rounded-lg p-5 transition-colors",
                            addr.isDefault
                              ? "border-zinc-900 bg-zinc-50"
                              : "border-zinc-200 hover:border-zinc-300",
                          )}
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-zinc-900">
                                {addr.label}
                              </p>
                              {addr.isDefault && (
                                <span className="text-[9px] tracking-widest uppercase bg-zinc-900 text-white px-2 py-0.5 rounded-full font-medium">
                                  Default
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="space-y-1 mb-4">
                            <p className="text-sm text-zinc-800">
                              {addr.address}
                            </p>
                            {addr.city && (
                              <p className="text-sm text-zinc-600">
                                {addr.city}
                                {addr.region ? `, ${addr.region}` : ""}
                              </p>
                            )}
                            <p className="text-sm text-zinc-600">
                              {addr.country}
                            </p>
                            {addr.landmark && (
                              <p className="text-xs text-zinc-500 italic mt-2">
                                Near: {addr.landmark}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-100">
                            <button
                              onClick={() => openEditAddress(addr)}
                              className="text-[10px] tracking-widest uppercase text-zinc-700 hover:text-zinc-900 transition-colors"
                            >
                              Edit
                            </button>
                            {!addr.isDefault && (
                              <>
                                <span className="text-zinc-300">·</span>
                                <button
                                  onClick={() => setDefaultAddress(addr.id)}
                                  className="text-[10px] tracking-widest uppercase text-zinc-700 hover:text-zinc-900 transition-colors"
                                >
                                  Set Default
                                </button>
                              </>
                            )}
                            <span className="text-zinc-300">·</span>
                            <button
                              onClick={() => setConfirmDeleteAddrId(addr.id)}
                              className="text-[10px] tracking-widest uppercase text-red-600 hover:text-red-700 transition-colors ml-auto"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : !addingAddress ? (
                    <div className="py-12 text-center">
                      <MapPin
                        className="w-10 h-10 text-zinc-300 mx-auto mb-3"
                        strokeWidth={1.5}
                      />
                      <p className="text-zinc-900 text-sm font-medium mb-1">
                        No saved addresses
                      </p>
                      <p className="text-zinc-500 text-xs">
                        Add a delivery address to speed up checkout.
                      </p>
                    </div>
                  ) : null}
                </div>
              )}

              {/* ── PROFILE ────────────────────────────────────── */}
              {tab === "profile" && (
                <div>
                  <div className="p-6 md:p-8 border-b border-zinc-100">
                    {editingProfile ? (
                      <div className="max-w-lg flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="First Name">
                            <input
                              type="text"
                              value={profileDraft.firstName}
                              onChange={(e) =>
                                setProfileDraft((d) => ({
                                  ...d,
                                  firstName: e.target.value,
                                }))
                              }
                              autoComplete="given-name"
                              className={inputCls}
                            />
                          </Field>
                          <Field label="Last Name">
                            <input
                              type="text"
                              value={profileDraft.lastName}
                              onChange={(e) =>
                                setProfileDraft((d) => ({
                                  ...d,
                                  lastName: e.target.value,
                                }))
                              }
                              autoComplete="family-name"
                              className={inputCls}
                            />
                          </Field>
                        </div>
                        <Field label="Email">
                          <input
                            type="email"
                            value={profileDraft.email}
                            onChange={(e) =>
                              setProfileDraft((d) => ({
                                ...d,
                                email: e.target.value,
                              }))
                            }
                            autoComplete="email"
                            className={inputCls}
                          />
                        </Field>
                        <Field label="Phone">
                          <input
                            type="tel"
                            value={profileDraft.phone}
                            onChange={(e) =>
                              setProfileDraft((d) => ({
                                ...d,
                                phone: e.target.value,
                              }))
                            }
                            autoComplete="tel"
                            className={inputCls}
                          />
                        </Field>
                        <Field label="WhatsApp">
                          <input
                            type="tel"
                            value={profileDraft.whatsapp}
                            onChange={(e) =>
                              setProfileDraft((d) => ({
                                ...d,
                                whatsapp: e.target.value,
                              }))
                            }
                            autoComplete="off"
                            className={inputCls}
                          />
                        </Field>
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Top Size">
                            <select
                              value={profileDraft.topSize}
                              onChange={(e) =>
                                setProfileDraft((d) => ({
                                  ...d,
                                  topSize: e.target.value,
                                }))
                              }
                              className={inputCls}
                            >
                              <option value="">Select</option>
                              {SIZE_OPTIONS.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </Field>
                          <Field label="Bottom Size">
                            <select
                              value={profileDraft.bottomSize}
                              onChange={(e) =>
                                setProfileDraft((d) => ({
                                  ...d,
                                  bottomSize: e.target.value,
                                }))
                              }
                              className={inputCls}
                            >
                              <option value="">Select</option>
                              {SIZE_OPTIONS.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </Field>
                        </div>
                        <div className="flex gap-3 mt-1">
                          <Button size="sm" onClick={saveProfile}>
                            Save Changes
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setEditingProfile(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-5">
                          <p className="text-sm text-zinc-600">
                            Your account details and preferences.
                          </p>
                          <Button
                            variant="secondary"
                            size="xs"
                            onClick={openEditProfile}
                          >
                            Edit Profile
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 border-t border-l border-zinc-200">
                          {profileFields.map((field) => (
                            <div
                              key={field.label}
                              className="border-r border-b border-zinc-200 px-5 py-4"
                            >
                              <p className="text-[10px] tracking-widest uppercase text-zinc-500 mb-1.5 font-medium">
                                {field.label}
                              </p>
                              <p className="text-sm text-zinc-900 wrap-break-word">
                                {field.value || "Not set"}
                              </p>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Password section */}
                  <div className="p-6 md:p-8">
                    {changingPassword ? (
                      <div className="max-w-lg flex flex-col gap-4">
                        <div>
                          <p className="text-sm font-medium text-zinc-900 mb-1">
                            Change Password
                          </p>
                          <p className="text-xs text-zinc-500">
                            Use at least 8 characters with a mix of letters and
                            numbers.
                          </p>
                        </div>
                        <Field
                          label="Current Password"
                          error={pwErrors.current}
                        >
                          <input
                            type="password"
                            value={pwForm.current}
                            onChange={(e) =>
                              setPwForm((f) => ({
                                ...f,
                                current: e.target.value,
                              }))
                            }
                            autoComplete="current-password"
                            className={inputCls}
                          />
                        </Field>
                        <Field label="New Password" error={pwErrors.next}>
                          <input
                            type="password"
                            value={pwForm.next}
                            onChange={(e) =>
                              setPwForm((f) => ({ ...f, next: e.target.value }))
                            }
                            autoComplete="new-password"
                            className={inputCls}
                          />
                        </Field>
                        <Field
                          label="Confirm New Password"
                          error={pwErrors.confirm}
                        >
                          <input
                            type="password"
                            value={pwForm.confirm}
                            onChange={(e) =>
                              setPwForm((f) => ({
                                ...f,
                                confirm: e.target.value,
                              }))
                            }
                            autoComplete="new-password"
                            className={inputCls}
                          />
                        </Field>
                        {pwSaved && (
                          <p className="text-emerald-700 text-xs bg-emerald-50 border border-emerald-200 px-3 py-2 rounded">
                            Password updated.
                          </p>
                        )}
                        <div className="flex gap-3">
                          <Button
                            size="sm"
                            onClick={savePassword}
                            disabled={pwSaved}
                          >
                            {pwSaved ? "Saved" : "Update Password"}
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setChangingPassword(false);
                              setPwErrors({});
                              setPwForm({ current: "", next: "", confirm: "" });
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-zinc-900 mb-0.5">
                            Password
                          </p>
                          <p className="text-sm text-zinc-500 tracking-widest">
                            &#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;
                          </p>
                        </div>
                        <Button
                          variant="secondary"
                          size="xs"
                          onClick={() => setChangingPassword(true)}
                        >
                          Change
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* ── Confirm dialogs ─────────────────────────────────────── */}
      <ConfirmDialog
        open={confirmSignOut}
        onOpenChange={(o) => !signingOut && setConfirmSignOut(o)}
        title="Sign out of your account?"
        description="You'll need to sign in again to view your orders, wishlist, and saved addresses."
        confirmLabel="Sign Out"
        cancelLabel="Stay Signed In"
        variant="destructive"
        loading={signingOut}
        onConfirm={handleSignOut}
      />

      <ConfirmDialog
        open={confirmDeleteAddrId !== null}
        onOpenChange={(o) => !o && setConfirmDeleteAddrId(null)}
        title="Delete this address?"
        description="This address will be removed from your account. You can always add it back later."
        confirmLabel="Delete Address"
        variant="destructive"
        onConfirm={() => {
          if (confirmDeleteAddrId) deleteAddress(confirmDeleteAddrId);
          setConfirmDeleteAddrId(null);
        }}
      />

      <ConfirmDialog
        open={confirmRemoveWishlistId !== null}
        onOpenChange={(o) => !o && setConfirmRemoveWishlistId(null)}
        title="Remove from wishlist?"
        description="This piece will no longer appear in your saved items."
        confirmLabel="Remove"
        variant="destructive"
        onConfirm={() => {
          if (confirmRemoveWishlistId)
            confirmWishlistRemoval(confirmRemoveWishlistId);
        }}
      />

      {quickAddProduct && (
        <QuickAddModal
          product={quickAddProduct}
          open={!!quickAddProduct}
          onClose={() => setQuickAddProduct(null)}
        />
      )}
    </main>
  );
}
