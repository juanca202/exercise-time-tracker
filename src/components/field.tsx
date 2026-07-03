"use client";

import { Input } from "@base-ui/react/input";
import { useId } from "react";
import type { ComponentProps } from "react";

export interface FieldProps extends Omit<ComponentProps<typeof Input>, "id"> {
  label: string;
  error?: string;
  id?: string;
}

/**
 * Campo de texto con etiqueta y mensaje de error asociados, construido
 * sobre `@base-ui/react` Input.
 *
 * @example
 * <Field label="Nombre" value={name} onValueChange={setName} error={error} />
 */
export function Field({
  label,
  error,
  id,
  className = "",
  ...props
}: FieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={fieldId}
        className="text-xs font-medium tracking-wide text-tertiary uppercase"
      >
        {label}
      </label>
      <Input
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`rounded-(--radius-standard) border border-border bg-surface-elevated px-3 py-2 text-sm text-foreground outline-none focus:border-primary ${className}`}
        {...props}
      />
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
