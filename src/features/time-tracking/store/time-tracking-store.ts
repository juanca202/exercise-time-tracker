import { create } from "zustand";
import { generateId } from "../lib/id";
import { loadState, saveState } from "../lib/storage";
import type {
  Project,
  Task,
  TimeEntry,
  TimeTrackingState,
} from "../types/domain";

export interface TimeTrackingStore extends TimeTrackingState {
  /** Crea un Proyecto con Nombre obligatorio y Descripción opcional. */
  createProject(input: { name: string; description?: string }): Project;
  /** Crea una Tarea asociada a un Proyecto existente. */
  createTask(input: { projectId: string; name: string }): Task;
  /**
   * Inicia el temporizador para una Tarea. Si ya hay un temporizador activo
   * en una Tarea distinta, lo detiene y persiste su Registro de Tiempo antes
   * de iniciar el nuevo. Si la Tarea indicada ya es la activa, no hace nada.
   */
  startTimer(taskId: string): void;
  /**
   * Detiene el temporizador activo, calcula su Duración y persiste el
   * Registro de Tiempo resultante (solo si la Duración es mayor que cero).
   * No hace nada si no hay ningún temporizador activo.
   */
  stopTimer(): void;
  /**
   * Crea un Registro de Tiempo manual para una Tarea existente. Lanza si la
   * Tarea no existe o si la Duración no es mayor que cero.
   */
  createManualTimeEntry(input: {
    taskId: string;
    date: string;
    durationSeconds: number;
  }): TimeEntry;
  /**
   * Carga el estado persistido en `localStorage` (si existe) reemplazando el
   * estado actual del dominio. No hace nada si no hay nada persistido.
   *
   * Se llama explícitamente desde un efecto de cliente (nunca durante el
   * render inicial) para que el primer render coincida entre servidor y
   * cliente y evitar errores de hidratación de Next.js.
   */
  hydrate(): void;
}

function persist(state: TimeTrackingState): void {
  saveState({
    projects: state.projects,
    tasks: state.tasks,
    timeEntries: state.timeEntries,
    activeTimer: state.activeTimer,
  });
}

function emptyState(): TimeTrackingState {
  return {
    projects: [],
    tasks: [],
    timeEntries: [],
    activeTimer: null,
  };
}

/**
 * Crea una instancia independiente del store de dominio de Time Tracking.
 *
 * El estado inicial es siempre el mismo (vacío), tanto en servidor como en
 * cliente; el estado persistido en `localStorage` solo se carga al llamar a
 * `hydrate()` explícitamente.
 *
 * @example
 * const store = createTimeTrackingStore();
 * store.getState().hydrate();
 * store.getState().createProject({ name: "Mi proyecto" });
 */
export function createTimeTrackingStore() {
  return create<TimeTrackingStore>()((set, get) => ({
    ...emptyState(),

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

    startTimer(taskId) {
      const { activeTimer } = get();

      if (activeTimer?.taskId === taskId) {
        return;
      }

      if (activeTimer) {
        get().stopTimer();
      }

      set({ activeTimer: { taskId, startedAt: new Date().toISOString() } });
      persist(get());
    },

    stopTimer() {
      const { activeTimer, timeEntries } = get();
      if (!activeTimer) {
        return;
      }

      const endTime = new Date();
      const startTime = new Date(activeTimer.startedAt);
      const durationSeconds = Math.floor(
        (endTime.getTime() - startTime.getTime()) / 1000,
      );

      if (durationSeconds > 0) {
        const entry: TimeEntry = {
          id: generateId(),
          taskId: activeTimer.taskId,
          date: endTime.toISOString().slice(0, 10),
          durationSeconds,
          source: "timer",
          startTime: activeTimer.startedAt,
          endTime: endTime.toISOString(),
          createdAt: endTime.toISOString(),
        };
        set({ timeEntries: [...timeEntries, entry], activeTimer: null });
      } else {
        set({ activeTimer: null });
      }

      persist(get());
    },

    createManualTimeEntry({ taskId, date, durationSeconds }) {
      const taskExists = get().tasks.some((task) => task.id === taskId);
      if (!taskExists) {
        throw new Error("Debe seleccionar una Tarea existente.");
      }

      if (durationSeconds <= 0) {
        throw new Error("La duración debe ser mayor que cero.");
      }

      const entry: TimeEntry = {
        id: generateId(),
        taskId,
        date,
        durationSeconds,
        source: "manual",
        createdAt: new Date().toISOString(),
      };

      set((state) => ({ timeEntries: [...state.timeEntries, entry] }));
      persist(get());
      return entry;
    },

    hydrate() {
      const persisted = loadState();
      if (persisted) {
        set(persisted);
      }
    },
  }));
}

/** Instancia única del store de dominio usada por la aplicación. */
export const useTimeTrackingStore = createTimeTrackingStore();
