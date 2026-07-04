"use client";

import { formatDuration, formatRelativeTime } from "../lib/duration";
import { useTimeTrackingStore } from "../store/time-tracking-store";

const MAX_RECENT_ENTRIES = 5;

/**
 * Lista de los Registros de Tiempo más recientes (de cualquier origen), con
 * una acción rápida para reiniciar el temporizador de la misma Tarea.
 */
export function RecentEntriesList() {
  const projects = useTimeTrackingStore((state) => state.projects);
  const tasks = useTimeTrackingStore((state) => state.tasks);
  const timeEntries = useTimeTrackingStore((state) => state.timeEntries);
  const startTimer = useTimeTrackingStore((state) => state.startTimer);

  const recentEntries = [...timeEntries]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, MAX_RECENT_ENTRIES);

  if (recentEntries.length === 0) {
    return null;
  }

  return (
    <div className="rounded-(--radius-container) border border-border bg-surface-elevated">
      <div className="border-b border-border p-4">
        <h2 className="font-semibold text-foreground">Tareas Recientes</h2>
      </div>
      <ul>
        {recentEntries.map((entry) => {
          const task = tasks.find((t) => t.id === entry.taskId);
          const project = projects.find((p) => p.id === task?.projectId);

          return (
            <li
              key={entry.id}
              className="flex items-center justify-between gap-4 border-b border-border p-4 last:border-b-0"
            >
              <div>
                <p className="font-medium text-foreground">
                  {task?.name ?? "Tarea eliminada"}
                </p>
                <p className="text-sm text-tertiary">{project?.name}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm text-foreground">
                  {formatDuration(entry.durationSeconds)}
                </p>
                <p className="text-xs text-tertiary">
                  {formatRelativeTime(entry.createdAt)}
                </p>
              </div>
              {task ? (
                <button
                  type="button"
                  aria-label={`Reiniciar temporizador de ${task.name}`}
                  onClick={() => startTimer(task.id)}
                  className="text-primary hover:text-primary/80"
                >
                  ▶
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
