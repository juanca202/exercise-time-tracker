import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CreateProjectInput, Project } from "./project";

export interface ProjectState {
  projects: Project[];
  createProject: (input: CreateProjectInput) => Project;
}

/**
 * Store de Proyectos (ADR-004, ADR-011), independiente del store de
 * Tareas/Registros de Tiempo (ver design de `project-management`).
 */
export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      createProject: (input) => {
        const name = input.name.trim();

        if (!name) {
          throw new Error("El nombre del proyecto es obligatorio");
        }

        const description = input.description?.trim() || undefined;
        const project: Project = { id: crypto.randomUUID(), name, description };

        set({ projects: [...get().projects, project] });

        return project;
      },
    }),
    {
      name: "time-tracker:projects",
      partialize: (state) => ({ projects: state.projects }),
      skipHydration: true,
    },
  ),
);
