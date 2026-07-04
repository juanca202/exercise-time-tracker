"use client";

import { useState } from "react";
import { formatDuration } from "../lib/duration";
import { addMonths, formatMonthLabel, isEntryInMonth } from "../lib/period";
import {
  formatHoursAndMinutes,
  monthTotalSeconds,
  totalsByProject,
  totalsByTask,
} from "../lib/totals";
import { useTimeTrackingStore } from "../store/time-tracking-store";

/**
 * Vista "Historial de Registros": navegación por mes, resumen de tiempo por
 * Proyecto, tabla de Registros de Tiempo del periodo, totales por Tarea y
 * estadísticas del periodo (registros, proyectos, total de horas).
 */
export function HistoryView() {
  const projects = useTimeTrackingStore((state) => state.projects);
  const tasks = useTimeTrackingStore((state) => state.tasks);
  const timeEntries = useTimeTrackingStore((state) => state.timeEntries);

  const now = new Date();
  const [period, setPeriod] = useState({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  });

  const entriesInPeriod = timeEntries.filter((entry) =>
    isEntryInMonth(entry, period.year, period.month),
  );
  const involvedProjectIds = new Set(
    entriesInPeriod.map(
      (entry) => tasks.find((task) => task.id === entry.taskId)?.projectId,
    ),
  );
  const projectsInPeriod = projects.filter((project) =>
    involvedProjectIds.has(project.id),
  );
  const tasksInPeriod = tasks.filter((task) =>
    entriesInPeriod.some((entry) => entry.taskId === task.id),
  );

  function goToPreviousMonth() {
    setPeriod(addMonths(period.year, period.month, -1));
  }

  function goToNextMonth() {
    setPeriod(addMonths(period.year, period.month, 1));
  }

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          Historial de Registros
        </h1>
        <div className="flex items-center gap-3 rounded-(--radius-standard) border border-border bg-surface-elevated px-4 py-2">
          <button
            type="button"
            aria-label="Mes anterior"
            onClick={goToPreviousMonth}
            className="text-tertiary hover:text-foreground"
          >
            ‹
          </button>
          <div className="text-center">
            <p className="text-xs font-medium tracking-wide text-tertiary uppercase">
              Periodo seleccionado
            </p>
            <p className="font-medium text-foreground">
              {formatMonthLabel(period.year, period.month)}
            </p>
          </div>
          <button
            type="button"
            aria-label="Mes siguiente"
            onClick={goToNextMonth}
            className="text-tertiary hover:text-foreground"
          >
            ›
          </button>
        </div>
      </div>

      {entriesInPeriod.length === 0 ? (
        <p className="text-sm text-tertiary">
          No hay Registros de Tiempo en este periodo.
        </p>
      ) : (
        <>
          <ul className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {totalsByProject(projectsInPeriod, tasks, entriesInPeriod).map(
              (project) => (
                <li
                  key={project.id}
                  className="rounded-(--radius-container) border border-border bg-surface-elevated p-4"
                >
                  <p className="text-xs font-medium tracking-wide text-tertiary uppercase">
                    {project.name}
                  </p>
                  <p className="font-mono text-lg text-foreground">
                    {formatHoursAndMinutes(project.totalSeconds)}
                  </p>
                </li>
              ),
            )}
          </ul>

          <div className="mb-6 overflow-x-auto rounded-(--radius-container) border border-border bg-surface-elevated">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs tracking-wide text-tertiary uppercase">
                <tr>
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Proyecto</th>
                  <th className="p-3">Tarea</th>
                  <th className="p-3">Duración</th>
                </tr>
              </thead>
              <tbody>
                {[...entriesInPeriod]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((entry) => {
                    const task = tasks.find((t) => t.id === entry.taskId);
                    const project = projects.find(
                      (p) => p.id === task?.projectId,
                    );
                    return (
                      <tr
                        key={entry.id}
                        className="border-b border-border last:border-b-0"
                      >
                        <td className="p-3">{entry.date}</td>
                        <td className="p-3 font-medium">{project?.name}</td>
                        <td className="p-3">{task?.name}</td>
                        <td className="p-3 font-mono">
                          {formatDuration(entry.durationSeconds)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div className="mb-6 rounded-(--radius-container) border border-border bg-surface-elevated p-4">
            <h2 className="mb-3 font-semibold text-foreground">
              Totales por Tarea
            </h2>
            <ul className="flex flex-col gap-2">
              {totalsByTask(tasksInPeriod, entriesInPeriod).map((task) => (
                <li key={task.id} className="flex justify-between text-sm">
                  <span className="text-foreground">{task.name}</span>
                  <span className="font-mono text-tertiary">
                    {formatHoursAndMinutes(task.totalSeconds)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between rounded-(--radius-container) border border-border bg-surface-elevated p-4 text-sm">
            <div>
              <span className="text-xs font-medium tracking-wide text-tertiary uppercase">
                Registros encontrados
              </span>
              <p className="text-foreground">{`${entriesInPeriod.length} registros`}</p>
            </div>
            <div>
              <span className="text-xs font-medium tracking-wide text-tertiary uppercase">
                Proyectos
              </span>
              <p className="text-foreground">{`${projectsInPeriod.length} proyectos`}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-medium tracking-wide text-tertiary uppercase">
                Total de horas
              </span>
              <p className="font-mono text-lg text-foreground">
                {formatDuration(
                  monthTotalSeconds(entriesInPeriod, period.year, period.month),
                )}
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
