import { useProjectStore } from "@/shared/store/use-project-store";
import { useTaskStore } from "@/shared/store/use-task-store";
import type { TaskInput } from "@/shared/store/use-task-store";
import { useTimeEntryStore } from "@/shared/store/use-time-entry-store";

export interface CreateTaskResult {
  created: boolean;
  projectNotFound?: boolean;
}

export interface UpdateTaskResult {
  updated: boolean;
  projectNotFound?: boolean;
}

export interface DeleteTaskResult {
  deleted: boolean;
  blockedByTimeEntryCount?: number;
  blockedByActiveTimer?: boolean;
}

/**
 * Lógica de negocio de Tareas: valida el Proyecto al crear y al reasignar
 * (BR-01), y bloquea la eliminación de una Tarea con un temporizador activo
 * o con Registros de Tiempo asociados (BR-06).
 */
export function useTaskActions() {
  const tasks = useTaskStore((state) => state.tasks);
  const createTaskRaw = useTaskStore((state) => state.createTask);
  const updateTaskRaw = useTaskStore((state) => state.updateTask);
  const deleteTaskRaw = useTaskStore((state) => state.deleteTask);
  const projects = useProjectStore((state) => state.projects);
  const timeEntries = useTimeEntryStore((state) => state.timeEntries);

  function projectExists(projectId: string): boolean {
    return projects.some((project) => project.id === projectId);
  }

  function countTimeEntriesForTask(taskId: string): number {
    return timeEntries.filter((entry) => entry.taskId === taskId).length;
  }

  function createTask(input: TaskInput): CreateTaskResult {
    if (!projectExists(input.projectId)) {
      return { created: false, projectNotFound: true };
    }
    createTaskRaw(input);
    return { created: true };
  }

  function updateTask(id: string, input: TaskInput): UpdateTaskResult {
    if (!projectExists(input.projectId)) {
      return { updated: false, projectNotFound: true };
    }
    updateTaskRaw(id, input);
    return { updated: true };
  }

  function deleteTask(
    id: string,
    activeTimerTaskId?: string,
  ): DeleteTaskResult {
    if (activeTimerTaskId === id) {
      return { deleted: false, blockedByActiveTimer: true };
    }
    const blockedByTimeEntryCount = countTimeEntriesForTask(id);
    if (blockedByTimeEntryCount > 0) {
      return { deleted: false, blockedByTimeEntryCount };
    }
    deleteTaskRaw(id);
    return { deleted: true };
  }

  return {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    countTimeEntriesForTask,
  };
}
