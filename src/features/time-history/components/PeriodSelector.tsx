import { formatMonthLabel } from "../utils/formatMonthLabel";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

interface PeriodSelectorProps {
  year: number;
  month: number;
  onPrevious: () => void;
  onNext: () => void;
}

/** Control de navegación "mes anterior" / "mes siguiente" del periodo del historial (AC-004). */
export function PeriodSelector({
  year,
  month,
  onPrevious,
  onNext,
}: PeriodSelectorProps) {
  return (
    <div className="flex items-center gap-2 rounded-card border border-outline-variant bg-surface-container-lowest p-1.5 shadow-sm">
      <button
        type="button"
        onClick={onPrevious}
        aria-label="Mes anterior"
        className="flex size-7 items-center justify-center rounded text-on-surface-variant hover:bg-surface-container-low"
      >
        <ChevronLeftIcon />
      </button>
      <div className="min-w-[140px] px-2 text-center">
        <p className="font-mono text-xs tracking-wider text-outline uppercase">
          Periodo seleccionado
        </p>
        <p className="font-bold text-primary">
          {formatMonthLabel(year, month)}
        </p>
      </div>
      <button
        type="button"
        onClick={onNext}
        aria-label="Mes siguiente"
        className="flex size-7 items-center justify-center rounded text-on-surface-variant hover:bg-surface-container-low"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
}
