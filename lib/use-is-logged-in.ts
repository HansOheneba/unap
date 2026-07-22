"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";

let hydrationStarted = false;

/** Kicks off the one-time server session check. Safe to call from many components. */
function ensureHydrated() {
  if (hydrationStarted) return;
  hydrationStarted = true;
  void useAuthStore.getState().hydrate();
}

/** True once we've asked the server whether the httpOnly session cookie is valid. */
export function useAuthReady(): boolean {
  useEffect(() => {
    ensureHydrated();
  }, []);
  const status = useAuthStore((s) => s.status);
  return status === "authenticated" || status === "unauthenticated";
}

/** True only when the server has confirmed a valid session. Never trusts client storage. */
export function useIsLoggedIn(): boolean {
  useEffect(() => {
    ensureHydrated();
  }, []);
  const status = useAuthStore((s) => s.status);
  return status === "authenticated";
}
