"use client";

import { useOnboardingStore } from "@/lib/stores/onboarding-store";

/**
 * Lightweight "is the user logged in" hook for the mock auth flow.
 * Login hydrates the onboarding store with the user's email — so we
 * treat the presence of an email as "logged in" until a real auth
 * provider is wired in.
 */
export function useIsLoggedIn(): boolean {
  const email = useOnboardingStore((s) => s.email);
  return !!email && email.includes("@");
}
