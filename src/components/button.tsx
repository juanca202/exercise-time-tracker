"use client";

import { Button as BaseButton } from "@base-ui/react/button";
import type { ComponentProps } from "react";

export type ButtonVariant = "primary" | "secondary";

export interface ButtonProps extends ComponentProps<typeof BaseButton> {
  /**
   * Estilo visual del botón: `"primary"` (fondo Indigo, para la acción
   * principal) o `"secondary"` (borde, para acciones alternativas).
   * @default "primary"
   */
  variant?: ButtonVariant;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary/90 disabled:bg-primary/40",
  secondary:
    "border border-border-strong text-foreground hover:bg-surface disabled:text-tertiary disabled:border-border",
};

/**
 * Botón de acción del sistema de diseño Precision Focus, construido sobre
 * `@base-ui/react` Button.
 *
 * @example
 * <Button variant="primary" onClick={handleSave}>Guardar Registro</Button>
 */
export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <BaseButton
      className={`inline-flex items-center justify-center gap-2 rounded-(--radius-standard) px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
