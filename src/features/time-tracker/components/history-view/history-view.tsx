"use client";

import { useState } from "react";
import { formatDurationClock, formatDurationShort } from "../../lib/duration";
import {
  formatPeriodLabel,
  getCurrentPeriod,
  shiftPeriod,
  type Period,
} from "../../lib/period";
import {
  getEntriesForPeriod,
  getProjectTotalsForPeriod,
} from "../../lib/selectors";
import { useTimeTrackerStore } from "../../store/time-tracker-store";

export function HistoryView({
  initialPeriod,
}: { initialPeriod?: Period } = {}) {
  const timeEntries = useTimeTrackerStore((state) => state.timeEntries);
  const tasks = useTimeTrackerStore((state) => state.tasks);
  const projects = useTimeTrackerStore((state) => state.projects);
  const [period, setPeriod] = useState<Period>(
    () => initialPeriod ?? getCurrentPeriod(new Date()),
  );

  const entries = getEntriesForPeriod(timeEntries, period);
  const projectTotals = getProjectTotalsForPeriod(
    timeEntries,
    tasks,
    projects,
    period,
  );
  const totalSeconds = entries.reduce(
    (total, entry) => total + entry.durationSeconds,
    0,
  );
  const distinctProjectCount = new Set(
    projectTotals.map((item) => item.project.id),
  ).size;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-lg font-semibold text-on-surface">
          Historial de Tiempo
        </h1>
        <div className="flex items-center gap-4 rounded-lg border border-outline-variant px-4 py-2">
          <button
            type="button"
            aria-label="Periodo anterior"
            onClick={() => setPeriod((current) => shiftPeriod(current, -1))}
          >
            {"<"}
          </button>
          <span className="text-label-mono uppercase text-on-surface-variant">
            {formatPeriodLabel(period)}
          </span>
          <button
            type="button"
            aria-label="Periodo siguiente"
            onClick={() => setPeriod((current) => shiftPeriod(current, 1))}
          >
            {">"}
          </button>
        </div>
      </div>

      {projectTotals.length === 0 ? (
        <p className="text-body-lg text-on-surface-variant">
          No hay registros para este periodo.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projectTotals.map(({ project, totalSeconds: projectSeconds }) => (
            <article
              key={project.id}
              className="rounded-lg border border-outline-variant p-6"
            >
              <p className="text-body-lg font-semibold text-on-surface">
                {project.name}
              </p>
              <p className="font-mono text-headline-md text-on-surface">
                {formatDurationShort(projectSeconds)}
              </p>
            </article>
          ))}
        </div>
      )}

      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="text-label-mono uppercase text-on-surface-variant">
              Fecha
            </th>
            <th className="text-label-mono uppercase text-on-surface-variant">
              Proyecto
            </th>
            <th className="text-label-mono uppercase text-on-surface-variant">
              Tarea
            </th>
            <th className="text-label-mono uppercase text-on-surface-variant">
              Duración
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const task = tasks[entry.taskId];
            const project = task ? projects[task.projectId] : undefined;
            return (
              <tr key={entry.id} className="border-t border-outline-variant">
                <td className="py-3">{entry.date}</td>
                <td className="py-3">{project?.name ?? ""}</td>
                <td className="py-3">{task?.name ?? ""}</td>
                <td className="py-3 font-mono">
                  {formatDurationClock(entry.durationSeconds)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex items-center justify-between rounded-lg border border-outline-variant px-6 py-4">
        <span className="text-body-md text-on-surface-variant">
          {entries.length} registros
        </span>
        <span className="text-body-md text-on-surface-variant">
          {distinctProjectCount} proyectos
        </span>
        <span className="font-mono text-headline-md text-on-surface">
          {formatDurationShort(totalSeconds)}
        </span>
      </div>
    </div>
  );
}
