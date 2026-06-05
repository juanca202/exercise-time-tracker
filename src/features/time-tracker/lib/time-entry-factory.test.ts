import { describe, expect, it } from "vitest";
import { createManualEntry, createTimerEntry } from "./time-entry-factory";

describe("createTimerEntry", () => {
  it("crea TimeEntry source=timer con duración > 0", () => {
    const result = createTimerEntry({
      taskId: "task-1",
      startedAt: "2026-06-01T09:00:00.000Z",
      endedAt: "2026-06-01T10:30:00.000Z",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.entry).toMatchObject({
      taskId: "task-1",
      source: "timer",
      date: "2026-06-01",
      durationMs: 90 * 60 * 1000,
    });
    expect(result.entry.startedAt).toBe("2026-06-01T09:00:00.000Z");
    expect(result.entry.endedAt).toBe("2026-06-01T10:30:00.000Z");
    expect(result.entry.id).toBeTruthy();
    expect(result.entry.createdAt).toBeTruthy();
  });

  it("rechaza intervalo ≤ 0 con INTERVAL_TOO_SHORT", () => {
    const sameTime = "2026-06-01T09:00:00.000Z";

    const zeroResult = createTimerEntry({
      taskId: "task-1",
      startedAt: sameTime,
      endedAt: sameTime,
    });

    expect(zeroResult).toEqual({
      ok: false,
      code: "INTERVAL_TOO_SHORT",
      message: "El intervalo es demasiado corto",
    });

    const negativeResult = createTimerEntry({
      taskId: "task-1",
      startedAt: "2026-06-01T10:00:00.000Z",
      endedAt: "2026-06-01T09:00:00.000Z",
    });

    expect(negativeResult).toEqual({
      ok: false,
      code: "INTERVAL_TOO_SHORT",
      message: "El intervalo es demasiado corto",
    });
  });
});

describe("createManualEntry", () => {
  it("deriva startedAt/endedAt desde fecha y duración", () => {
    const result = createManualEntry({
      taskId: "task-1",
      date: "2026-06-15",
      durationMs: 2 * 60 * 60 * 1000,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.entry).toMatchObject({
      taskId: "task-1",
      date: "2026-06-15",
      source: "manual",
      durationMs: 2 * 60 * 60 * 1000,
    });
    expect(new Date(result.entry.startedAt).getHours()).toBe(0);
    expect(new Date(result.entry.startedAt).getMinutes()).toBe(0);
    expect(
      new Date(result.entry.endedAt).getTime() -
        new Date(result.entry.startedAt).getTime(),
    ).toBe(2 * 60 * 60 * 1000);
  });

  it("rechaza duración ≤ 0 con INVALID_DURATION", () => {
    expect(
      createManualEntry({
        taskId: "task-1",
        date: "2026-06-15",
        durationMs: 0,
      }),
    ).toEqual({
      ok: false,
      code: "INVALID_DURATION",
      message: "La duración debe ser mayor que cero",
    });

    expect(
      createManualEntry({
        taskId: "task-1",
        date: "2026-06-15",
        durationMs: -1000,
      }),
    ).toEqual({
      ok: false,
      code: "INVALID_DURATION",
      message: "La duración debe ser mayor que cero",
    });
  });
});
