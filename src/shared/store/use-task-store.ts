import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { localStorageAdapter } from "@/shared/persistence/local-storage-adapter";
import type { Task } from "./entities";

export interface TaskInput {
  projectId: string;
  name: string;
}

interface TaskStoreState {
  tasks: Task[];
  createTask: (input: TaskInput) => Task;
  updateTask: (id: string, input: TaskInput) => void;
  deleteTask: (id: string) => void;
}

/** Store raíz: CRUD crudo de Tarea, sin reglas de negocio (ver ADR-012). */
export const useTaskStore = create<TaskStoreState>()(
  persist(
    (set) => ({
      tasks: [],
      createTask: (input) => {
        const task: Task = { id: crypto.randomUUID(), ...input };
        set((state) => ({ tasks: [...state.tasks, task] }));
        return task;
      },
      updateTask: (id, input) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...input } : task,
          ),
        }));
      },
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },
    }),
    {
      name: "tareas",
      storage: createJSONStorage(() => localStorageAdapter),
    },
  ),
);
