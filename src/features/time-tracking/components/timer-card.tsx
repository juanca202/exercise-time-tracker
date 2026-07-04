"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import { SelectField } from "@/components/select-field";
import { formatDuration } from "../lib/duration";
import { useTimeTrackingStore } from "../store/time-tracking-store";

function elapsedSeconds(startedAt: string): number {
  return Math.max(
    0,
    Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000),
  );
}

/**
 * Card de temporizador: permite iniciar el temporizador de una Tarea cuando
 * no hay ninguno activo, y muestra el estado activo (Proyecto, Tarea, hora
 * de inicio y tiempo transcurrido en vivo) con la acción de detenerlo.
 */
export function TimerCard() {
  const projects = useTimeTrackingStore((state) => state.projects);
  const tasks = useTimeTrackingStore((state) => state.tasks);
  const activeTimer = useTimeTrackingStore((state) => state.activeTimer);
  const startTimer = useTimeTrackingStore((state) => state.startTimer);
  const stopTimer = useTimeTrackingStore((state) => state.stopTimer);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [, forceTick] = useState(0);

  useEffect(() => {
    if (!activeTimer) {
      return;
    }

    const interval = setInterval(() => forceTick((tick) => tick + 1), 1000);
    return () => clearInterval(interval);
  }, [activeTimer]);

  const elapsed = activeTimer ? elapsedSeconds(activeTimer.startedAt) : 0;

  if (activeTimer) {
    const activeTask = tasks.find((task) => task.id === activeTimer.taskId);
    const activeProject = projects.find(
      (project) => project.id === activeTask?.projectId,
    );
    const startedAtLabel = new Date(activeTimer.startedAt).toLocaleTimeString(
      "es-ES",
      { hour: "2-digit", minute: "2-digit" },
    );

    return (
      <div className="flex flex-col items-center gap-3 rounded-(--radius-container) border border-border bg-surface-elevated p-8 text-center">
        <p className="text-xs font-medium tracking-wide text-tertiary uppercase">
          {activeProject?.name} — {activeTask?.name}
        </p>
        <p className="text-sm text-tertiary">Iniciado a las {startedAtLabel}</p>
        <p className="font-mono text-5xl font-bold text-foreground">
          {formatDuration(elapsed)}
        </p>
        <Button variant="secondary" onClick={() => stopTimer()}>
          Detener Sesión
        </Button>
      </div>
    );
  }

  const groups = [
    {
      options: tasks.map((task) => {
        const project = projects.find((p) => p.id === task.projectId);
        return {
          value: task.id,
          label: project ? `${project.name} — ${task.name}` : task.name,
        };
      }),
    },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-(--radius-container) border border-border bg-surface-elevated p-8">
      <SelectField
        label="Tarea"
        placeholder={
          tasks.length === 0 ? "Crea una tarea primero" : "Selecciona una tarea"
        }
        value={selectedTaskId}
        onValueChange={setSelectedTaskId}
        groups={groups}
        disabled={tasks.length === 0}
      />
      <Button
        variant="primary"
        disabled={!selectedTaskId}
        onClick={() => selectedTaskId && startTimer(selectedTaskId)}
      >
        Iniciar
      </Button>
    </div>
  );
}
