"use client";

import { useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import { useToastStore, type ToastVariant } from "@/lib/stores/toast-store";
import { cn } from "@/lib/utils";

const DURATION = 3800;
const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;

const VARIANT_STYLES: Record<
  ToastVariant,
  { wrap: string; icon: React.ElementType; iconCls: string }
> = {
  success: {
    wrap: "bg-white border-emerald-200",
    icon: CheckCircle2,
    iconCls: "text-emerald-600",
  },
  info: {
    wrap: "bg-white border-zinc-200",
    icon: Info,
    iconCls: "text-zinc-700",
  },
  error: {
    wrap: "bg-white border-red-200",
    icon: AlertTriangle,
    iconCls: "text-red-600",
  },
};

export default function ToastHost() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="pointer-events-none fixed top-20 right-4 z-200 flex flex-col gap-2 md:right-6">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: {
    id: number;
    title: string;
    description?: string;
    variant: ToastVariant;
  };
  onDismiss: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(onDismiss, DURATION);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const { wrap, icon: Icon, iconCls } = VARIANT_STYLES[toast.variant];

  return (
    <motion.div
      layout={!prefersReducedMotion}
      initial={
        prefersReducedMotion ? { opacity: 0 } : { x: "110%", opacity: 0 }
      }
      animate={
        prefersReducedMotion ? { opacity: 1 } : { x: 0, opacity: 1 }
      }
      exit={
        prefersReducedMotion ? { opacity: 0 } : { x: "110%", opacity: 0 }
      }
      transition={
        prefersReducedMotion
          ? { duration: 0.15 }
          : { duration: 0.28, ease: EASE_DRAWER }
      }
      className={cn(
        "pointer-events-auto w-80 max-w-[calc(100vw-2rem)] overflow-hidden border shadow-lg",
        wrap,
      )}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <Icon
          size={18}
          strokeWidth={2}
          className={cn("mt-0.5 shrink-0", iconCls)}
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-zinc-900">{toast.title}</p>
          {toast.description && (
            <p className="mt-0.5 text-xs text-zinc-600">{toast.description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="-mr-1 shrink-0 text-zinc-400 transition-colors duration-150 hover:text-zinc-900 active:scale-95"
        >
          <X size={14} />
        </button>
      </div>
    </motion.div>
  );
}
