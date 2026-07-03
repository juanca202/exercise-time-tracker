"use client";

import { useEffect, useState } from "react";
import { formatDurationClock } from "../../lib/duration";
import { useTimeTrackerStore } from "../../store/time-tracker-store";

export function TimerPanel() {
  const activeTimer = useTimeTrackerStore((state) => state.activeTimer);
  const tasks = useTimeTrackerStore((state) => state.tasks);
  const projects = useTimeTrackerStore((state) => state.projects);
  const stopTimer = useTimeTrackerStore((state) => state.stopTimer);
  const [now, setNow] = useState(() => new Date());

  // Adjust state during render (React-documented pattern) instead of
  // calling setState synchronously in the effect body: when a new timer
  // starts, refresh `now` immediately rather than waiting up to 1s for
  // the interval below to tick.
  const [lastActiveTimer, setLastActiveTimer] = useState(activeTimer);
  if (lastActiveTimer !== activeTimer) {
    setLastActiveTimer(activeTimer);
    if (activeTimer) {
      setNow(new Date());
    }
  }

  useEffect(() => {
    if (!activeTimer) {
      return;
    }
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, [activeTimer]);

  if (!activeTimer) {
    return (
      <section
        aria-label="Temporizador"
        className="rounded-lg border border-outline-variant bg-surface-container-lowest p-8 text-center"
      >
        <p className="text-body-lg text-on-surface-variant">
          Ningún temporizador activo. Inicia uno desde una tarea.
        </p>
      </section>
    );
  }

  const task = tasks[activeTimer.taskId];
  const project = task ? projects[task.projectId] : undefined;
  const elapsedSeconds = Math.floor(
    (now.getTime() - new Date(activeTimer.startedAt).getTime()) / 1000,
  );

  return (
    <section
      aria-label="Temporizador"
      className="rounded-lg border border-outline-variant bg-surface-container-lowest p-8 text-center"
    >
      {project ? (
        <p className="text-label-mono uppercase text-on-surface-variant">
          {project.name}
        </p>
      ) : null}
      <p className="text-headline-md font-semibold text-on-surface">
        {task?.name ?? "Tarea"}
      </p>
      <p className="text-body-md text-on-surface-variant">
        Iniciado a las {new Date(activeTimer.startedAt).toLocaleTimeString()}
      </p>
      <p className="font-mono text-display-time text-on-surface">
        {formatDurationClock(elapsedSeconds)}
      </p>
      <button
        type="button"
        onClick={() => stopTimer()}
        className="rounded bg-primary px-6 py-3 text-body-lg text-on-primary"
      >
        Detener Sesión
      </button>
    </section>
  );
}
