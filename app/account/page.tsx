"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
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
import { getStates, getLGAsByState } from "@some19ice/nigeria-geo-core";

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
  type AddrForm = Omit<UserAddress, "id">;
  const ADDR_BLANK: AddrForm = {
    label: "Home",
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    region: "",
    city: "",
    district: "",
    address: "",
    address2: "",
    phone: "",
    postcode: "",
    whatsapp: "",
    isDefault: false,
  };
  const [addingAddress, setAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrForm, setAddrForm] = useState<AddrForm>(ADDR_BLANK);
  const [addrErrors, setAddrErrors] = useState<Record<string, string>>({});

  // ── Ghana geo data ────────────────────────────────────────────────
  interface GhanaDistrict {
    code: string;
    label: string;
    category: string;
    capital: string;
  }
  interface GhanaRegion {
    code: string;
    label: string;
    capital: string;
    districts: GhanaDistrict[];
  }
  const [ghanaRegions, setGhanaRegions] = useState<GhanaRegion[]>([]);
  useEffect(() => {
    fetch("https://regions-and-districts-in-ghana.onrender.com/regions")
      .then((r) => r.json())
      .then((data) => {
        if (data?.regions) setGhanaRegions(data.regions as GhanaRegion[]);
      })
      .catch(() => {});
  }, []);

  // ── Nigeria geo data (from package) ──────────────────────────────
  const nigeriaStates = useMemo(() => getStates(), []);
  const nigeriaLGAs = useMemo(() => {
    if (addrForm.country !== "Nigeria" || !addrForm.region) return [];
    const st = nigeriaStates.find((s) => s.name === addrForm.region);
    return st ? getLGAsByState(st.id) : [];
  }, [addrForm.country, addrForm.region, nigeriaStates]);

  // ── Ghana district options for selected region ────────────────────
  const ghanaDistricts = useMemo(() => {
    if (addrForm.country !== "Ghana" || !addrForm.region) return [];
    const reg = ghanaRegions.find((r) => r.label === addrForm.region);
    return reg?.districts ?? [];
  }, [addrForm.country, addrForm.region, ghanaRegions]);

  const countryCode = addrForm.country === "Nigeria" ? "+234" : "+233";

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
            firstName,
            lastName,
            email,
            country,
            region,
            city,
            district: "",
            address,
            address2: "",
            phone,
            postcode: "",
            whatsapp: sameAsPhone ? phone : whatsapp,
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
    if (!addrForm.firstName.trim()) e.firstName = "Required";
    if (!addrForm.lastName.trim()) e.lastName = "Required";
    if (!addrForm.email.trim()) e.email = "Required";
    if (!addrForm.country.trim()) e.country = "Required";
    if (!addrForm.region.trim()) e.region = "Required";
    if (!addrForm.city.trim()) e.city = "Required";
    if (!addrForm.district.trim()) e.district = "Required";
    if (!addrForm.address.trim()) e.address = "Required";
    if (!addrForm.phone.trim()) e.phone = "Required";
    setAddrErrors(e);
    return Object.keys(e).length === 0;
  }
  function openAddAddress() {
    setAddrForm({ ...ADDR_BLANK, email, firstName, lastName, phone });
    setAddrErrors({});
    setEditingAddressId(null);
    setAddingAddress(true);
  }
  function openEditAddress(addr: UserAddress) {
    setAddrForm({
      label: addr.label,
      firstName: addr.firstName,
      lastName: addr.lastName,
      email: addr.email,
      country: addr.country,
      region: addr.region,
      city: addr.city,
      district: addr.district,
      address: addr.address,
      address2: addr.address2,
      phone: addr.phone,
      postcode: addr.postcode,
      whatsapp: addr.whatsapp,
      isDefault: addr.isDefault,
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
        prev.map((a) => {
          if (a.id !== editingAddressId) {
            return addrForm.isDefault ? { ...a, isDefault: false } : a;
          }
          return { ...a, ...addrForm };
        }),
      );
    } else {
      const isFirst = addresses.length === 0;
      const newAddr: UserAddress = {
        ...addrForm,
        id: `addr_${Date.now()}`,
        isDefault: isFirst || addrForm.isDefault,
      };
      if (newAddr.isDefault) {
        setAddresses((prev) => [
          ...prev.map((a) => ({ ...a, isDefault: false })),
          newAddr,
        ]);
      } else {
        setAddresses((prev) => [...prev, newAddr]);
      }
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
                      <p className="text-xs tracking-widest uppercase text-zinc-700 font-medium mb-1">
                        {editingAddressId ? "Edit Address" : "New Address"}
                      </p>
                      <p className="text-[11px] text-zinc-500 mb-5">
                        Shipping Address
                      </p>
                      <div className="flex flex-col gap-4 max-w-lg">
                        {/* Email + default toggle */}
                        <Field label="Email *" error={addrErrors.email}>
                          <input
                            type="email"
                            value={addrForm.email}
                            onChange={(e) =>
                              setAddrForm((f) => ({
                                ...f,
                                email: e.target.value,
                              }))
                            }
                            autoComplete="email"
                            className={inputCls}
                          />
                        </Field>
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <span
                            onClick={() =>
                              setAddrForm((f) => ({
                                ...f,
                                isDefault: !f.isDefault,
                              }))
                            }
                            className={cn(
                              "w-9 h-5 rounded-full relative transition-colors duration-200 cursor-pointer shrink-0",
                              addrForm.isDefault
                                ? "bg-zinc-900"
                                : "bg-zinc-300",
                            )}
                          >
                            <span
                              className={cn(
                                "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                                addrForm.isDefault
                                  ? "translate-x-4"
                                  : "translate-x-0.5",
                              )}
                            />
                          </span>
                          <span className="text-xs text-zinc-700">
                            Set as default
                          </span>
                        </label>

                        {/* Name row */}
                        <div className="grid grid-cols-2 gap-3">
                          <Field
                            label="First Name *"
                            error={addrErrors.firstName}
                          >
                            <input
                              type="text"
                              value={addrForm.firstName}
                              onChange={(e) =>
                                setAddrForm((f) => ({
                                  ...f,
                                  firstName: e.target.value,
                                }))
                              }
                              autoComplete="given-name"
                              className={inputCls}
                            />
                          </Field>
                          <Field
                            label="Last Name *"
                            error={addrErrors.lastName}
                          >
                            <input
                              type="text"
                              value={addrForm.lastName}
                              onChange={(e) =>
                                setAddrForm((f) => ({
                                  ...f,
                                  lastName: e.target.value,
                                }))
                              }
                              autoComplete="family-name"
                              className={inputCls}
                            />
                          </Field>
                        </div>

                        {/* Country */}
                        <Field label="Country *" error={addrErrors.country}>
                          <select
                            value={addrForm.country}
                            onChange={(e) =>
                              setAddrForm((f) => ({
                                ...f,
                                country: e.target.value,
                                region: "",
                                city: "",
                                district: "",
                              }))
                            }
                            autoComplete="country-name"
                            className={inputCls}
                          >
                            <option value="">Select country</option>
                            <option value="Ghana">Ghana</option>
                            <option value="Nigeria">Nigeria</option>
                          </select>
                        </Field>

                        {/* State / Province */}
                        <Field
                          label="State / Province *"
                          error={addrErrors.region}
                        >
                          {addrForm.country === "Ghana" ? (
                            <select
                              value={addrForm.region}
                              onChange={(e) =>
                                setAddrForm((f) => ({
                                  ...f,
                                  region: e.target.value,
                                  district: "",
                                }))
                              }
                              disabled={
                                !addrForm.country || ghanaRegions.length === 0
                              }
                              autoComplete="address-level1"
                              className={inputCls}
                            >
                              <option value="">
                                {ghanaRegions.length === 0
                                  ? "Loading regions..."
                                  : "Select region"}
                              </option>
                              {ghanaRegions.map((r) => (
                                <option key={r.code} value={r.label}>
                                  {r.label}
                                </option>
                              ))}
                            </select>
                          ) : addrForm.country === "Nigeria" ? (
                            <select
                              value={addrForm.region}
                              onChange={(e) =>
                                setAddrForm((f) => ({
                                  ...f,
                                  region: e.target.value,
                                  district: "",
                                }))
                              }
                              autoComplete="address-level1"
                              className={inputCls}
                            >
                              <option value="">Select state</option>
                              {nigeriaStates.map((s) => (
                                <option key={s.id} value={s.name}>
                                  {s.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={addrForm.region}
                              disabled
                              placeholder="Select a country first"
                              className={cn(
                                inputCls,
                                "opacity-50 cursor-not-allowed",
                              )}
                            />
                          )}
                        </Field>

                        {/* District / LGA */}
                        <Field label="District *" error={addrErrors.district}>
                          {addrForm.country === "Ghana" ? (
                            <select
                              value={addrForm.district}
                              onChange={(e) =>
                                setAddrForm((f) => ({
                                  ...f,
                                  district: e.target.value,
                                }))
                              }
                              disabled={
                                !addrForm.region || ghanaDistricts.length === 0
                              }
                              className={inputCls}
                            >
                              <option value="">
                                {!addrForm.region
                                  ? "Select region first"
                                  : ghanaDistricts.length === 0
                                    ? "No districts found"
                                    : "Select district"}
                              </option>
                              {ghanaDistricts.map((d) => (
                                <option key={d.code} value={d.label}>
                                  {d.label}
                                </option>
                              ))}
                            </select>
                          ) : addrForm.country === "Nigeria" ? (
                            <select
                              value={addrForm.district}
                              onChange={(e) =>
                                setAddrForm((f) => ({
                                  ...f,
                                  district: e.target.value,
                                }))
                              }
                              disabled={
                                !addrForm.region || nigeriaLGAs.length === 0
                              }
                              className={inputCls}
                            >
                              <option value="">
                                {!addrForm.region
                                  ? "Select state first"
                                  : nigeriaLGAs.length === 0
                                    ? "No LGAs found"
                                    : "Select LGA"}
                              </option>
                              {nigeriaLGAs.map((l) => (
                                <option key={l.id} value={l.name}>
                                  {l.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={addrForm.district}
                              disabled
                              placeholder="Select a country first"
                              className={cn(
                                inputCls,
                                "opacity-50 cursor-not-allowed",
                              )}
                            />
                          )}
                        </Field>

                        {/* City */}
                        <Field label="City *" error={addrErrors.city}>
                          <input
                            type="text"
                            value={addrForm.city}
                            onChange={(e) =>
                              setAddrForm((f) => ({
                                ...f,
                                city: e.target.value,
                              }))
                            }
                            placeholder={
                              addrForm.country === "Ghana"
                                ? "e.g. Accra"
                                : addrForm.country === "Nigeria"
                                  ? "e.g. Lagos"
                                  : ""
                            }
                            autoComplete="address-level2"
                            className={inputCls}
                          />
                        </Field>
                        {/* Street address */}
                        <Field label="Address *" error={addrErrors.address}>
                          <input
                            type="text"
                            value={addrForm.address}
                            onChange={(e) =>
                              setAddrForm((f) => ({
                                ...f,
                                address: e.target.value,
                              }))
                            }
                            placeholder="Street, Apartment, Suite, etc."
                            autoComplete="street-address"
                            className={inputCls}
                          />
                          <p className="text-[10px] text-zinc-400 mt-0.5">
                            Detailed street address can help our rider find you
                            quickly.
                          </p>
                        </Field>

                        {/* Address 2 */}
                        <Field label="Address 2">
                          <input
                            type="text"
                            value={addrForm.address2}
                            onChange={(e) =>
                              setAddrForm((f) => ({
                                ...f,
                                address2: e.target.value,
                              }))
                            }
                            placeholder="Apartment, suite, floor, etc. (optional)"
                            autoComplete="address-line2"
                            className={inputCls}
                          />
                        </Field>

                        {/* Phone + Postcode */}
                        <div className="grid grid-cols-[1fr_auto] gap-3 items-start">
                          <Field
                            label={`Area Number · Phone *`}
                            error={addrErrors.phone}
                          >
                            <div className="flex">
                              <span className="flex items-center px-3 border border-r-0 border-zinc-200 bg-zinc-100 text-zinc-600 text-sm shrink-0 select-none">
                                {countryCode}
                              </span>
                              <input
                                type="tel"
                                value={addrForm.phone}
                                onChange={(e) =>
                                  setAddrForm((f) => ({
                                    ...f,
                                    phone: e.target.value,
                                  }))
                                }
                                placeholder={
                                  addrForm.country === "Nigeria"
                                    ? "08xxxxxxxx"
                                    : "05xxxxxxxx"
                                }
                                autoComplete="tel-national"
                                className={cn(inputCls, "border-l-0")}
                              />
                            </div>
                          </Field>
                          <Field label="Postcode">
                            <input
                              type="text"
                              value={addrForm.postcode}
                              onChange={(e) =>
                                setAddrForm((f) => ({
                                  ...f,
                                  postcode: e.target.value,
                                }))
                              }
                              placeholder="Optional"
                              autoComplete="postal-code"
                              className={cn(inputCls, "w-28")}
                            />
                          </Field>
                        </div>

                        {/* WhatsApp */}
                        <Field label="WhatsApp">
                          <input
                            type="tel"
                            value={addrForm.whatsapp}
                            onChange={(e) =>
                              setAddrForm((f) => ({
                                ...f,
                                whatsapp: e.target.value,
                              }))
                            }
                            placeholder="Optional"
                            autoComplete="off"
                            className={inputCls}
                          />
                        </Field>

                        {/* Label */}
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

                        <div className="flex gap-3 mt-1">
                          <Button size="sm" onClick={saveAddress}>
                            {editingAddressId
                              ? "Confirm to Edit"
                              : "Save Address"}
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
                          <div className="space-y-0.5 mb-4">
                            <p className="text-sm font-medium text-zinc-900">
                              {addr.firstName} {addr.lastName}
                            </p>
                            <p className="text-xs text-zinc-500">
                              {addr.email}
                            </p>
                            <p className="text-sm text-zinc-700 mt-1">
                              {addr.address}
                            </p>
                            {addr.address2 && (
                              <p className="text-sm text-zinc-600">
                                {addr.address2}
                              </p>
                            )}
                            {addr.district && (
                              <p className="text-sm text-zinc-600">
                                {addr.district}
                              </p>
                            )}
                            {addr.city && (
                              <p className="text-sm text-zinc-600">
                                {addr.city}
                                {addr.region ? `, ${addr.region}` : ""}
                              </p>
                            )}
                            <p className="text-sm text-zinc-600">
                              {addr.country}
                            </p>
                            {addr.phone && (
                              <p className="text-xs text-zinc-500 mt-1">
                                {addr.country === "Nigeria" ? "+234" : "+233"}{" "}
                                {addr.phone}
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
