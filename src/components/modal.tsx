"use client";

import { Dialog } from "@base-ui/react/dialog";
import type { ReactNode } from "react";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
}

/**
 * Modal accesible construido sobre `@base-ui/react` Dialog: overlay, panel
 * centrado, título y botón de cierre.
 *
 * @example
 * <Modal open={open} onOpenChange={setOpen} title="Nuevo Proyecto">
 *   ...contenido del formulario...
 * </Modal>
 */
export function Modal({ open, onOpenChange, title, children }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-foreground/40 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-(--radius-container) border border-border bg-surface-elevated p-6 shadow-lg outline-none transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
          <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
            <Dialog.Title className="text-xl font-semibold text-foreground">
              {title}
            </Dialog.Title>
            <Dialog.Close
              aria-label="Cerrar"
              className="text-tertiary hover:text-foreground"
            >
              ✕
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
