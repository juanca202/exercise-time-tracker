"use client";

import { formatDurationClock } from "../../lib/duration";
import { formatRelativeTime } from "../../lib/relative-time";
import { getRecentEntries } from "../../lib/selectors";
import { useTimeTrackerStore } from "../../store/time-tracker-store";

const RECENT_ENTRIES_LIMIT = 5;

export function RecentEntriesList() {
  const timeEntries = useTimeTrackerStore((state) => state.timeEntries);
  const tasks = useTimeTrackerStore((state) => state.tasks);
  const projects = useTimeTrackerStore((state) => state.projects);
  const startTimer = useTimeTrackerStore((state) => state.startTimer);
  const now = new Date();

  const recentEntries = getRecentEntries(timeEntries, RECENT_ENTRIES_LIMIT);

  return (
    <section
      aria-label="Tareas Recientes"
      className="rounded-lg border border-outline-variant p-6"
    >
      <h2 className="text-headline-md font-semibold text-on-surface">
        Tareas Recientes
      </h2>
      {recentEntries.length === 0 ? (
        <p className="mt-4 text-body-lg text-on-surface-variant">
          Aún no hay registros de tiempo.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col divide-y divide-outline-variant">
          {recentEntries.map((entry) => {
            const task = tasks[entry.taskId];
            const project = task ? projects[task.projectId] : undefined;
            return (
              <li
                key={entry.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="text-body-lg text-on-surface">
                    {task?.name ?? "Tarea eliminada"}
                  </p>
                  <p className="text-body-md text-on-surface-variant">
                    {project?.name ?? ""}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-mono text-body-md text-on-surface">
                      {formatDurationClock(entry.durationSeconds)}
                    </p>
                    <p className="text-body-md text-on-surface-variant">
                      {formatRelativeTime(entry.createdAt, now)}
                    </p>
                  </div>
                  {task ? (
                    <button
                      type="button"
                      aria-label={`Iniciar temporizador para ${task.name}`}
                      onClick={() => startTimer(task.id)}
                      className="rounded-full border border-outline p-2"
                    >
                      ▷
                    </button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
