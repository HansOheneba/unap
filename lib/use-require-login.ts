"use client";

import { useRouter } from "next/navigation";
import { useAuthReady, useIsLoggedIn } from "@/lib/use-is-logged-in";

/**
 * Returns a guard that sends anonymous users to login (with `next` return path).
 * Returns `true` when the shopper may continue; `false` while auth is resolving
 * or after a redirect has been kicked off.
 */
export function useRequireLogin(): (nextPath?: string) => boolean {
  const router = useRouter();
  const authReady = useAuthReady();
  const isLoggedIn = useIsLoggedIn();

  return (nextPath?: string) => {
    if (!authReady) return false;
    if (isLoggedIn) return true;
    const next =
      nextPath ??
      `${window.location.pathname}${window.location.search}`;
    router.push(`/auth/login?next=${encodeURIComponent(next)}`);
    return false;
  };
}
