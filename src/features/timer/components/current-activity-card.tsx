"use client";

import { useEffect, useState } from "react";
import { StopIcon } from "@/shared/icons/stop-icon";
import { ClockIcon } from "@/shared/icons/clock-icon";
import type { Project, Task } from "@/shared/store/entities";
import type { ActiveTimer } from "../use-timer-store";
import { formatElapsedTime, formatStartTime } from "../format-timer";

interface CurrentActivityCardProps {
  activeTimer: ActiveTimer | null;
  task: Task | undefined;
  project: Project | undefined;
  onStop: () => void;
}

/** Actualiza el tiempo transcurrido cada segundo mientras haya un `startTime`. */
function useElapsedSeconds(startTime: string | undefined): number {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) {
      return;
    }
    const start = new Date(startTime).getTime();
    const interval = setInterval(() => {
      setElapsed(Math.max(0, (Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  return elapsed;
}

/** Panel de sesión activa del temporizador (fiel al diseño de Figma, nodo 1:1394). */
export function CurrentActivityCard({
  activeTimer,
  task,
  project,
  onStop,
}: CurrentActivityCardProps) {
  const elapsedSeconds = useElapsedSeconds(activeTimer?.startTime);

  if (!activeTimer || !task) {
    return (
      <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-2 rounded-sm border border-outline-variant bg-white p-8 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
        <p className="text-lg font-semibold text-primary">
          Ningún temporizador en ejecución
        </p>
        <p className="text-sm text-on-surface-variant">
          Elige una Tarea en &quot;Tareas Recientes&quot; y presiona{" "}
          <strong>Iniciar</strong> para comenzar a registrar tiempo.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 rounded-sm border border-outline-variant bg-white p-8 py-12 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
      <p className="font-mono text-xs font-medium tracking-wider text-secondary uppercase">
        {project?.name}
      </p>
      <h2 className="text-3xl font-semibold text-primary">{task.name}</h2>
      <div className="flex items-center gap-2 pt-2 text-base text-on-surface-variant">
        <ClockIcon className="size-3" />
        <span>Iniciado a las {formatStartTime(activeTimer.startTime)}</span>
      </div>
      <p className="font-mono text-6xl font-medium tracking-tight text-primary">
        {formatElapsedTime(elapsedSeconds)}
      </p>
      <button
        type="button"
        onClick={onStop}
        className="mt-6 flex items-center gap-2 rounded-sm bg-error-container px-8 py-3 text-base font-bold text-on-error-container"
      >
        <StopIcon className="size-3" />
        Detener Sesión
      </button>
    </div>
  );
}
