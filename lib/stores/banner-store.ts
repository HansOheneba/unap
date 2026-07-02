import { create } from "zustand";

export const BANNER_H = 32;
export const BANNER_REVEAL_MS = 200;
export const BANNER_HIDE_MS = 200;
/** Minimum scroll delta before toggling banner visibility */
export const BANNER_SCROLL_DELTA = 5;

interface BannerState {
  visible: boolean;
  scrollHidden: boolean;
  dismiss: () => void;
  setScrollHidden: (hidden: boolean) => void;
}

/** Layout offset for the visible banner slot (0 when hidden or dismissed). */
export function getBannerOffset(
  visible: boolean,
  scrollHidden: boolean,
): number {
  return visible && !scrollHidden ? BANNER_H : 0;
}

export function bannerSlotTransition(scrollHidden: boolean): string {
  const ms = scrollHidden ? BANNER_HIDE_MS : BANNER_REVEAL_MS;
  return `height ${ms}ms ease-out, opacity ${ms}ms ease-out`;
}

export function chromeTopTransition(scrollHidden: boolean): string {
  const ms = scrollHidden ? BANNER_HIDE_MS : BANNER_REVEAL_MS;
  return `top ${ms}ms ease-out`;
}

// In-memory only — resets every session so the banner is always fresh on new visits
export const useBannerStore = create<BannerState>((set) => ({
  visible: true,
  scrollHidden: false,
  dismiss: () => set({ visible: false, scrollHidden: false }),
  setScrollHidden: (scrollHidden) => set({ scrollHidden }),
}));
