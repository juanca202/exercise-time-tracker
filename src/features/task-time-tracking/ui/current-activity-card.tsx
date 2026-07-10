"use client";

import { formatDurationClock } from "@/shared/lib/format-duration-clock";
import { formatTimeAmPm } from "@/shared/lib/format-time-am-pm";
import { IconClock, IconStopSquare } from "@/shared/ui/icons";
import { useProjectStore } from "@/features/project-management";
import type { Task } from "../model/task";
import { useElapsedSeconds } from "../model/use-elapsed-seconds";

export function CurrentActivityCard({
  task,
  startedAt,
  onStop,
}: {
  task: Task;
  startedAt: number;
  onStop: () => void;
}) {
  const elapsedSeconds = useElapsedSeconds(startedAt);
  const projectName = useProjectStore(
    (state) =>
      state.projects.find((project) => project.id === task.projectId)?.name,
  );

  return (
    <div className="flex flex-col items-center gap-2 border border-border bg-surface px-8 py-12 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
      {projectName ? (
        <span className="text-xs font-medium tracking-[0.05em] text-accent uppercase">
          {projectName}
        </span>
      ) : null}
      <h3 className="text-center text-[32px] font-semibold text-ink">
        {task.name}
      </h3>
      <p className="flex items-center gap-2 text-base text-ink-muted">
        <IconClock className="size-3" />
        Iniciado a las {formatTimeAmPm(startedAt)}
      </p>
      <p className="font-mono text-[64px] leading-none font-medium tracking-[-0.05em] text-ink">
        {formatDurationClock(elapsedSeconds)}
      </p>
      <button
        type="button"
        onClick={onStop}
        className="mt-6 flex items-center gap-2 rounded-sm bg-error-bg px-8 py-3 text-base font-bold text-error-ink"
      >
        <IconStopSquare className="size-3" />
        Detener Sesión
      </button>
    </div>
  );
}
