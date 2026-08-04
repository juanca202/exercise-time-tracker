import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { localStorageAdapter } from "@/shared/persistence/local-storage-adapter";
import type { TimeEntry } from "./entities";

export type TimeEntryInput = Omit<TimeEntry, "id">;

interface TimeEntryStoreState {
  timeEntries: TimeEntry[];
  createTimeEntry: (input: TimeEntryInput) => TimeEntry;
}

/** Store raíz: CRUD crudo de Registro de Tiempo, sin reglas de negocio (ver ADR-012). */
export const useTimeEntryStore = create<TimeEntryStoreState>()(
  persist(
    (set) => ({
      timeEntries: [],
      createTimeEntry: (input) => {
        const timeEntry: TimeEntry = { id: crypto.randomUUID(), ...input };
        set((state) => ({
          timeEntries: [...state.timeEntries, timeEntry],
        }));
        return timeEntry;
      },
    }),
    {
      name: "registros-de-tiempo",
      storage: createJSONStorage(() => localStorageAdapter),
    },
  ),
);
