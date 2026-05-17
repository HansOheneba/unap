"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "default";
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
};

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  loading = false,
  onConfirm,
}: Props) {
  const isDestructive = variant === "destructive";

  async function handleConfirm() {
    await onConfirm();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md p-0 gap-0 rounded-xl"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            {isDestructive && (
              <div className="shrink-0 w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
                <AlertTriangle size={18} className="text-red-600" />
              </div>
            )}
            <DialogHeader className="flex-1">
              <DialogTitle className="text-zinc-900 text-base">
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription className="text-zinc-600 text-sm leading-relaxed">
                  {description}
                </DialogDescription>
              )}
            </DialogHeader>
          </div>
        </div>
        <DialogFooter className="bg-zinc-50 border-t border-zinc-100 rounded-b-xl m-0 px-5 py-3 flex sm:justify-end gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              isDestructive &&
                "bg-red-600 border-red-600 text-white hover:bg-white hover:text-red-600 hover:border-red-600",
            )}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                Working...
              </span>
            ) : (
              confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
