import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { localStorageAdapter } from "@/shared/persistence/local-storage-adapter";
import type { Project } from "./entities";

export interface ProjectInput {
  name: string;
  description: string;
}

interface ProjectStoreState {
  projects: Project[];
  createProject: (input: ProjectInput) => Project;
  updateProject: (id: string, input: ProjectInput) => void;
  deleteProject: (id: string) => void;
}

/** Store raíz: CRUD crudo de Proyecto, sin reglas de negocio (ver ADR-012). */
export const useProjectStore = create<ProjectStoreState>()(
  persist(
    (set) => ({
      projects: [],
      createProject: (input) => {
        const project: Project = { id: crypto.randomUUID(), ...input };
        set((state) => ({ projects: [...state.projects, project] }));
        return project;
      },
      updateProject: (id, input) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? { ...project, ...input } : project,
          ),
        }));
      },
      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        }));
      },
    }),
    {
      name: "proyectos",
      storage: createJSONStorage(() => localStorageAdapter),
    },
  ),
);
