import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTimeEntryStore } from "@/shared/store/use-time-entry-store";
import { useTimerStore } from "./use-timer-store";

function resetStores() {
  useTimerStore.setState({ activeTimer: null });
  useTimeEntryStore.setState({ timeEntries: [] });
}

describe("useTimerStore", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-30T09:15:00.000Z"));
    resetStores();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("inicia el temporizador para una Tarea", () => {
    useTimerStore.getState().start("task-1");

    expect(useTimerStore.getState().activeTimer).toEqual({
      taskId: "task-1",
      startTime: "2026-07-30T09:15:00.000Z",
    });
  });

  it("no reinicia el temporizador si se inicia para la misma Tarea ya activa", () => {
    useTimerStore.getState().start("task-1");
    vi.setSystemTime(new Date("2026-07-30T09:20:00.000Z"));

    useTimerStore.getState().start("task-1");

    expect(useTimerStore.getState().activeTimer).toEqual({
      taskId: "task-1",
      startTime: "2026-07-30T09:15:00.000Z",
    });
    expect(useTimeEntryStore.getState().timeEntries).toEqual([]);
  });

  it("detiene automáticamente el temporizador anterior al iniciar uno para otra Tarea", () => {
    useTimerStore.getState().start("task-1");
    vi.setSystemTime(new Date("2026-07-30T09:45:00.000Z"));

    useTimerStore.getState().start("task-2");

    expect(useTimerStore.getState().activeTimer).toEqual({
      taskId: "task-2",
      startTime: "2026-07-30T09:45:00.000Z",
    });
    expect(useTimeEntryStore.getState().timeEntries).toHaveLength(1);
    expect(useTimeEntryStore.getState().timeEntries[0]).toMatchObject({
      taskId: "task-1",
      source: "timer",
      durationSeconds: 30 * 60,
    });
  });

  it("detiene el temporizador activo y persiste el Registro de Tiempo", () => {
    useTimerStore.getState().start("task-1");
    vi.setSystemTime(new Date("2026-07-30T10:15:00.000Z"));

    useTimerStore.getState().stop();

    expect(useTimerStore.getState().activeTimer).toBeNull();
    expect(useTimeEntryStore.getState().timeEntries).toHaveLength(1);
    expect(useTimeEntryStore.getState().timeEntries[0]).toMatchObject({
      taskId: "task-1",
      source: "timer",
      date: "2026-07-30",
      durationSeconds: 60 * 60,
      startTime: "2026-07-30T09:15:00.000Z",
      endTime: "2026-07-30T10:15:00.000Z",
    });
  });

  it("descarta el Registro de Tiempo si la Duración calculada es menor o igual a cero", () => {
    useTimerStore.getState().start("task-1");
    vi.setSystemTime(new Date("2026-07-30T09:14:00.000Z"));

    useTimerStore.getState().stop();

    expect(useTimerStore.getState().activeTimer).toBeNull();
    expect(useTimeEntryStore.getState().timeEntries).toEqual([]);
  });

  it("no hace nada al detener si no hay temporizador activo", () => {
    useTimerStore.getState().stop();

    expect(useTimerStore.getState().activeTimer).toBeNull();
    expect(useTimeEntryStore.getState().timeEntries).toEqual([]);
  });
});
