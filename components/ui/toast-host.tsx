"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import { useToastStore, type ToastVariant } from "@/lib/stores/toast-store";
import { cn } from "@/lib/utils";

const DURATION = 3800;

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
    <div className="fixed top-20 right-4 md:right-6 z-200 flex flex-col gap-2 pointer-events-none">
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
  useEffect(() => {
    const timer = setTimeout(onDismiss, DURATION);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const { wrap, icon: Icon, iconCls } = VARIANT_STYLES[toast.variant];

  return (
    <motion.div
      layout
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className={cn(
        "pointer-events-auto w-80 max-w-[calc(100vw-2rem)] shadow-lg rounded-lg border overflow-hidden",
        wrap,
      )}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <Icon
          size={18}
          strokeWidth={2}
          className={cn("shrink-0 mt-0.5", iconCls)}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-900">{toast.title}</p>
          {toast.description && (
            <p className="text-xs text-zinc-600 mt-0.5">{toast.description}</p>
          )}
        </div>
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="shrink-0 text-zinc-400 hover:text-zinc-900 transition-colors -mr-1"
        >
          <X size={14} />
        </button>
      </div>
    </motion.div>
  );
}
