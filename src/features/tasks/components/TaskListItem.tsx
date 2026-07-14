"use client";

import { useProjectsStore } from "@/features/projects";
import { colorFromString } from "@/lib/colorFromString";
import { formatHms } from "@/lib/formatHms";
import { selectTaskLastActivity, selectTaskTotalTime } from "../selectors";
import { useTasksStore } from "../store/tasksStore";
import type { Task } from "../types";
import { formatRelativeTime } from "../utils/formatRelativeTime";
import { PlayIcon, TaskIcon } from "./icons";

/** Fila de "Tareas Recientes": Nombre, Proyecto, tiempo acumulado, última actividad y acción de inicio. */
export function TaskListItem({ task }: { task: Task }) {
  // Se suscribe a timeEntries únicamente para re-renderizar cuando cambian los Registros de Tiempo.
  useTasksStore((state) => state.timeEntries);
  const activeTimer = useTasksStore((state) => state.activeTimer);
  const startTimer = useTasksStore((state) => state.startTimer);
  const project = useProjectsStore((state) =>
    state.projects.find((p) => p.id === task.projectId),
  );

  const totalMs = selectTaskTotalTime(task.id);
  const lastActivity = selectTaskLastActivity(task.id);
  const isActive = activeTimer?.taskId === task.id;

  return (
    <li className="flex items-center justify-between border-t border-outline-variant p-6 first:border-t-0">
      <div className="flex items-center gap-4">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded text-white"
          style={{ backgroundColor: colorFromString(task.name) }}
          aria-hidden="true"
        >
          <TaskIcon />
        </span>
        <div>
          <h4 className="font-bold text-primary">{task.name}</h4>
          {project && (
            <p className="text-sm text-on-surface-variant">{project.name}</p>
          )}
        </div>
      </div>

      {isActive ? (
        <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary">
          En Ejecución
        </span>
      ) : (
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="font-mono text-xs tracking-wider text-primary">
              {formatHms(totalMs)}
            </p>
            {lastActivity && (
              <p className="text-xs text-on-surface-variant">
                {formatRelativeTime(lastActivity)}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => startTimer(task.id)}
            aria-label={`Iniciar temporizador de ${task.name}`}
            className="flex size-10 items-center justify-center rounded-full text-secondary hover:bg-surface-container-low"
          >
            <PlayIcon />
          </button>
        </div>
      )}
    </li>
  );
}
