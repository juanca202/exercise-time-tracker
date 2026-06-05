"use client";

import { formatPeriodLabel } from "../lib/aggregations";
import { useTimeTrackerStore } from "../store/time-tracker-store";
import { ChevronLeftIcon, ChevronRightIcon, iconClassName } from "./icons";

export function PeriodSelector() {
  const selectedPeriod = useTimeTrackerStore((s) => s.selectedPeriod);
  const shiftPeriod = useTimeTrackerStore((s) => s.shiftPeriod);

  return (
    <div className="flex items-center gap-2 rounded-lg border border-card-border bg-surface-container-lowest px-3 py-2 shadow-elevation-1">
      <button
        type="button"
        aria-label="Período anterior"
        onClick={() => shiftPeriod(-1)}
        className="rounded p-1.5 text-on-surface-variant transition-colors hover:bg-row-hover hover:text-on-surface"
      >
        <ChevronLeftIcon className={iconClassName("md")} aria-hidden="true" />
      </button>

      <div className="min-w-36 px-2 text-center">
        <p className="text-label-mono uppercase text-on-surface-variant">
          Período seleccionado
        </p>
        <p className="mt-0.5 text-body-md font-semibold text-on-surface">
          {formatPeriodLabel(selectedPeriod)}
        </p>
      </div>

      <button
        type="button"
        aria-label="Período siguiente"
        onClick={() => shiftPeriod(1)}
        className="rounded p-1.5 text-on-surface-variant transition-colors hover:bg-row-hover hover:text-on-surface"
      >
        <ChevronRightIcon className={iconClassName("md")} aria-hidden="true" />
      </button>
    </div>
  );
}
