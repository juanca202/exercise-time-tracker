"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { shiftPeriod as shiftPeriodUtil } from "../lib/aggregations";
import {
  selectHistoryRows,
  selectHistorySummary,
  selectMonthlyTotalMs,
  selectProjectSummaries,
  selectProjectTotalMs,
  selectRecentTasks,
  selectWeeklyGoalPercent,
  selectWeeklyTotalMs,
} from "../lib/selectors";
import { createManualEntry, createTimerEntry } from "../lib/time-entry-factory";
import type {
  HistoryRow,
  HistorySummary,
  ModalId,
  Project,
  ProjectSummary,
  RecentTaskRow,
  SelectedPeriod,
  StoreResult,
  Task,
  TimeTrackerState,
} from "../lib/types";
import { createSelectedPeriodMother } from "../testing/object-mothers";

export const STORAGE_KEY = "time-tracker:v1";

export const initialTimeTrackerState: TimeTrackerState = {
  projects: [],
  tasks: [],
  timeEntries: [],
  activeTimer: null,
  selectedPeriod: createSelectedPeriodMother(),
  modals: { newProject: false, newTask: false },
};

interface TimeTrackerActions {
  createProject: (input: { name: string; description?: string }) => StoreResult;
  createTask: (input: { projectId: string; name: string }) => StoreResult;
  startTimer: (input: { taskId: string }) => StoreResult;
  stopTimer: () => StoreResult;
  createManualEntry: (input: {
    taskId: string;
    date: string;
    durationMs: number;
  }) => StoreResult;
  getElapsedMs: () => number;
  getRecentTasks: (limit?: number) => RecentTaskRow[];
  getWeeklyTotalMs: () => number;
  getMonthlyTotalMs: () => number;
  getWeeklyGoalPercent: () => number;
  getProjectTotalMs: (projectId: string) => number;
  getHistoryRows: () => HistoryRow[];
  getHistorySummary: () => HistorySummary;
  getProjectSummaries: () => ProjectSummary[];
  setSelectedPeriod: (period: SelectedPeriod) => void;
  shiftPeriod: (delta: -1 | 1) => void;
  openModal: (modal: ModalId) => void;
  closeModal: (modal: ModalId) => void;
  resetStore: () => void;
}

export type TimeTrackerStore = TimeTrackerState & TimeTrackerActions;

function createId(): string {
  return crypto.randomUUID();
}

export const useTimeTrackerStore = create<TimeTrackerStore>()(
  persist(
    (set, get) => ({
      ...initialTimeTrackerState,

      createProject: ({ name, description }) => {
        const trimmedName = name.trim();
        if (!trimmedName) {
          return {
            ok: false,
            code: "NAME_REQUIRED",
            message: "El nombre es obligatorio",
          };
        }

        const project: Project = {
          id: createId(),
          name: trimmedName,
          description: description?.trim() || undefined,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          projects: [...state.projects, project],
          modals: { ...state.modals, newProject: false },
        }));

        return { ok: true };
      },

      createTask: ({ projectId, name }) => {
        const { projects } = get();

        if (projects.length === 0) {
          return {
            ok: false,
            code: "NO_PROJECTS",
            message: "Crea un proyecto antes de añadir tareas",
          };
        }

        const projectExists = projects.some((p) => p.id === projectId);
        if (!projectExists) {
          return {
            ok: false,
            code: "PROJECT_NOT_FOUND",
            message: "Proyecto no encontrado",
          };
        }

        const trimmedName = name.trim();
        if (!trimmedName) {
          return {
            ok: false,
            code: "NAME_REQUIRED",
            message: "El nombre es obligatorio",
          };
        }

        const task: Task = {
          id: createId(),
          projectId,
          name: trimmedName,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          tasks: [...state.tasks, task],
        }));

        return { ok: true, taskId: task.id };
      },

      openModal: (modal) => {
        set((state) => ({
          modals: { ...state.modals, [modal]: true },
        }));
      },

      closeModal: (modal) => {
        set((state) => ({
          modals: { ...state.modals, [modal]: false },
        }));
      },

      startTimer: ({ taskId }) => {
        const { tasks, activeTimer } = get();
        const taskExists = tasks.some((t) => t.id === taskId);
        if (!taskExists) {
          return {
            ok: false,
            code: "TASK_NOT_FOUND",
            message: "Tarea no encontrada",
          };
        }

        if (activeTimer) {
          const stopResult = get().stopTimer();
          if (!stopResult.ok && stopResult.code !== "INTERVAL_TOO_SHORT") {
            return stopResult;
          }
        }

        set({
          activeTimer: {
            taskId,
            startedAt: new Date().toISOString(),
          },
        });

        return { ok: true };
      },

      stopTimer: () => {
        const { activeTimer } = get();
        if (!activeTimer) {
          return { ok: true };
        }

        const endedAt = new Date().toISOString();
        const entryResult = createTimerEntry({
          taskId: activeTimer.taskId,
          startedAt: activeTimer.startedAt,
          endedAt,
        });

        if (!entryResult.ok) {
          set({ activeTimer: null });
          return entryResult;
        }

        set((state) => ({
          activeTimer: null,
          timeEntries: [...state.timeEntries, entryResult.entry],
        }));

        return { ok: true };
      },

      createManualEntry: ({ taskId, date, durationMs }) => {
        const { tasks } = get();
        const taskExists = tasks.some((t) => t.id === taskId);
        if (!taskExists) {
          return {
            ok: false,
            code: "TASK_NOT_FOUND",
            message: "Tarea no encontrada",
          };
        }

        const entryResult = createManualEntry({ taskId, date, durationMs });
        if (!entryResult.ok) return entryResult;

        set((state) => ({
          timeEntries: [...state.timeEntries, entryResult.entry],
        }));

        return { ok: true };
      },

      getElapsedMs: () => {
        const { activeTimer } = get();
        if (!activeTimer) return 0;
        return Date.now() - new Date(activeTimer.startedAt).getTime();
      },

      getWeeklyTotalMs: () => selectWeeklyTotalMs(get()),

      getMonthlyTotalMs: () => selectMonthlyTotalMs(get()),

      getWeeklyGoalPercent: () => selectWeeklyGoalPercent(get()),

      getProjectTotalMs: (projectId) => selectProjectTotalMs(get(), projectId),

      getHistoryRows: () => selectHistoryRows(get()),

      getHistorySummary: () => selectHistorySummary(get()),

      getProjectSummaries: () => selectProjectSummaries(get()),

      setSelectedPeriod: (period) => {
        set({ selectedPeriod: period });
      },

      shiftPeriod: (delta) => {
        const { selectedPeriod } = get();
        set({ selectedPeriod: shiftPeriodUtil(selectedPeriod, delta) });
      },

      getRecentTasks: (limit = 5) => selectRecentTasks(get(), limit),

      resetStore: () => {
        set(initialTimeTrackerState);
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        projects: state.projects,
        tasks: state.tasks,
        timeEntries: state.timeEntries,
        activeTimer: state.activeTimer,
        selectedPeriod: state.selectedPeriod,
      }),
    },
  ),
);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;

    try {
      const parsed = JSON.parse(event.newValue) as {
        state?: Partial<TimeTrackerState>;
      };
      if (parsed.state) {
        useTimeTrackerStore.setState(parsed.state);
      }
    } catch {
      // Ignorar JSON inválido de otras pestañas
    }
  });
}
