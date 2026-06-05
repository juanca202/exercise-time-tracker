"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string | null;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
}

export function Select({
  label,
  value,
  onValueChange,
  options,
  placeholder = "Selecciona una opción",
  disabled = false,
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <span className="font-mono text-xs font-medium tracking-wider text-on-surface-variant uppercase opacity-70">
          {label}
        </span>
      ) : null}
      <BaseSelect.Root
        value={value}
        onValueChange={(next) => {
          if (next) onValueChange(next);
        }}
        disabled={disabled}
      >
        <BaseSelect.Trigger
          className={cn(
            "flex w-full items-center justify-between rounded border border-outline-variant bg-surface-container-lowest px-3 py-2 text-left text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50",
          )}
        >
          <BaseSelect.Value>
            {(current) =>
              current
                ? options.find((o) => o.value === current)?.label
                : placeholder
            }
          </BaseSelect.Value>
          <BaseSelect.Icon className="text-on-surface-variant">
            <ChevronDownIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <BaseSelect.Positioner className="z-50" sideOffset={4}>
            <BaseSelect.Popup className="max-h-60 overflow-auto rounded border border-outline-variant bg-surface-container-lowest py-1 shadow-lg">
              <BaseSelect.List>
                {options.map((option) => (
                  <BaseSelect.Item
                    key={option.value}
                    value={option.value}
                    className="cursor-pointer px-3 py-2 text-sm text-on-surface outline-none data-highlighted:bg-surface-container-low"
                  >
                    <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                  </BaseSelect.Item>
                ))}
              </BaseSelect.List>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
    </div>
  );
}
