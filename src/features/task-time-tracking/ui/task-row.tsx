"use client";

import { useProjectStore } from "@/features/project-management";
import { formatDuration } from "@/shared/lib/format-duration";
import { formatRelativeTime } from "@/shared/lib/format-relative-time";
import { IconDocument, IconPlay } from "@/shared/ui/icons";
import type { Task } from "../model/task";
import { getLatestTimeEntry } from "../model/get-latest-time-entry";
import { useTaskTimeTrackingStore } from "../model/task-time-tracking-store";

const BADGE_COLORS = ["#2e3a59", "#2c3c51", "#0f6b46"];

export function TaskRow({ task, index }: { task: Task; index: number }) {
  const startTimer = useTaskTimeTrackingStore((state) => state.startTimer);
  const latestEntry = useTaskTimeTrackingStore((state) =>
    getLatestTimeEntry(state.timeEntries, task.id),
  );
  const projectName = useProjectStore(
    (state) =>
      state.projects.find((project) => project.id === task.projectId)?.name,
  );

  return (
    <li className="flex items-center justify-between gap-4 border-t border-border px-6 py-5 first:border-t-0">
      <div className="flex items-center gap-4">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-sm"
          style={{ backgroundColor: BADGE_COLORS[index % BADGE_COLORS.length] }}
          aria-hidden="true"
        >
          <IconDocument className="size-4 text-white" />
        </span>
        <div>
          <p className="text-base font-bold text-ink">{task.name}</p>
          <p className="text-sm text-ink-muted">{projectName}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        {latestEntry ? (
          <div className="flex flex-col items-end">
            <span className="font-mono text-xs tracking-[0.05em] text-ink">
              {formatDuration(latestEntry.durationSeconds)}
            </span>
            <span className="text-xs text-ink-muted">
              {formatRelativeTime(latestEntry.startedAt)}
            </span>
          </div>
        ) : (
          <span className="text-xs text-ink-muted">Sin Registros</span>
        )}
        <button
          type="button"
          onClick={() => startTimer(task.id)}
          aria-label={`Iniciar temporizador de ${task.name}`}
          className="flex size-10 items-center justify-center rounded-full text-accent"
        >
          <IconPlay className="size-3" />
        </button>
      </div>
    </li>
  );
}
