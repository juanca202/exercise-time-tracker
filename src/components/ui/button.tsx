"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-on-primary hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary/40",
  secondary:
    "border border-outline bg-surface-container-lowest text-on-surface hover:bg-surface-container-low focus-visible:ring-2 focus-visible:ring-outline/40",
  ghost:
    "bg-transparent text-on-surface hover:bg-surface-container-low focus-visible:ring-2 focus-visible:ring-outline/30",
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
