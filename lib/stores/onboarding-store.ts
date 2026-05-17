import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

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
    persist(
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
      {
        name: "unap-user",
        // Persist only identity / profile fields, not transient UI state
        partialize: (state) => ({
          email: state.email,
          firstName: state.firstName,
          lastName: state.lastName,
          phone: state.phone,
          whatsapp: state.whatsapp,
          sameAsPhone: state.sameAsPhone,
          country: state.country,
          region: state.region,
          city: state.city,
          address: state.address,
          landmark: state.landmark,
          birthDay: state.birthDay,
          birthMonth: state.birthMonth,
          birthYear: state.birthYear,
          topSize: state.topSize,
          bottomSize: state.bottomSize,
        }),
      },
    ),
    { name: "onboarding" },
  ),
);
