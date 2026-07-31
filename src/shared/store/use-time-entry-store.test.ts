import { beforeEach, describe, expect, it } from "vitest";
import { useTimeEntryStore } from "./use-time-entry-store";

function resetStore() {
  useTimeEntryStore.setState({ timeEntries: [] });
}

describe("useTimeEntryStore", () => {
  beforeEach(() => {
    resetStore();
  });

  it("crea un Registro de Tiempo manual", () => {
    const timeEntry = useTimeEntryStore.getState().createTimeEntry({
      taskId: "task-1",
      source: "manual",
      date: "2026-07-30",
      durationSeconds: 3600,
    });

    expect(useTimeEntryStore.getState().timeEntries).toEqual([timeEntry]);
    expect(timeEntry.source).toBe("manual");
    expect(timeEntry.durationSeconds).toBe(3600);
  });

  it("crea un Registro de Tiempo de temporizador con horas de inicio y fin", () => {
    const timeEntry = useTimeEntryStore.getState().createTimeEntry({
      taskId: "task-1",
      source: "timer",
      date: "2026-07-30",
      durationSeconds: 1800,
      startTime: "2026-07-30T09:00:00.000Z",
      endTime: "2026-07-30T09:30:00.000Z",
    });

    expect(useTimeEntryStore.getState().timeEntries).toEqual([timeEntry]);
  });
});
