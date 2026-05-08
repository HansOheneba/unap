import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type OnboardingStep = 1 | 2 | 3 | 4;

export interface OnboardingState {
  /* ── Navigation ── */
  step: OnboardingStep;
  loading: boolean;
  errors: Record<string, string>;

  /* ── Step 1: Account ── */
  email: string;
  password: string;
  confirmPassword: string;
  agreed: boolean;
  showPassword: boolean;

  /* ── Step 2: About You ── */
  firstName: string;
  lastName: string;
  phone: string;

  /* ── Step 3: Delivery ── */
  country: string;
  region: string;
  city: string;
  address: string;
  landmark: string;
  whatsapp: string;
  sameAsPhone: boolean;

  /* ── Step 4: Profile ── */
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  topSize: string;
  bottomSize: string;

  /* ── Actions ── */
  setField: <K extends keyof OnboardingState>(
    key: K,
    value: OnboardingState[K],
  ) => void;
  setErrors: (errors: Record<string, string>) => void;
  clearErrors: () => void;
  setLoading: (loading: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

const initialState = {
  step: 1 as OnboardingStep,
  loading: false,
  errors: {},

  email: "",
  password: "",
  confirmPassword: "",
  agreed: false,
  showPassword: false,

  firstName: "",
  lastName: "",
  phone: "+",

  country: "Ghana",
  region: "",
  city: "",
  address: "",
  landmark: "",
  whatsapp: "+",
  sameAsPhone: true,

  birthDay: "",
  birthMonth: "",
  birthYear: "",
  topSize: "",
  bottomSize: "",
};

export const useOnboardingStore = create<OnboardingState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setField: (key, value) => set({ [key]: value }),

      setErrors: (errors) => set({ errors }),

      clearErrors: () => set({ errors: {} }),

      setLoading: (loading) => set({ loading }),

      nextStep: () => {
        const { step } = get();
        if (step < 4) set({ step: (step + 1) as OnboardingStep });
      },

      prevStep: () => {
        const { step } = get();
        if (step > 1) set({ step: (step - 1) as OnboardingStep, errors: {} });
      },

      reset: () => set(initialState),
    }),
    { name: "onboarding" },
  ),
);
