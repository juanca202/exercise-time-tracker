"use client";

import { useProjectsStore } from "@/features/projects";
import { formatHms } from "@/lib/formatHms";
import { useEffect, useState } from "react";
import { useTasksStore } from "../store/tasksStore";

/** Tarjeta "Current Activity": temporizador activo con su Tarea, o el estado inactivo (AC-004/006). */
export function ActiveTimerCard() {
  const activeTimer = useTasksStore((state) => state.activeTimer);
  const tasks = useTasksStore((state) => state.tasks);
  const stopTimer = useTasksStore((state) => state.stopTimer);
  const [elapsedMs, setElapsedMs] = useState(0);

  const task = activeTimer
    ? tasks.find((candidate) => candidate.id === activeTimer.taskId)
    : undefined;
  const project = useProjectsStore((state) =>
    task
      ? state.projects.find((candidate) => candidate.id === task.projectId)
      : undefined,
  );

  useEffect(() => {
    if (!activeTimer) {
      return;
    }

    const startedAtMs = new Date(activeTimer.startedAt).getTime();
    const updateElapsed = () => setElapsedMs(Date.now() - startedAtMs);

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [activeTimer]);

  if (!activeTimer) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-1 border border-outline-variant bg-surface-container-lowest p-12 text-center shadow-sm">
        <p className="text-on-surface-variant">
          No tenés ningún temporizador activo.
        </p>
        <p className="text-sm text-on-surface-variant">
          Iniciá uno desde Tareas Recientes.
        </p>
      </div>
    );
  }

  const startedLabel = new Date(activeTimer.startedAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 border border-outline-variant bg-surface-container-lowest p-12 text-center shadow-sm">
      {project && (
        <p className="font-mono text-xs font-medium tracking-wider text-secondary uppercase">
          {project.name}
        </p>
      )}
      <h2 className="text-3xl font-semibold text-primary">
        {task?.name ?? "Tarea"}
      </h2>
      <p className="text-on-surface-variant">Iniciado a las {startedLabel}</p>
      <p className="font-mono text-6xl tracking-tight text-primary">
        {formatHms(elapsedMs)}
      </p>
      <button
        type="button"
        onClick={stopTimer}
        className="mt-6 rounded-[2px] bg-error-container px-8 py-3 text-sm font-bold text-on-error-container hover:opacity-90"
      >
        Detener Sesión
      </button>
    </div>
  );
}
