"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export function Dialog({
  open,
  onOpenChange,
  title,
  children,
  className,
}: DialogProps) {
  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 z-40 bg-inverse-surface/20 backdrop-blur-[8px]" />
        <BaseDialog.Popup
          className={cn(
            "fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-card-border bg-surface-container-lowest p-6 shadow-elevation-2",
            className,
          )}
        >
          <div className="mb-4 flex items-center justify-between border-b border-card-border pb-4">
            <BaseDialog.Title className="text-headline-md text-primary">
              {title}
            </BaseDialog.Title>
            <BaseDialog.Close
              className="rounded p-1 text-on-surface-variant hover:bg-row-hover"
              aria-label="Cerrar"
            >
              <XMarkIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
            </BaseDialog.Close>
          </div>
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
