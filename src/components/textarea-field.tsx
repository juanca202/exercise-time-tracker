"use client";

import { useId } from "react";
import type { ComponentProps } from "react";

export interface TextareaFieldProps extends Omit<
  ComponentProps<"textarea">,
  "id"
> {
  label: string;
  error?: string;
  id?: string;
}

/**
 * Área de texto con etiqueta y mensaje de error asociados.
 *
 * Usa un `<textarea>` nativo: Base UI no ofrece un primitivo equivalente
 * (ADR-006 — HTML nativo semántico cuando no hay componente adecuado).
 *
 * @example
 * <TextareaField label="Descripción" value={description} onChange={handleChange} />
 */
export function TextareaField({
  label,
  error,
  id,
  className = "",
  ...props
}: TextareaFieldProps) {
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
      <textarea
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
