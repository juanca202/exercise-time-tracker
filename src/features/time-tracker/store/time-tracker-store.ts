import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { generateId } from "../lib/id";
import type { ActiveTimer, Project, Task, TimeEntry } from "../model/types";

export type TimeTrackerState = {
  projects: Record<string, Project>;
  tasks: Record<string, Task>;
  timeEntries: Record<string, TimeEntry>;
  activeTimer: ActiveTimer;
};

export type TimeTrackerActions = {
  createProject: (input: { name: string; description?: string }) => Project;
  createTask: (input: { projectId: string; name: string }) => Task;
  startTimer: (taskId: string, now?: Date) => void;
  stopTimer: (now?: Date) => void;
  addManualEntry: (input: {
    taskId: string;
    date: string;
    durationSeconds: number;
    now?: Date;
  }) => TimeEntry;
};

export const initialTimeTrackerState: TimeTrackerState = {
  projects: {},
  tasks: {},
  timeEntries: {},
  activeTimer: null,
};

export const useTimeTrackerStore = create<
  TimeTrackerState & TimeTrackerActions
>()(
  persist(
    (set, get) => ({
      ...initialTimeTrackerState,

      createProject: ({ name, description }) => {
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
        set((state) => ({
          projects: { ...state.projects, [project.id]: project },
        }));
        return project;
      },

      createTask: ({ projectId, name }) => {
        const trimmedName = name.trim();
        if (!trimmedName) {
          throw new Error("El nombre de la tarea es obligatorio.");
        }
        if (!get().projects[projectId]) {
          throw new Error("El proyecto no existe.");
        }
        const task: Task = {
          id: generateId(),
          projectId,
          name: trimmedName,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ tasks: { ...state.tasks, [task.id]: task } }));
        return task;
      },

      startTimer: (taskId, now = new Date()) => {
        if (!get().tasks[taskId]) {
          throw new Error("La tarea no existe.");
        }
        if (get().activeTimer) {
          get().stopTimer(now);
        }
        set({ activeTimer: { taskId, startedAt: now.toISOString() } });
      },

      stopTimer: (now = new Date()) => {
        const active = get().activeTimer;
        if (!active) {
          return;
        }
        const startedAt = new Date(active.startedAt);
        const durationSeconds = Math.floor(
          (now.getTime() - startedAt.getTime()) / 1000,
        );
        if (durationSeconds > 0) {
          const entry: TimeEntry = {
            id: generateId(),
            taskId: active.taskId,
            date: active.startedAt.slice(0, 10),
            startTime: active.startedAt,
            endTime: now.toISOString(),
            durationSeconds,
            source: "timer",
            createdAt: now.toISOString(),
          };
          set((state) => ({
            timeEntries: { ...state.timeEntries, [entry.id]: entry },
          }));
        }
        set({ activeTimer: null });
      },
      addManualEntry: () => {
        throw new Error("Not implemented yet");
      },
    }),
    {
      name: "time-tracker:v1",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
