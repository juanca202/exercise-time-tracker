import { beforeEach, describe, expect, it } from "vitest";
import {
  selectMonthlyTotal,
  selectTaskLastActivity,
  selectTaskTotalTime,
  selectWeeklyGoalProgress,
  selectWeeklyTotal,
  WEEKLY_GOAL_MS,
} from "./selectors";
import { useTasksStore } from "./store/tasksStore";
import type { TimeEntry } from "./types";

function aTimeEntry(overrides: Partial<TimeEntry> = {}): TimeEntry {
  return {
    id: crypto.randomUUID(),
    taskId: "task-1",
    startedAt: new Date(2026, 6, 8, 9, 0, 0).toISOString(),
    endedAt: new Date(2026, 6, 8, 10, 0, 0).toISOString(),
    durationMs: 60 * 60 * 1000,
    source: "timer",
    ...overrides,
  };
}

function addEntry(entry: TimeEntry) {
  useTasksStore.setState((state) => ({
    timeEntries: [...state.timeEntries, entry],
  }));
}

describe("tasks selectors", () => {
  beforeEach(() => {
    useTasksStore.setState({ tasks: [], timeEntries: [], activeTimer: null });
  });

  it("selectTaskTotalTime suma los Registros de una Tarea (0 si no tiene ninguno)", () => {
    addEntry(aTimeEntry({ taskId: "task-1", durationMs: 30 * 60 * 1000 }));
    addEntry(aTimeEntry({ taskId: "task-1", durationMs: 15 * 60 * 1000 }));
    addEntry(aTimeEntry({ taskId: "task-2", durationMs: 90 * 60 * 1000 }));

    expect(selectTaskTotalTime("task-1")).toBe(45 * 60 * 1000);
    expect(selectTaskTotalTime("task-sin-registros")).toBe(0);
  });

  it("selectTaskLastActivity retorna el endedAt más reciente, o null sin Registros", () => {
    addEntry(
      aTimeEntry({
        taskId: "task-1",
        endedAt: new Date(2026, 6, 6).toISOString(),
      }),
    );
    addEntry(
      aTimeEntry({
        taskId: "task-1",
        endedAt: new Date(2026, 6, 8).toISOString(),
      }),
    );

    expect(selectTaskLastActivity("task-1")).toBe(
      new Date(2026, 6, 8).toISOString(),
    );
    expect(selectTaskLastActivity("task-sin-registros")).toBeNull();
  });

  it("selectWeeklyTotal solo suma Registros dentro de la semana calendario actual", () => {
    const wednesday = new Date(2026, 6, 8);
    addEntry(
      aTimeEntry({
        endedAt: new Date(2026, 6, 8).toISOString(),
        durationMs: 60_000,
      }),
    );
    addEntry(
      aTimeEntry({
        endedAt: new Date(2026, 5, 30).toISOString(),
        durationMs: 999_000,
      }),
    );

    expect(selectWeeklyTotal(wednesday)).toBe(60_000);
  });

  it("selectMonthlyTotal solo suma Registros dentro del mes calendario actual", () => {
    const midMonth = new Date(2026, 6, 15);
    addEntry(
      aTimeEntry({
        endedAt: new Date(2026, 6, 1).toISOString(),
        durationMs: 60_000,
      }),
    );
    addEntry(
      aTimeEntry({
        endedAt: new Date(2026, 5, 30).toISOString(),
        durationMs: 999_000,
      }),
    );

    expect(selectMonthlyTotal(midMonth)).toBe(60_000);
  });

  it("selectWeeklyGoalProgress calcula el porcentaje respecto a 40h, con techo de 100", () => {
    const wednesday = new Date(2026, 6, 8);
    addEntry(
      aTimeEntry({
        endedAt: new Date(2026, 6, 8).toISOString(),
        durationMs: WEEKLY_GOAL_MS / 2,
      }),
    );

    expect(selectWeeklyGoalProgress(wednesday)).toBe(50);

    addEntry(
      aTimeEntry({
        endedAt: new Date(2026, 6, 8).toISOString(),
        durationMs: WEEKLY_GOAL_MS * 2,
      }),
    );
    expect(selectWeeklyGoalProgress(wednesday)).toBe(100);
  });

  it("los totales semanal/mensual son 0 sin Registros en el periodo, sin errores", () => {
    const wednesday = new Date(2026, 6, 8);

    expect(selectWeeklyTotal(wednesday)).toBe(0);
    expect(selectMonthlyTotal(wednesday)).toBe(0);
    expect(selectWeeklyGoalProgress(wednesday)).toBe(0);
  });
});
