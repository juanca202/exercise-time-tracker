"use client";

import { useProjectStore } from "@/features/project-management";
import { useTaskTimeTrackingStore } from "@/features/task-time-tracking";
import { formatDuration } from "@/shared/lib/format-duration";
import { formatDurationClock } from "@/shared/lib/format-duration-clock";
import { useHydratePersistedStore } from "@/shared/lib/use-hydrate-persisted-store";
import { IconChevronLeft, IconChevronRight } from "@/shared/ui/icons";
import { StatCard } from "@/shared/ui/stat-card";
import { useTimeHistory } from "../model/use-time-history";

export function HistoryPage() {
  useHydratePersistedStore(useTaskTimeTrackingStore);
  useHydratePersistedStore(useProjectStore);

  const {
    periodLabel,
    goToPreviousMonth,
    goToNextMonth,
    entries,
    totalsByTask,
    totalsByProject,
    summary,
  } = useTimeHistory();

  const topProjectId = totalsByProject.reduce<{
    id: string | null;
    seconds: number;
  }>(
    (top, current) =>
      current.totalSeconds > top.seconds
        ? { id: current.projectId, seconds: current.totalSeconds }
        : top,
    { id: null, seconds: 0 },
  ).id;

  return (
    <section className="flex w-full max-w-[1280px] flex-col gap-6 p-6">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-[32px] font-semibold text-ink">
          Historial de Tiempo
        </h2>
        <div className="flex items-center gap-1 border border-border bg-surface p-1.5 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
          <button
            type="button"
            onClick={goToPreviousMonth}
            aria-label="Mes anterior"
            className="flex items-center justify-center rounded p-2 text-ink-muted"
          >
            <IconChevronLeft className="size-2" />
          </button>
          <div className="flex min-w-[140px] flex-col items-center px-4">
            <span className="text-xs font-medium tracking-[0.1em] text-ink-faint uppercase">
              Periodo Seleccionado
            </span>
            <span className="text-base font-bold text-ink capitalize">
              {periodLabel}
            </span>
          </div>
          <button
            type="button"
            onClick={goToNextMonth}
            aria-label="Mes siguiente"
            className="flex items-center justify-center rounded p-2 text-ink-muted"
          >
            <IconChevronRight className="size-2" />
          </button>
        </div>
      </div>

      {totalsByProject.length > 0 ? (
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-medium tracking-[0.05em] text-ink-muted uppercase">
            Totales por Proyecto
          </h3>
          <div className="flex flex-wrap gap-6">
            {totalsByProject.map((total) => (
              <StatCard
                key={total.projectId}
                label={total.projectName}
                value={formatDuration(total.totalSeconds)}
                accent={total.projectId === topProjectId}
              />
            ))}
          </div>
        </div>
      ) : null}

      {totalsByTask.length > 0 ? (
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-medium tracking-[0.05em] text-ink-muted uppercase">
            Totales por Tarea
          </h3>
          <div className="flex flex-wrap gap-6">
            {totalsByTask.map((total) => (
              <StatCard
                key={total.taskId}
                label={total.taskName}
                value={formatDuration(total.totalSeconds)}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div className="border border-border bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        {entries.length === 0 ? (
          <p className="p-6 text-sm text-ink-muted">
            No hay Registros de Tiempo en este periodo.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted">
                <th className="px-6 py-4 text-xs font-medium tracking-[0.05em] text-ink-muted uppercase">
                  Fecha
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-[0.05em] text-ink-muted uppercase">
                  Proyecto
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-[0.05em] text-ink-muted uppercase">
                  Tarea
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium tracking-[0.05em] text-ink-muted uppercase">
                  Duración
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr
                  key={entry.id}
                  className={index % 2 === 1 ? "bg-surface-muted" : undefined}
                >
                  <td className="px-6 py-4 text-base text-ink">{entry.date}</td>
                  <td className="px-6 py-4 text-base font-bold text-ink">
                    {entry.projectName}
                  </td>
                  <td className="px-6 py-4 text-base text-ink-muted">
                    {entry.taskName}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-xs tracking-[0.05em] text-accent">
                    {formatDurationClock(entry.durationSeconds)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border bg-surface-muted px-6 py-5">
          <div className="flex items-center gap-6">
            <div
              className="flex flex-col gap-0.5"
              data-testid="summary-record-count"
            >
              <span className="text-xs font-medium tracking-[0.05em] text-ink-faint uppercase">
                Registros Encontrados
              </span>
              <span className="text-base font-bold text-ink">
                {summary.recordCount} registros
              </span>
            </div>
            <span className="h-8 w-px bg-border" aria-hidden="true" />
            <div
              className="flex flex-col gap-0.5"
              data-testid="summary-project-count"
            >
              <span className="text-xs font-medium tracking-[0.05em] text-ink-faint uppercase">
                Proyecto
              </span>
              <span className="text-base font-bold text-ink">
                {summary.projectCount} proyectos
              </span>
            </div>
          </div>
          <div
            className="flex items-center gap-3 rounded-lg bg-ink px-6 py-3 shadow-lg"
            data-testid="summary-total-hours"
          >
            <span className="text-xs font-medium tracking-[0.05em] text-white/70 uppercase">
              Total de Horas
            </span>
            <span className="text-2xl text-white">
              {formatDurationClock(summary.totalSeconds)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
