import { create } from "zustand";

interface BannerState {
  visible: boolean;
  bannerHeight: number;
  dismiss: () => void;
  setBannerHeight: (h: number) => void;
}

// In-memory only — resets every session so the banner is always fresh on new visits
export const useBannerStore = create<BannerState>((set) => ({
  visible: true,
  bannerHeight: 0,
  dismiss: () => set({ visible: false }),
  setBannerHeight: (bannerHeight) => set({ bannerHeight }),
}));
