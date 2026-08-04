import { useTimeEntryStore } from "@/shared/store/use-time-entry-store";

export interface ManualTimeEntryInput {
  taskId: string;
  date: string;
  durationSeconds: number;
}

export interface CreateManualTimeEntryResult {
  created: boolean;
  error?: "duration-not-positive" | "future-date";
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Lógica de negocio de Registro Manual: valida Duración positiva (BR-05) y Fecha no futura. */
export function useManualTimeEntryActions() {
  const createTimeEntry = useTimeEntryStore((state) => state.createTimeEntry);

  function createManualTimeEntry(
    input: ManualTimeEntryInput,
  ): CreateManualTimeEntryResult {
    if (input.durationSeconds <= 0) {
      return { created: false, error: "duration-not-positive" };
    }
    if (input.date > todayIsoDate()) {
      return { created: false, error: "future-date" };
    }

    createTimeEntry({
      taskId: input.taskId,
      source: "manual",
      date: input.date,
      durationSeconds: input.durationSeconds,
    });
    return { created: true };
  }

  return { createManualTimeEntry };
}
