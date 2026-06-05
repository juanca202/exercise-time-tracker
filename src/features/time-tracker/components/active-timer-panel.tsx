"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatDurationHms } from "../lib/duration";
import { useTimerTick } from "../lib/use-timer-tick";
import { useTimeTrackerStore } from "../store/time-tracker-store";
import { ClockIcon, StopIcon, iconClassName } from "./icons";

function formatStartedAt(iso: string): string {
  const date = new Date(iso);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${String(hour12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
}

export function ActiveTimerPanel() {
  const activeTimer = useTimeTrackerStore((s) => s.activeTimer);
  const tasks = useTimeTrackerStore((s) => s.tasks);
  const projects = useTimeTrackerStore((s) => s.projects);
  const stopTimer = useTimeTrackerStore((s) => s.stopTimer);
  const elapsedMs = useTimerTick();
  const [error, setError] = useState<string | null>(null);

  if (!activeTimer) {
    return (
      <section className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-outline-variant bg-surface-container-lowest p-8 text-center shadow-sm">
        <p className="font-mono text-xs tracking-widest text-on-surface-variant uppercase">
          Sin sesión activa
        </p>
        <p className="mt-3 max-w-sm text-sm text-on-surface-variant">
          Crea una tarea o pulsa Play en Tareas Recientes para iniciar el
          temporizador.
        </p>
      </section>
    );
  }

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
      className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-outline-variant border-l-4 border-l-secondary bg-surface-container-lowest p-8 text-center shadow-sm"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-2">
        {project ? (
          <p className="font-mono text-[10px] font-medium tracking-widest text-on-surface-variant uppercase">
            {project.name}
          </p>
        ) : null}

        <h2 className="text-2xl font-semibold leading-tight text-on-surface md:text-3xl">
          {task?.name ?? "Tarea desconocida"}
        </h2>

        <p className="mt-2 flex items-center justify-center gap-2 text-sm text-on-surface-variant">
          <ClockIcon className={iconClassName("sm")} aria-hidden="true" />
          Iniciado a las {formatStartedAt(activeTimer.startedAt)}
        </p>

        <p
          className="mt-6 font-sans text-5xl font-bold tracking-tight text-on-surface md:text-6xl"
          aria-label={`Tiempo transcurrido: ${formatDurationHms(elapsedMs)}`}
        >
          {formatDurationHms(elapsedMs)}
        </p>

        <Button
          variant="secondary"
          className="mt-8 min-w-48"
          onClick={handleStop}
        >
          <StopIcon className={iconClassName("sm")} aria-hidden="true" />
          Detener Sesión
        </Button>

        {error ? (
          <p className="mt-2 text-sm text-error" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}
