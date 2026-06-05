"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatDurationHms } from "../lib/duration";
import { useTimerTick } from "../lib/use-timer-tick";
import { useTimeTrackerStore } from "../store/time-tracker-store";
import { StopIcon, iconClassName } from "./icons";

export function SidebarActiveTimer() {
  const activeTimer = useTimeTrackerStore((s) => s.activeTimer);
  const tasks = useTimeTrackerStore((s) => s.tasks);
  const projects = useTimeTrackerStore((s) => s.projects);
  const stopTimer = useTimeTrackerStore((s) => s.stopTimer);
  const elapsedMs = useTimerTick();
  const [error, setError] = useState<string | null>(null);

  if (!activeTimer) return null;

  const task = tasks.find((t) => t.id === activeTimer.taskId);
  const project = task
    ? projects.find((p) => p.id === task.projectId)
    : undefined;

  const handleStop = () => {
    const result = stopTimer();
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setError(null);
  };

  return (
    <section
      className="rounded-lg border border-outline-variant border-l-4 border-l-secondary bg-surface-container-low p-4 shadow-sm"
      aria-live="polite"
    >
      {project ? (
        <p className="font-mono text-[10px] font-medium tracking-widest text-on-surface-variant uppercase">
          {project.name}
        </p>
      ) : null}

      <p className="mt-1 line-clamp-2 text-sm font-semibold text-on-surface">
        {task?.name ?? "Tarea desconocida"}
      </p>

      <p
        className="mt-3 font-mono text-2xl font-bold tracking-tight text-on-surface"
        aria-label={`Tiempo transcurrido: ${formatDurationHms(elapsedMs)}`}
      >
        {formatDurationHms(elapsedMs)}
      </p>

      <Button variant="secondary" className="mt-4 w-full" onClick={handleStop}>
        <StopIcon className={iconClassName("sm")} aria-hidden="true" />
        Detener Sesión
      </Button>

      {error ? (
        <p className="mt-2 text-xs text-error" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
