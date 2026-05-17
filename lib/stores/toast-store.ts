import { create } from "zustand";

export type ToastVariant = "success" | "info" | "error";

export interface Toast {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastState {
  toasts: Toast[];
  show: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: number) => void;
}

let counter = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  show: (toast) => {
    const id = ++counter;
    set((s) => ({ toasts: [...s.toasts, { id, ...toast }] }));
  },
  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

// Convenience helpers
export const toast = {
  success: (title: string, description?: string) =>
    useToastStore.getState().show({ title, description, variant: "success" }),
  info: (title: string, description?: string) =>
    useToastStore.getState().show({ title, description, variant: "info" }),
  error: (title: string, description?: string) =>
    useToastStore.getState().show({ title, description, variant: "error" }),
};
