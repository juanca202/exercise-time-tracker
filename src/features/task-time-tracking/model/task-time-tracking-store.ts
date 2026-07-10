import { create } from "zustand";
import { persist } from "zustand/middleware";
import { calculateDurationSeconds } from "./calculate-duration-seconds";
import type { CreateTaskInput, Task } from "./task";
import type { CreateManualTimeEntryInput, TimeEntry } from "./time-entry";

export interface ActiveTimer {
  taskId: string;
  startedAt: number;
}

export interface TaskTimeTrackingState {
  tasks: Task[];
  timeEntries: TimeEntry[];
  activeTimer: ActiveTimer | null;
  createTask: (input: CreateTaskInput) => Task;
  startTimer: (taskId: string) => void;
  stopTimer: () => TimeEntry;
  addManualTimeEntry: (input: CreateManualTimeEntryInput) => TimeEntry;
}

/**
 * Store de Tareas + Registros de Tiempo (ADR-004, ADR-011), independiente del
 * store de Proyectos (ver design de `project-management` y
 * `task-time-tracking`).
 */
export const useTaskTimeTrackingStore = create<TaskTimeTrackingState>()(
  persist(
    (set, get) => ({
      tasks: [],
      timeEntries: [],
      activeTimer: null,

      createTask: (input) => {
        const name = input.name.trim();

        if (!name) {
          throw new Error("El nombre de la tarea es obligatorio");
        }

        if (!input.projectId) {
          throw new Error("Debe seleccionar un Proyecto");
        }

        const task: Task = {
          id: crypto.randomUUID(),
          name,
          projectId: input.projectId,
        };
        set({ tasks: [...get().tasks, task] });

        return task;
      },

      startTimer: (taskId) => {
        const { activeTimer, timeEntries } = get();

        if (activeTimer && activeTimer.taskId === taskId) {
          return;
        }

        if (!activeTimer) {
          set({ activeTimer: { taskId, startedAt: Date.now() } });
          return;
        }

        // Reemplazo automático de temporizador (BR-02) como una única
        // operación atómica: calcular duración del anterior → si es válida,
        // persistir su TimeEntry → limpiar el temporizador anterior y setear
        // el nuevo, todo en un único `set`.
        const now = Date.now();
        const previousDurationSeconds = calculateDurationSeconds(
          activeTimer.startedAt,
          now,
        );

        const previousEntry: TimeEntry | null =
          previousDurationSeconds > 0
            ? {
                id: crypto.randomUUID(),
                taskId: activeTimer.taskId,
                startedAt: activeTimer.startedAt,
                endedAt: now,
                durationSeconds: previousDurationSeconds,
                source: "timer",
              }
            : null;

        set({
          timeEntries: previousEntry
            ? [...timeEntries, previousEntry]
            : timeEntries,
          activeTimer: { taskId, startedAt: now },
        });
      },

      stopTimer: () => {
        const { activeTimer, timeEntries } = get();

        if (!activeTimer) {
          throw new Error("No hay ningún temporizador activo");
        }

        const now = Date.now();
        const durationSeconds = calculateDurationSeconds(
          activeTimer.startedAt,
          now,
        );
        set({ activeTimer: null });

        if (durationSeconds <= 0) {
          throw new Error(
            "La duración del temporizador debe ser mayor que cero",
          );
        }

        const entry: TimeEntry = {
          id: crypto.randomUUID(),
          taskId: activeTimer.taskId,
          startedAt: activeTimer.startedAt,
          endedAt: now,
          durationSeconds,
          source: "timer",
        };
        set({ timeEntries: [...timeEntries, entry] });

        return entry;
      },

      addManualTimeEntry: (input) => {
        if (!input.date) {
          throw new Error("La fecha es obligatoria");
        }

        if (!input.taskId) {
          throw new Error("Debe seleccionar una Tarea");
        }

        if (!(input.durationMinutes > 0)) {
          throw new Error("La duración debe ser mayor que cero");
        }

        const startedAt = new Date(`${input.date}T00:00:00`).getTime();
        const durationSeconds = Math.round(input.durationMinutes * 60);
        const entry: TimeEntry = {
          id: crypto.randomUUID(),
          taskId: input.taskId,
          startedAt,
          endedAt: startedAt + durationSeconds * 1000,
          durationSeconds,
          source: "manual",
        };
        set({ timeEntries: [...get().timeEntries, entry] });

        return entry;
      },
    }),
    {
      name: "time-tracker:tasks",
      skipHydration: true,
      partialize: (state) => ({
        tasks: state.tasks,
        timeEntries: state.timeEntries,
        activeTimer: state.activeTimer,
      }),
    },
  ),
);
