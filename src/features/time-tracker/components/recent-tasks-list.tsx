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
    <section className="rounded-lg border border-outline-variant bg-surface-container-lowest shadow-sm">
      <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4">
        <h2 className="text-base font-semibold text-on-surface">
          Tareas Recientes
        </h2>
        <Link
          href="/historial"
          className="text-sm font-medium text-primary hover:underline"
        >
          Ver Historial
        </Link>
      </div>

      {recentTasks.length === 0 ? (
        <p className="px-6 py-8 text-sm text-on-surface-variant">
          Aún no hay registros de tiempo. Inicia un temporizador o crea una
          tarea.
        </p>
      ) : (
        <ul className="divide-y divide-outline-variant">
          {recentTasks.map((row) => {
            const isActive = activeTimer?.taskId === row.taskId;

            return (
              <li
                key={row.taskId}
                className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-surface-container-low"
              >
                <TaskIconBadge
                  taskName={row.taskName}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-outline-variant/60"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-on-surface">
                    {row.taskName}
                  </p>
                  <p className="truncate text-xs text-on-surface-variant">
                    {row.projectName}
                  </p>
                </div>

                <div className="hidden shrink-0 text-right sm:block">
                  <p className="font-mono text-sm font-medium text-on-surface">
                    {formatDurationHms(row.lastEntryDurationMs)}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {formatCompletedRelativeTime(row.lastEntryAt)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => startTimer({ taskId: row.taskId })}
                  disabled={isActive}
                  aria-label={`Iniciar temporizador en ${row.taskName}`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-outline bg-surface-container-lowest text-on-surface transition-colors hover:border-secondary hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <PlayIcon
                    className={iconClassName("sm", "text-on-surface")}
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
