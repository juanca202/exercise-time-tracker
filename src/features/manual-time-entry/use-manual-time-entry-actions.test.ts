import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTimeEntryStore } from "@/shared/store/use-time-entry-store";
import { useManualTimeEntryActions } from "./use-manual-time-entry-actions";

function resetStore() {
  useTimeEntryStore.setState({ timeEntries: [] });
}

describe("useManualTimeEntryActions", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-30T12:00:00.000Z"));
    resetStore();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("crea un Registro de Tiempo manual válido", () => {
    const { result } = renderHook(() => useManualTimeEntryActions());

    let createResult: ReturnType<typeof result.current.createManualTimeEntry>;
    act(() => {
      createResult = result.current.createManualTimeEntry({
        taskId: "task-1",
        date: "2026-07-30",
        durationSeconds: 3600,
      });
    });

    expect(createResult!).toEqual({ created: true });
    expect(useTimeEntryStore.getState().timeEntries).toHaveLength(1);
    expect(useTimeEntryStore.getState().timeEntries[0]).toMatchObject({
      taskId: "task-1",
      source: "manual",
      date: "2026-07-30",
      durationSeconds: 3600,
    });
  });

  it("rechaza una Duración menor o igual a cero", () => {
    const { result } = renderHook(() => useManualTimeEntryActions());

    let createResult: ReturnType<typeof result.current.createManualTimeEntry>;
    act(() => {
      createResult = result.current.createManualTimeEntry({
        taskId: "task-1",
        date: "2026-07-30",
        durationSeconds: 0,
      });
    });

    expect(createResult!).toEqual({
      created: false,
      error: "duration-not-positive",
    });
    expect(useTimeEntryStore.getState().timeEntries).toEqual([]);
  });

  it("rechaza una Fecha futura", () => {
    const { result } = renderHook(() => useManualTimeEntryActions());

    let createResult: ReturnType<typeof result.current.createManualTimeEntry>;
    act(() => {
      createResult = result.current.createManualTimeEntry({
        taskId: "task-1",
        date: "2026-07-31",
        durationSeconds: 3600,
      });
    });

    expect(createResult!).toEqual({ created: false, error: "future-date" });
    expect(useTimeEntryStore.getState().timeEntries).toEqual([]);
  });
});
