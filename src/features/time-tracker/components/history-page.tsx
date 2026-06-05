"use client";

import { useMemo } from "react";
import { formatDurationHms, formatDurationHoursMinutes } from "../lib/duration";
import { getProjectColorFromName } from "../lib/task-color";
import { useTrackerDerivedState } from "../store/use-derived-state";
import { PeriodSelector } from "./period-selector";
import { ProjectIconBadge } from "./project-icon-badge";

function formatHistoryDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const monthLabel = date
    .toLocaleDateString("es-ES", { month: "short" })
    .replace(/\.$/, "");
  return `${day} ${monthLabel}. ${year}`;
}

export function HistoryPage() {
  const {
    projectSummaries: summaries,
    historyRows: rows,
    historySummary: summary,
  } = useTrackerDerivedState();

  const topProjects = useMemo(
    () =>
      [...summaries]
        .filter((project) => project.totalMs > 0)
        .sort((a, b) => b.totalMs - a.totalMs)
        .slice(0, 3),
    [summaries],
  );

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="text-headline-lg-mobile md:text-headline-lg tracking-tight text-primary">
          Historial de Tiempo
        </h1>
        <PeriodSelector />
      </header>

      {topProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {topProjects.map((project) => {
            const { accent } = getProjectColorFromName(project.name);

            return (
              <article
                key={project.projectId}
                className="flex items-center gap-4 rounded-lg border border-card-border border-l-4 bg-surface-container-lowest p-4 shadow-elevation-1"
                style={{ borderLeftColor: accent }}
              >
                <ProjectIconBadge
                  projectName={project.name}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-card-border/60"
                />
                <div className="min-w-0">
                  <h2 className="truncate text-label-mono uppercase text-on-surface-variant">
                    {project.name}
                  </h2>
                  <p className="mt-1 font-mono text-2xl font-semibold text-on-surface">
                    {formatDurationHoursMinutes(project.totalMs)}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      <section className="overflow-hidden rounded-lg border border-card-border bg-surface-container-lowest shadow-elevation-1">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-body-md">
            <thead className="border-b border-card-border bg-surface-container-low">
              <tr>
                <th className="px-6 py-3 text-label-mono uppercase text-on-surface-variant">
                  Fecha
                </th>
                <th className="px-6 py-3 text-label-mono uppercase text-on-surface-variant">
                  Proyecto
                </th>
                <th className="px-6 py-3 text-label-mono uppercase text-on-surface-variant">
                  Tarea
                </th>
                <th className="px-6 py-3 text-right text-label-mono uppercase text-on-surface-variant">
                  Duración
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-on-surface-variant"
                  >
                    No hay registros en este período.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.entryId}
                    className="border-b border-card-border last:border-b-0 hover:bg-row-hover"
                  >
                    <td className="px-6 py-4 text-on-surface">
                      {formatHistoryDate(row.date)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-on-surface">
                      {row.projectName}
                    </td>
                    <td className="px-6 py-4 text-on-surface">
                      {row.taskName}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-on-surface">
                      {formatDurationHms(row.durationMs)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <footer className="flex flex-col gap-4 border-t border-card-border bg-surface-container-lowest px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-6 sm:gap-8">
            <div>
              <p className="text-label-mono uppercase text-on-surface-variant">
                Registros encontrados
              </p>
              <p className="mt-1 text-body-lg font-semibold text-on-surface">
                {summary.count} registros
              </p>
            </div>

            <div
              className="hidden h-12 w-px bg-card-border sm:block"
              aria-hidden="true"
            />

            <div>
              <p className="text-label-mono uppercase text-on-surface-variant">
                Proyectos
              </p>
              <p className="mt-1 text-body-lg font-semibold text-on-surface">
                {summary.projectCount} proyectos
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-card-border bg-surface-container-lowest px-6 py-4 sm:min-w-52 sm:text-right">
            <p className="text-label-mono uppercase text-on-surface-variant">
              Total de horas
            </p>
            <p className="mt-1 font-mono text-2xl font-bold text-on-surface">
              {formatDurationHms(summary.totalMs)}
            </p>
          </div>
        </footer>
      </section>
    </div>
  );
}
