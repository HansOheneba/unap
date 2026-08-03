"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import FadeImage from "@/components/ui/fade-image";
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
import { orderStatusPill } from "@/lib/auth";
import {
  getProfile,
  updateProfile,
  listAddresses,
  createAddress,
  addressPayloadFromProfile,
  updateAddress,
  deleteAddress as apiDeleteAddress,
  setDefaultAddress as apiSetDefaultAddress,
  type ApiAddress,
} from "@/lib/api/users";
import { listOrders, type ApiOrderSummary } from "@/lib/api/orders";
import { trackingPath } from "@/lib/tracking";
import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { useAuthReady, useIsLoggedIn } from "@/lib/use-is-logged-in";
import { Button, buttonVariants } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import AddToCartButton from "@/components/ui/add-to-cart-button";
import { toast } from "@/lib/stores/toast-store";
import { formatPrice } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { getStates, getLGAsByState } from "@some19ice/nigeria-geo-core";
import { ApiError } from "@/lib/api/client";

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

const BIRTH_DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));
const CURRENT_YEAR = new Date().getFullYear();
const BIRTH_YEARS = Array.from({ length: 87 }, (_, i) =>
  String(CURRENT_YEAR - 13 - i),
);

function formatOrderError(err: unknown, fallback: string) {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

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

  // ── Orders ───────────────────────────────────────────────────────────
  const [orders, setOrders] = useState<ApiOrderSummary[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // ── Wishlist ─────────────────────────────────────────────────────────
  const wishlistItems = useWishlistStore((s) => s.items);
  const removeWishlist = useWishlistStore((s) => s.remove);

  // ── Profile edit state ──────────────────────────────────────────────
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    whatsapp: "",
    topSize: "",
    bottomSize: "",
    birthDay: "",
    birthMonth: "",
    birthYear: "",
  });

  // ── Address state (backed by /users/me/addresses) ────────────────────
  type AddrForm = {
    label: string;
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    region: string;
    city: string;
    district: string;
    address: string;
    address2: string;
    googleMapsLink: string;
    phone: string;
    postcode: string;
    whatsapp: string;
    isDefault: boolean;
  };
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
    googleMapsLink: "",
    phone: "",
    postcode: "",
    whatsapp: "",
    isDefault: false,
  };
  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [addingAddress, setAddingAddress] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
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

  const { reset } = useOnboardingStore();

  const authReady = useAuthReady();
  const isLoggedIn = useIsLoggedIn();
  const authUser = useAuthStore((s) => s.user);
  const setAuthUser = useAuthStore((s) => s.setUser);

  // Profile fields come straight from the server session (`/auth/me`),
  // which is the same `User` record served by `GET /users/me`.
  const firstName = authUser?.firstName || "";
  const lastName = authUser?.lastName || "";
  const email = authUser?.email || "";
  const phone = authUser?.phone || "";
  const whatsapp = authUser?.whatsapp || "";
  const country = authUser?.country || "";
  const birthDay = authUser?.birthDay || "";
  const birthMonth = authUser?.birthMonth || "";
  const birthYear = authUser?.birthYear || "";
  const topSize = authUser?.topSize || "";
  const bottomSize = authUser?.bottomSize || "";

  /* ── Auth guard: wait for the server session check before redirecting ── */
  useEffect(() => {
    if (!authReady) return;
    if (!isLoggedIn) {
      const nextUrl = tab === "orders" ? "/account" : `/account?tab=${tab}`;
      router.replace(`/auth/login?next=${encodeURIComponent(nextUrl)}`);
    }
  }, [authReady, isLoggedIn, router, tab]);

  /* ── Load orders + addresses from the API once authenticated ── */
  useEffect(() => {
    if (!authReady || !isLoggedIn) return;
    let active = true;

    // Fresh profile fetch so we always log /users/me when opening account
    // (session hydrate only runs once on app boot).
    getProfile()
      .then((profile) => {
        if (!active || !profile) return;
        console.log("[account] /users/me profile:", profile);
        setAuthUser(profile);
      })
      .catch((err) => {
        console.error("[account] /users/me failed:", err);
      });

    setOrdersLoading(true);
    setOrdersError(null);
    listOrders()
      .then((data) => {
        if (active) setOrders(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (active)
          setOrdersError(formatOrderError(err, "Could not load your orders."));
      })
      .finally(() => {
        if (active) setOrdersLoading(false);
      });

    setAddressesLoading(true);
    listAddresses()
      .then(async (data) => {
        if (!active) return;
        if (data.length > 0) {
          setAddresses(data);
          return;
        }

        // Older signups stored shipping on the user profile only. Seed Address Book once.
        const profile = useAuthStore.getState().user;
        const payload = addressPayloadFromProfile(profile ?? {});
        if (!payload) {
          setAddresses([]);
          return;
        }
        try {
          const created = await createAddress(payload);
          if (active) setAddresses([created]);
        } catch (err) {
          console.error("[account] could not backfill address from profile:", err);
          if (active) setAddresses([]);
        }
      })
      .catch(() => {
        if (active) toast.error("Could not load your saved addresses.");
      })
      .finally(() => {
        if (active) setAddressesLoading(false);
      });

    return () => {
      active = false;
    };
  }, [authReady, isLoggedIn, setAuthUser]);

  if (!authReady || !isLoggedIn) return null;

  // ── Profile handlers ─────────────────────────────────────────────────
  function openEditProfile() {
    setProfileDraft({
      firstName,
      lastName,
      phone,
      whatsapp,
      topSize,
      bottomSize,
      birthDay,
      birthMonth,
      birthYear,
    });
    setEditingProfile(true);
  }
  async function saveProfile() {
    setSavingProfile(true);
    try {
      const updated = await updateProfile({
        firstName: profileDraft.firstName,
        lastName: profileDraft.lastName,
        phone: profileDraft.phone || undefined,
        whatsapp: profileDraft.whatsapp || undefined,
        topSize: profileDraft.topSize || undefined,
        bottomSize: profileDraft.bottomSize || undefined,
        birthDay: profileDraft.birthDay || undefined,
        birthMonth: profileDraft.birthMonth || undefined,
        birthYear: profileDraft.birthYear || undefined,
      });
      if (updated) setAuthUser(updated);
      setEditingProfile(false);
      toast.success("Profile updated", "Your account details have been saved.");
    } catch (err) {
      toast.error(
        "Could not update profile",
        formatOrderError(err, "Please try again."),
      );
    } finally {
      setSavingProfile(false);
    }
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
  function openEditAddress(addr: ApiAddress) {
    setAddrForm({
      label: addr.label || "Home",
      firstName: addr.firstName,
      lastName: addr.lastName,
      email: addr.email || "",
      country: addr.country,
      region: addr.region || "",
      city: addr.city,
      district: addr.district || "",
      address: addr.address,
      address2: addr.address2 || "",
      googleMapsLink: addr.googleMapsLink || "",
      phone: addr.phone,
      postcode: addr.postcode || "",
      whatsapp: addr.whatsapp || "",
      isDefault: Boolean(addr.isDefault),
    });
    setAddrErrors({});
    setEditingAddressId(addr.id);
    setAddingAddress(true);
  }
  async function saveAddress() {
    if (!validateAddr()) return;
    const isEdit = !!editingAddressId;
    setSavingAddress(true);
    try {
      if (editingAddressId) {
        const updated = await updateAddress(editingAddressId, addrForm);
        setAddresses((prev) =>
          prev.map((a) => {
            if (a.id !== editingAddressId) {
              return addrForm.isDefault ? { ...a, isDefault: false } : a;
            }
            return updated;
          }),
        );
      } else {
        const created = await createAddress({
          ...addrForm,
          isDefault: addresses.length === 0 || addrForm.isDefault,
        });
        setAddresses((prev) =>
          created.isDefault
            ? [...prev.map((a) => ({ ...a, isDefault: false })), created]
            : [...prev, created],
        );
      }
      setAddingAddress(false);
      toast.success(
        isEdit ? "Address updated" : "Address saved",
        `${addrForm.label || "Address"} \u00b7 ${addrForm.city || addrForm.country}`,
      );
    } catch (err) {
      toast.error(
        "Could not save address",
        formatOrderError(err, "Please try again."),
      );
    } finally {
      setSavingAddress(false);
    }
  }
  async function deleteAddress(id: string) {
    const addr = addresses.find((a) => a.id === id);
    try {
      await apiDeleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.info(
        "Address removed",
        addr ? `${addr.label} is no longer saved.` : undefined,
      );
    } catch (err) {
      toast.error(
        "Could not remove address",
        formatOrderError(err, "Please try again."),
      );
    }
  }
  async function setDefaultAddress(id: string) {
    try {
      await apiSetDefaultAddress(id);
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === id })),
      );
      toast.success("Default address updated");
    } catch (err) {
      toast.error(
        "Could not update default address",
        formatOrderError(err, "Please try again."),
      );
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    await useAuthStore.getState().signOut();
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
    { label: "WhatsApp", value: whatsapp },
    ...(country ? [{ label: "Country", value: country }] : []),
    ...(birthDay && birthMonth && birthYear
      ? [
          {
            label: "Birthday",
            value: `${birthMonth} ${birthDay}, ${birthYear}`,
          },
        ]
      : []),
    ...(topSize ? [{ label: "Top Size", value: topSize }] : []),
    ...(bottomSize ? [{ label: "Bottom Size", value: bottomSize }] : []),
    ...(authUser?.points
      ? [{ label: "Reward Points", value: String(authUser.points) }]
      : []),
    ...(authUser?.joinedDate
      ? [{ label: "Member Since", value: authUser.joinedDate }]
      : []),
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
            <div className="bg-white border border-zinc-200 overflow-hidden">
              {/* User card */}
              <div className="px-5 py-5 border-b border-zinc-100 flex items-center gap-3">
                <div className="w-11 h-11 bg-zinc-900 text-white flex items-center justify-center text-sm font-medium shrink-0">
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
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-zinc-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} strokeWidth={1.6} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* ── CONTENT ─────────────────────────────────────────── */}
          <section className="flex-1 min-w-0">
            <div className="bg-white border border-zinc-200 overflow-hidden">
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
                  {ordersLoading ? (
                    <div className="py-12 text-center text-sm text-zinc-500">
                      Loading your orders…
                    </div>
                  ) : ordersError ? (
                    <div className="py-12 text-center">
                      <p className="text-zinc-900 text-sm font-medium mb-1">
                        Could not load your orders
                      </p>
                      <p className="text-zinc-500 text-xs">{ordersError}</p>
                    </div>
                  ) : orders.length === 0 ? (
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
                          className="border border-zinc-200 overflow-hidden hover:border-zinc-300 transition-colors"
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
                                  {formatPrice(order.total)}
                                </p>
                              </div>
                            </div>
                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase border px-2.5 py-1 rounded-full font-medium",
                                orderStatusPill[order.status] ??
                                  "bg-zinc-50 text-zinc-700 border-zinc-200",
                              )}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {order.statusLabel || order.status}
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
                                  {formatPrice(item.price)}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-zinc-100 bg-zinc-50">
                            {order.trackingNumber && (
                              <Link
                                href={trackingPath(order.trackingNumber)}
                                className="text-[10px] tracking-widest uppercase text-zinc-600 hover:text-zinc-900 px-3 py-2 transition-colors"
                              >
                                Track
                              </Link>
                            )}
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
                          className="border border-zinc-200 overflow-hidden group"
                        >
                          <Link
                            href={`/collections/${item.category}/${item.slug}`}
                            className="block relative aspect-4/5 bg-zinc-50"
                          >
                            {item.img && (
                              <FadeImage
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
                              className="absolute top-2 right-2 w-7 h-7 bg-white/90 hover:bg-white text-zinc-700 hover:text-red-600 flex items-center justify-center transition-colors"
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
                            <div className="mt-3">
                              <AddToCartButton slug={item.slug} />
                            </div>
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
                      {addressesLoading
                        ? "Loading your addresses…"
                        : `${addresses.length} saved address${addresses.length === 1 ? "" : "es"}`}
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
                    <div className="border border-zinc-200 p-5 md:p-6 mb-6 bg-zinc-50">
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
                              "w-9 h-5 relative transition-colors duration-200 cursor-pointer shrink-0",
                              addrForm.isDefault
                                ? "bg-zinc-900"
                                : "bg-zinc-300",
                            )}
                          >
                            <span
                              className={cn(
                                "absolute top-0.5 w-4 h-4 bg-white shadow-sm transition-transform duration-200",
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

                        <Field label="Google Maps Link (optional)">
                          <input
                            type="url"
                            value={addrForm.googleMapsLink}
                            onChange={(e) =>
                              setAddrForm((f) => ({
                                ...f,
                                googleMapsLink: e.target.value,
                              }))
                            }
                            placeholder="https://maps.app.goo.gl/..."
                            autoComplete="off"
                            className={inputCls}
                          />
                          <p className="text-[10px] text-zinc-400 mt-0.5">
                            Open Google Maps, tap Share, and paste the link so
                            our riders can find your exact location.
                          </p>
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
                          <Button
                            size="sm"
                            onClick={saveAddress}
                            disabled={savingAddress}
                          >
                            {savingAddress
                              ? "Saving…"
                              : editingAddressId
                                ? "Confirm to Edit"
                                : "Save Address"}
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled={savingAddress}
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
                  {addressesLoading ? null : addresses.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className={cn(
                            "border p-5 transition-colors",
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
                            {addr.googleMapsLink && (
                              <p className="text-xs text-zinc-500 break-all">
                                Google Maps link saved
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
                            value={email}
                            disabled
                            autoComplete="email"
                            className={cn(inputCls, "opacity-60 cursor-not-allowed")}
                          />
                          <p className="text-[10px] text-zinc-400 mt-0.5">
                            Your email is tied to sign-in and can&apos;t be
                            changed here.
                          </p>
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
                        <Field label="Birthday (optional)">
                          <div className="grid grid-cols-3 gap-2">
                            <select
                              value={profileDraft.birthDay}
                              onChange={(e) =>
                                setProfileDraft((d) => ({
                                  ...d,
                                  birthDay: e.target.value,
                                }))
                              }
                              className={inputCls}
                            >
                              <option value="">Day</option>
                              {BIRTH_DAYS.map((d) => (
                                <option key={d} value={d}>
                                  {d}
                                </option>
                              ))}
                            </select>
                            <select
                              value={profileDraft.birthMonth}
                              onChange={(e) =>
                                setProfileDraft((d) => ({
                                  ...d,
                                  birthMonth: e.target.value,
                                }))
                              }
                              className={inputCls}
                            >
                              <option value="">Month</option>
                              {MONTHS.map((m) => (
                                <option key={m} value={m}>
                                  {m}
                                </option>
                              ))}
                            </select>
                            <select
                              value={profileDraft.birthYear}
                              onChange={(e) =>
                                setProfileDraft((d) => ({
                                  ...d,
                                  birthYear: e.target.value,
                                }))
                              }
                              className={inputCls}
                            >
                              <option value="">Year</option>
                              {BIRTH_YEARS.map((y) => (
                                <option key={y} value={y}>
                                  {y}
                                </option>
                              ))}
                            </select>
                          </div>
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
                          <Button
                            size="sm"
                            onClick={saveProfile}
                            disabled={savingProfile}
                          >
                            {savingProfile ? "Saving…" : "Save Changes"}
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled={savingProfile}
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

                  {/* Sign-in method */}
                  <div className="p-6 md:p-8">
                    <div>
                      <p className="text-sm font-medium text-zinc-900 mb-0.5">
                        Sign-In Method
                      </p>
                      <p className="text-sm text-zinc-500">
                        One-time code sent to your email. No password needed.
                      </p>
                    </div>
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

    </main>
  );
}
