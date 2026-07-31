import { describe, expect, it } from "vitest";
import type { Task, TimeEntry } from "@/shared/store/entities";
import {
  totalSecondsForMonth,
  totalSecondsForProject,
  totalSecondsForTask,
  totalSecondsForWeek,
} from "./calculate-totals";

function buildTimeEntries(count: number): TimeEntry[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `entry-${index}`,
    taskId: `task-${index % 20}`,
    source: index % 2 === 0 ? "timer" : "manual",
    date: `2026-${((index % 12) + 1).toString().padStart(2, "0")}-15`,
    durationSeconds: 60 * ((index % 120) + 1),
  }));
}

function buildTasks(count: number): Task[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `task-${index}`,
    projectId: `project-${index % 5}`,
    name: `Tarea ${index}`,
  }));
}

describe("rendimiento de las agregaciones (RP-003)", () => {
  it("calcula todos los totales para 1000 Registros de Tiempo en menos de 2 segundos", () => {
    const timeEntries = buildTimeEntries(1000);
    const tasks = buildTasks(20);

    const start = performance.now();

    totalSecondsForTask(timeEntries, "task-5");
    totalSecondsForProject(timeEntries, tasks, "project-2");
    totalSecondsForMonth(timeEntries, 2026, 7);
    totalSecondsForWeek(timeEntries, new Date(2026, 6, 30));

    const elapsedMs = performance.now() - start;

    expect(elapsedMs).toBeLessThan(2000);
  });
});
