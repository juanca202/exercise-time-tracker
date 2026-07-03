import { create } from "zustand";
import { generateId } from "../lib/id";
import { loadState, saveState } from "../lib/storage";
import type { Project, Task, TimeTrackingState } from "../types/domain";

export interface TimeTrackingStore extends TimeTrackingState {
  /** Crea un Proyecto con Nombre obligatorio y Descripción opcional. */
  createProject(input: { name: string; description?: string }): Project;
  /** Crea una Tarea asociada a un Proyecto existente. */
  createTask(input: { projectId: string; name: string }): Task;
}

function persist(state: TimeTrackingState): void {
  saveState({
    projects: state.projects,
    tasks: state.tasks,
    timeEntries: state.timeEntries,
    activeTimer: state.activeTimer,
  });
}

function initialState(): TimeTrackingState {
  return (
    loadState() ?? {
      projects: [],
      tasks: [],
      timeEntries: [],
      activeTimer: null,
    }
  );
}

/**
 * Crea una instancia independiente del store de dominio de Time Tracking,
 * hidratada desde el almacenamiento local vigente en el momento de la llamada.
 *
 * @example
 * const store = createTimeTrackingStore();
 * store.getState().createProject({ name: "Mi proyecto" });
 */
export function createTimeTrackingStore() {
  return create<TimeTrackingStore>()((set, get) => ({
    ...initialState(),

    createProject({ name, description }) {
      const trimmedName = name.trim();
      if (!trimmedName) {
        throw new Error("El nombre del proyecto es obligatorio.");
      }

      const project: Project = {
        id: generateId(),
        name: trimmedName,
        description: description?.trim() || undefined,
        createdAt: new Date().toISOString(),
      };

      set((state) => ({ projects: [...state.projects, project] }));
      persist(get());
      return project;
    },

    createTask({ projectId, name }) {
      const projectExists = get().projects.some((p) => p.id === projectId);
      if (!projectExists) {
        throw new Error(
          "Debe seleccionar un Proyecto existente para crear la Tarea.",
        );
      }

      const trimmedName = name.trim();
      if (!trimmedName) {
        throw new Error("El nombre de la tarea es obligatorio.");
      }

      const task: Task = {
        id: generateId(),
        projectId,
        name: trimmedName,
        createdAt: new Date().toISOString(),
      };

      set((state) => ({ tasks: [...state.tasks, task] }));
      persist(get());
      return task;
    },
  }));
}

/** Instancia única del store de dominio usada por la aplicación. */
export const useTimeTrackingStore = createTimeTrackingStore();
