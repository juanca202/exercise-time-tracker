import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Task, TimeEntry } from "../types";
import { isValidDuration } from "../utils/isValidDuration";

interface ActiveTimer {
  taskId: string;
  startedAt: string;
}

export interface TasksState {
  tasks: Task[];
  timeEntries: TimeEntry[];
  activeTimer: ActiveTimer | null;
  /**
   * Crea una Tarea asociada a un Proyecto.
   *
   * No valida la existencia referencial del Proyecto: la UI solo ofrece Proyectos reales
   * (Select poblado desde `useProjectsStore`), lo que evita un import cruzado con esa store.
   *
   * @returns la Tarea creada, o `null` si el Nombre está vacío o no se seleccionó un Proyecto (BR-01, AC-001).
   */
  addTask: (projectId: string, name: string) => Task | null;
  /**
   * Inicia el temporizador de una Tarea. Si otro temporizador está activo en una Tarea distinta,
   * lo detiene y persiste su Registro de Tiempo antes de activar el nuevo (BR-02).
   */
  startTimer: (taskId: string) => void;
  /** Detiene el temporizador activo y persiste su Registro de Tiempo. Sin efecto si no hay ninguno activo. */
  stopTimer: () => void;
  /**
   * Crea un Registro de Tiempo manual para una Tarea.
   *
   * @returns el Registro creado, o `null` si falta algún campo obligatorio o la Duración no es válida (BR-03).
   */
  addManualTimeEntry: (
    taskId: string,
    date: string,
    durationMs: number,
  ) => TimeEntry | null;
}

function createTimeEntry(
  taskId: string,
  startedAt: string,
  endedAt: string,
  durationMs: number,
  source: TimeEntry["source"],
): TimeEntry {
  return {
    id: crypto.randomUUID(),
    taskId,
    startedAt,
    endedAt,
    durationMs,
    source,
  };
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: [],
      timeEntries: [],
      activeTimer: null,

      addTask: (projectId, name) => {
        const trimmedName = name.trim();

        if (!trimmedName || !projectId) {
          return null;
        }

        const task: Task = {
          id: crypto.randomUUID(),
          projectId,
          name: trimmedName,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({ tasks: [...state.tasks, task] }));
        return task;
      },

      startTimer: (taskId) => {
        const { activeTimer, timeEntries } = get();
        let nextEntries = timeEntries;

        if (activeTimer && activeTimer.taskId !== taskId) {
          const endedAt = new Date().toISOString();
          const durationMs =
            new Date(endedAt).getTime() -
            new Date(activeTimer.startedAt).getTime();

          if (isValidDuration(durationMs)) {
            nextEntries = [
              ...timeEntries,
              createTimeEntry(
                activeTimer.taskId,
                activeTimer.startedAt,
                endedAt,
                durationMs,
                "timer",
              ),
            ];
          }
        }

        set({
          timeEntries: nextEntries,
          activeTimer: { taskId, startedAt: new Date().toISOString() },
        });
      },

      stopTimer: () => {
        const { activeTimer, timeEntries } = get();
        if (!activeTimer) {
          return;
        }

        const endedAt = new Date().toISOString();
        const durationMs =
          new Date(endedAt).getTime() -
          new Date(activeTimer.startedAt).getTime();

        if (!isValidDuration(durationMs)) {
          set({ activeTimer: null });
          return;
        }

        set({
          timeEntries: [
            ...timeEntries,
            createTimeEntry(
              activeTimer.taskId,
              activeTimer.startedAt,
              endedAt,
              durationMs,
              "timer",
            ),
          ],
          activeTimer: null,
        });
      },

      addManualTimeEntry: (taskId, date, durationMs) => {
        if (!taskId || !date || !isValidDuration(durationMs)) {
          return null;
        }

        const entry = createTimeEntry(taskId, date, date, durationMs, "manual");
        set((state) => ({ timeEntries: [...state.timeEntries, entry] }));
        return entry;
      },
    }),
    {
      name: "time-tracker/tasks",
      storage: createJSONStorage(() => localStorage),
      // Ídem projectsStore: se rehidrata manualmente en el cliente (ver useHydrateTasksStore).
      skipHydration: true,
    },
  ),
);
