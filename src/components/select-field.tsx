"use client";

import { Select } from "@base-ui/react/select";
import { useId } from "react";

export interface SelectFieldOption {
  value: string;
  label: string;
}

export interface SelectFieldGroup {
  /** Etiqueta del grupo. Si se omite, las opciones se muestran sin agrupar. */
  label?: string;
  options: SelectFieldOption[];
}

export interface SelectFieldProps {
  label: string;
  value: string | null;
  onValueChange: (value: string | null) => void;
  groups: SelectFieldGroup[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  id?: string;
}

/**
 * Selector con etiqueta, agrupación opcional de opciones y mensaje de error,
 * construido sobre `@base-ui/react` Select.
 *
 * @example
 * <SelectField
 *   label="Proyecto"
 *   value={projectId}
 *   onValueChange={setProjectId}
 *   groups={[{ options: projects.map((p) => ({ value: p.id, label: p.name })) }]}
 *   placeholder="Selecciona un proyecto"
 * />
 */
export function SelectField({
  label,
  value,
  onValueChange,
  groups,
  placeholder,
  error,
  disabled,
  id,
}: SelectFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;
  const isEmpty = groups.every((group) => group.options.length === 0);
  const items = groups.flatMap((group) =>
    group.options.map((option) => ({
      value: option.value,
      label: option.label,
    })),
  );

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={fieldId}
        className="text-xs font-medium tracking-wide text-tertiary uppercase"
      >
        {label}
      </label>
      <Select.Root
        items={items}
        value={value}
        onValueChange={(next) => onValueChange(next)}
        disabled={disabled || isEmpty}
      >
        <Select.Trigger
          id={fieldId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="flex items-center justify-between gap-2 rounded-(--radius-standard) border border-border bg-surface-elevated px-3 py-2 text-sm text-foreground outline-none focus:border-primary disabled:text-tertiary"
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon aria-hidden>▾</Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner className="z-50">
            <Select.Popup className="max-h-64 overflow-auto rounded-(--radius-container) border border-border bg-surface-elevated py-1 shadow-lg">
              <Select.List>
                {groups.map((group, index) => (
                  <Select.Group key={group.label ?? index}>
                    {group.label ? (
                      <Select.GroupLabel className="px-3 py-1 text-xs font-medium text-tertiary uppercase">
                        {group.label}
                      </Select.GroupLabel>
                    ) : null}
                    {group.options.map((option) => (
                      <Select.Item
                        key={option.value}
                        value={option.value}
                        className="flex cursor-pointer items-center justify-between px-3 py-2 text-sm text-foreground data-[highlighted]:bg-surface"
                      >
                        <Select.ItemText>{option.label}</Select.ItemText>
                        <Select.ItemIndicator>✓</Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Group>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
