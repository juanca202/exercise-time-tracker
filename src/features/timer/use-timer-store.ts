import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { localStorageAdapter } from "@/shared/persistence/local-storage-adapter";
import { useTimeEntryStore } from "@/shared/store/use-time-entry-store";

export interface ActiveTimer {
  taskId: string;
  startTime: string;
}

interface TimerState {
  activeTimer: ActiveTimer | null;
  start: (taskId: string) => void;
  stop: () => void;
}

/**
 * Calcula la Duración de la sesión y persiste su Registro de Tiempo (RF-009).
 * Si la Duración resulta ≤ 0 (p. ej. desfase del reloj del sistema), la
 * descarta sin persistir en vez de bloquear al usuario (RF-010, ver RS-001).
 */
function persistCompletedSession(activeTimer: ActiveTimer, endTime: Date) {
  const start = new Date(activeTimer.startTime);
  const durationSeconds = Math.round(
    (endTime.getTime() - start.getTime()) / 1000,
  );

  if (durationSeconds <= 0) {
    return;
  }

  useTimeEntryStore.getState().createTimeEntry({
    taskId: activeTimer.taskId,
    source: "timer",
    date: activeTimer.startTime.slice(0, 10),
    durationSeconds,
    startTime: activeTimer.startTime,
    endTime: endTime.toISOString(),
  });
}

/** Store de feature: único temporizador activo en toda la aplicación (BR-02). */
export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      activeTimer: null,
      start: (taskId) => {
        const current = get().activeTimer;
        if (current) {
          if (current.taskId === taskId) {
            return;
          }
          persistCompletedSession(current, new Date());
        }
        set({ activeTimer: { taskId, startTime: new Date().toISOString() } });
      },
      stop: () => {
        const current = get().activeTimer;
        if (!current) {
          return;
        }
        persistCompletedSession(current, new Date());
        set({ activeTimer: null });
      },
    }),
    {
      name: "temporizador",
      storage: createJSONStorage(() => localStorageAdapter),
    },
  ),
);
