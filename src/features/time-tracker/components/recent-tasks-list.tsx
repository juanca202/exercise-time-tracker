"use client";

import Link from "next/link";
import { formatDurationHms } from "../lib/duration";
import { formatCompletedRelativeTime } from "../lib/relative-time";
import { useTrackerDerivedState } from "../store/use-derived-state";
import { useTimeTrackerStore } from "../store/time-tracker-store";
import { PlayIcon, iconClassName } from "./icons";
import { TaskIconBadge } from "./task-icon-badge";

export function RecentTasksList() {
  const { recentTasks } = useTrackerDerivedState();
  const startTimer = useTimeTrackerStore((s) => s.startTimer);
  const activeTimer = useTimeTrackerStore((s) => s.activeTimer);

  return (
    <section className="rounded-lg border border-card-border bg-surface-container-lowest shadow-elevation-1">
      <div className="flex items-center justify-between border-b border-card-border px-6 py-4">
        <h2 className="text-body-lg font-semibold text-on-surface">
          Tareas Recientes
        </h2>
        <Link
          href="/historial"
          className="text-body-md font-medium text-primary hover:underline"
        >
          Ver Historial
        </Link>
      </div>

      {recentTasks.length === 0 ? (
        <p className="px-6 py-8 text-body-md text-on-surface-variant">
          Aún no hay registros de tiempo. Inicia un temporizador o crea una
          tarea.
        </p>
      ) : (
        <ul className="divide-y divide-card-border">
          {recentTasks.map((row) => {
            const isActive = activeTimer?.taskId === row.taskId;

            return (
              <li
                key={row.taskId}
                className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-row-hover"
              >
                <TaskIconBadge
                  taskName={row.taskName}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-card-border/60"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-body-md font-semibold text-primary">
                    {row.taskName}
                  </p>
                  <p className="truncate text-body-md text-on-surface-variant">
                    {row.projectName}
                  </p>
                </div>

                <div className="hidden shrink-0 text-right sm:block">
                  <p className="font-mono text-body-md font-medium text-on-surface">
                    {formatDurationHms(row.lastEntryDurationMs)}
                  </p>
                  <p className="text-body-md text-on-surface-variant">
                    {formatCompletedRelativeTime(row.lastEntryAt)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => startTimer({ taskId: row.taskId })}
                  disabled={isActive}
                  aria-label={`Iniciar temporizador en ${row.taskName}`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-card-border bg-surface-container-lowest transition-colors hover:border-accent hover:bg-row-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <PlayIcon
                    className={iconClassName("sm", "text-accent")}
                    aria-hidden="true"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
