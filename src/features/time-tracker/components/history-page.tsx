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
        <h1 className="text-3xl font-semibold tracking-tight text-on-surface">
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
                className="flex items-center gap-4 rounded-lg border border-outline-variant border-l-4 bg-surface-container-lowest p-4 shadow-sm"
                style={{ borderLeftColor: accent }}
              >
                <ProjectIconBadge
                  projectName={project.name}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-outline-variant/60"
                />
                <div className="min-w-0">
                  <h2 className="truncate font-mono text-[10px] font-medium tracking-widest text-on-surface-variant uppercase">
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

      <section className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-outline-variant bg-surface-container-low">
              <tr>
                <th className="px-6 py-3 font-mono text-[10px] font-medium tracking-widest text-on-surface-variant uppercase">
                  Fecha
                </th>
                <th className="px-6 py-3 font-mono text-[10px] font-medium tracking-widest text-on-surface-variant uppercase">
                  Proyecto
                </th>
                <th className="px-6 py-3 font-mono text-[10px] font-medium tracking-widest text-on-surface-variant uppercase">
                  Tarea
                </th>
                <th className="px-6 py-3 text-right font-mono text-[10px] font-medium tracking-widest text-on-surface-variant uppercase">
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
                    className="border-b border-outline-variant last:border-b-0 hover:bg-surface-container-low"
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

        <footer className="flex flex-col gap-4 border-t border-outline-variant bg-surface-container-lowest px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-6 sm:gap-8">
            <div>
              <p className="font-mono text-[10px] font-medium tracking-widest text-on-surface-variant uppercase">
                Registros encontrados
              </p>
              <p className="mt-1 text-base font-semibold text-on-surface">
                {summary.count} registros
              </p>
            </div>

            <div
              className="hidden h-12 w-px bg-outline-variant sm:block"
              aria-hidden="true"
            />

            <div>
              <p className="font-mono text-[10px] font-medium tracking-widest text-on-surface-variant uppercase">
                Proyectos
              </p>
              <p className="mt-1 text-base font-semibold text-on-surface">
                {summary.projectCount} proyectos
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-outline-variant bg-surface-container-lowest px-6 py-4 sm:min-w-52 sm:text-right">
            <p className="font-mono text-[10px] font-medium tracking-widest text-on-surface-variant uppercase">
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
