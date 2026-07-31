import { formatHoursMinutesWords } from "@/shared/format-duration";

interface TasksSummaryHeaderProps {
  weeklyGoalPercentage: number;
  totalSecondsThisWeek: number;
  totalSecondsThisMonth: number;
}

/** Encabezado de "Tareas" con meta semanal y totales (fiel a Figma, nodo 1:1380). */
export function TasksSummaryHeader({
  weeklyGoalPercentage,
  totalSecondsThisWeek,
  totalSecondsThisMonth,
}: TasksSummaryHeaderProps) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h1 className="text-3xl font-semibold text-primary">Tareas</h1>
        <p className="text-base text-on-surface-variant">
          Has alcanzado el{" "}
          <span className="font-bold text-secondary">
            {weeklyGoalPercentage}%
          </span>{" "}
          de tu meta semanal.
        </p>
      </div>
      <div className="flex gap-4">
        <div className="min-w-[160px] rounded-sm border border-outline-variant bg-white px-4 py-4 shadow-[0_4px_6px_rgba(0,0,0,0.04)]">
          <p className="font-mono text-xs tracking-wider text-on-surface-variant uppercase opacity-50">
            Total semanal
          </p>
          <p className="text-2xl font-bold text-primary">
            {formatHoursMinutesWords(totalSecondsThisWeek)}
          </p>
        </div>
        <div className="min-w-[160px] rounded-sm border border-outline-variant bg-white px-4 py-4 shadow-[0_4px_6px_rgba(0,0,0,0.04)]">
          <p className="font-mono text-xs tracking-wider text-on-surface-variant uppercase opacity-50">
            Total mensual
          </p>
          <p className="text-2xl font-bold text-primary">
            {formatHoursMinutesWords(totalSecondsThisMonth)}
          </p>
        </div>
      </div>
    </div>
  );
}
