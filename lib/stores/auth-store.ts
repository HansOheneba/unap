"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { logout as apiLogout, type ApiUser } from "@/lib/api/auth";
import { useWishlistStore } from "@/lib/stores/wishlist-store";

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

export interface AuthState {
  status: AuthStatus;
  user: ApiUser | null;
  setUser: (user: ApiUser | null) => void;
  /** Asks the server whether the httpOnly session cookie is still valid. */
  hydrate: () => Promise<void>;
  signOut: () => Promise<void>;
}

/**
 * No `persist` middleware on purpose: there is nothing safe to cache. Access and
 * refresh tokens live only in httpOnly cookies (set by `app/api/backend/[...path]/route.ts`),
 * never in this store, localStorage, or any client-readable place. Session state is
 * re-derived from the server on every load via `hydrate()`.
 */
export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      status: "idle",
      user: null,

      setUser: (user) =>
        set({ user, status: user ? "authenticated" : "unauthenticated" }),

      hydrate: async () => {
        set({ status: "loading" });
        try {
          const res = await fetch("/api/auth/session", {
            cache: "no-store",
            credentials: "same-origin",
          });
          const body = res.ok
            ? (await res.json()) as { authenticated?: boolean; user?: ApiUser | null }
            : null;
          const authenticated = Boolean(body?.authenticated);
          set({
            user: authenticated ? body?.user ?? null : null,
            status: authenticated ? "authenticated" : "unauthenticated",
          });
        } catch {
          set({ status: "unauthenticated", user: null });
        }
      },

      signOut: async () => {
        try {
          await apiLogout();
        } catch {
          // Cookies are cleared server-side by the proxy regardless of upstream result.
        } finally {
          set({ user: null, status: "unauthenticated" });
          // Wishlist is per-account; clear the local cache so the next
          // sign-in doesn't briefly show the previous user's items.
          useWishlistStore.setState({
            items: [],
            hydrated: false,
            hydrating: false,
            pending: 0,
            mutationEpoch: 0,
          });
        }
      },
    }),
    { name: "auth" },
  ),
);
