import { formatHms } from "@/lib/formatHms";
import type { MonthSummary } from "../selectors";

/** Resumen del periodo: registros encontrados, proyectos involucrados y total de horas (AC-006). */
export function PeriodSummaryFooter({ summary }: { summary: MonthSummary }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant bg-surface-container-low px-6 py-6">
      <div className="flex items-center gap-6">
        <div>
          <p className="font-mono text-xs tracking-wider text-outline uppercase">
            Registros encontrados
          </p>
          <p className="font-bold text-primary">
            {summary.recordCount} registros
          </p>
        </div>
        <div className="h-8 w-px bg-outline-variant" aria-hidden="true" />
        <div>
          <p className="font-mono text-xs tracking-wider text-outline uppercase">
            Proyectos
          </p>
          <p className="font-bold text-primary">
            {summary.projectCount} proyectos
          </p>
        </div>
      </div>

      <div className="rounded-card bg-primary px-6 py-3">
        <p className="font-mono text-xs tracking-wider text-on-primary/70 uppercase">
          Total de horas
        </p>
        <p className="font-mono text-2xl text-on-primary">
          {formatHms(summary.totalMs)}
        </p>
      </div>
    </div>
  );
}
