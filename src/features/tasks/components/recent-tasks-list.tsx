import Link from "next/link";
import { PlayIcon } from "@/shared/icons/play-icon";
import type { Project, Task } from "@/shared/store/entities";
import { TaskIconBadge } from "./task-icon-badge";

interface RecentTasksListProps {
  tasks: Task[];
  projects: Project[];
  activeTaskId?: string;
  onPlay: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

/** Listado de Tareas Recientes (fiel al diseño de Figma, nodo 1:1452). */
export function RecentTasksList({
  tasks,
  projects,
  activeTaskId,
  onPlay,
  onEdit,
  onDelete,
}: RecentTasksListProps) {
  function projectName(projectId: string): string {
    return projects.find((project) => project.id === projectId)?.name ?? "";
  }

  return (
    <div className="rounded-sm border border-outline-variant bg-white shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between border-b border-outline-variant bg-background px-6 py-6">
        <h3 className="text-base font-bold text-primary">Tareas Recientes</h3>
        <Link href="/historial" className="text-sm font-bold text-primary">
          Ver Historial
        </Link>
      </div>
      {tasks.length === 0 ? (
        <p className="p-6 text-sm text-on-surface-variant">
          Todavía no creaste ninguna Tarea.
        </p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between border-t border-outline-variant p-6 first:border-t-0"
            >
              <div className="flex items-center gap-4">
                <TaskIconBadge name={task.name} />
                <div>
                  <p className="text-base font-bold text-primary">
                    {task.name}
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    {projectName(task.projectId)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <button
                  type="button"
                  onClick={() => onEdit(task)}
                  className="text-sm font-medium text-on-surface-variant underline"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(task)}
                  className="text-sm font-medium text-error underline"
                >
                  Eliminar
                </button>
                {task.id === activeTaskId ? (
                  <span className="text-sm font-medium text-secondary">
                    En ejecución
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onPlay(task.id)}
                    aria-label={`Iniciar temporizador para ${task.name}`}
                    className="flex size-10 items-center justify-center rounded-full text-secondary hover:bg-surface"
                  >
                    <PlayIcon className="size-3.5" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
