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

/**
 * Stable in-flow / sticky offset for the banner slot.
 * Intentionally ignores `scrollHidden` — layout must not change when the
 * banner slides away via transform, or Safari enters a scroll↔layout loop.
 */
export function getBannerOffset(visible: boolean): number {
  return visible ? BANNER_H : 0;
}

// In-memory only — resets every session so the banner is always fresh on new visits
export const useBannerStore = create<BannerState>((set) => ({
  visible: true,
  scrollHidden: false,
  dismiss: () => set({ visible: false, scrollHidden: false }),
  setScrollHidden: (scrollHidden) => set({ scrollHidden }),
}));
