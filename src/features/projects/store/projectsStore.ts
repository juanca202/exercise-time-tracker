import { useTasksStore } from "@/features/tasks";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Project } from "../types";

export interface ProjectsState {
  projects: Project[];
  /**
   * Crea un Proyecto con el Nombre y Descripción dados.
   *
   * @returns el Proyecto creado, o `null` si el Nombre está vacío (BR implícita de AC-001: el Nombre es obligatorio).
   */
  addProject: (name: string, description?: string) => Project | null;
}

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set) => ({
      projects: [],
      addProject: (name, description) => {
        const trimmedName = name.trim();
        if (!trimmedName) {
          return null;
        }

        const project: Project = {
          id: crypto.randomUUID(),
          name: trimmedName,
          description: description?.trim() || undefined,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({ projects: [...state.projects, project] }));
        return project;
      },
    }),
    {
      name: "time-tracker/projects",
      storage: createJSONStorage(() => localStorage),
      // Evita tocar `localStorage` durante el render en servidor de este Client Component;
      // se rehidrata manualmente en el cliente (ver useHydrateProjectsStore).
      skipHydration: true,
    },
  ),
);

/** Tiempo total registrado de un Proyecto, en milisegundos: suma de los Registros de Tiempo de sus Tareas. */
export function selectProjectTotalTime(projectId: string): number {
  const { tasks, timeEntries } = useTasksStore.getState();
  const taskIds = new Set(
    tasks.filter((task) => task.projectId === projectId).map((task) => task.id),
  );

  return timeEntries
    .filter((entry) => taskIds.has(entry.taskId))
    .reduce((sum, entry) => sum + entry.durationMs, 0);
}
