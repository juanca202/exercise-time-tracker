import { describe, expect, it } from "vitest";
import { getLatestTimeEntry } from "./get-latest-time-entry";

function anEntry(id: string, taskId: string, startedAt: number) {
  return {
    id,
    taskId,
    startedAt,
    endedAt: startedAt + 60_000,
    durationSeconds: 60,
    source: "manual" as const,
  };
}

describe("getLatestTimeEntry", () => {
  it("devuelve el Registro más reciente de la Tarea", () => {
    const older = anEntry("older", "task-1", 1000);
    const newer = anEntry("newer", "task-1", 5000);
    const otherTask = anEntry("other", "task-2", 9000);

    expect(getLatestTimeEntry([older, newer, otherTask], "task-1")).toBe(newer);
  });

  it("devuelve undefined cuando la Tarea no tiene Registros", () => {
    expect(getLatestTimeEntry([], "task-1")).toBeUndefined();
  });
});
