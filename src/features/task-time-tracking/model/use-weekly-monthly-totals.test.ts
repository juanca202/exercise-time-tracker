import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTaskTimeTrackingStore } from "./task-time-tracking-store";
import { useWeeklyMonthlyTotals } from "./use-weekly-monthly-totals";

describe("useWeeklyMonthlyTotals", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 6, 15, 12));
    useTaskTimeTrackingStore.setState({
      tasks: [],
      timeEntries: [],
      activeTimer: null,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("suma solo los Registros de los últimos 7 días para el total semanal", () => {
    useTaskTimeTrackingStore.setState({
      timeEntries: [
        {
          id: "recent",
          taskId: "task-1",
          startedAt: new Date(2026, 6, 14).getTime(),
          endedAt: new Date(2026, 6, 14).getTime() + 3600_000,
          durationSeconds: 3600,
          source: "manual",
        },
        {
          id: "old",
          taskId: "task-1",
          startedAt: new Date(2026, 5, 1).getTime(),
          endedAt: new Date(2026, 5, 1).getTime() + 3600_000,
          durationSeconds: 3600,
          source: "manual",
        },
      ],
    });

    const { result } = renderHook(() => useWeeklyMonthlyTotals());

    expect(result.current.weeklySeconds).toBe(3600);
  });

  it("suma solo los Registros del mes calendario en curso para el total mensual", () => {
    useTaskTimeTrackingStore.setState({
      timeEntries: [
        {
          id: "this-month",
          taskId: "task-1",
          startedAt: new Date(2026, 6, 2).getTime(),
          endedAt: new Date(2026, 6, 2).getTime() + 1800_000,
          durationSeconds: 1800,
          source: "manual",
        },
        {
          id: "last-month",
          taskId: "task-1",
          startedAt: new Date(2026, 5, 28).getTime(),
          endedAt: new Date(2026, 5, 28).getTime() + 1800_000,
          durationSeconds: 1800,
          source: "manual",
        },
      ],
    });

    const { result } = renderHook(() => useWeeklyMonthlyTotals());

    expect(result.current.monthlySeconds).toBe(1800);
  });
});
