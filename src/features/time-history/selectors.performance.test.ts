import { useProjectsStore } from "@/features/projects";
import { useTasksStore } from "@/features/tasks";
import { beforeEach, describe, expect, it } from "vitest";
import {
  selectMonthSummary,
  selectProjectTotalInMonth,
  selectTaskRowsForMonth,
} from "./selectors";

const JULY = 6;
const PROJECT_COUNT = 10;
const TASK_COUNT = 100;
const ENTRY_COUNT = 1000;

function seedLargeDataset() {
  const projects = Array.from({ length: PROJECT_COUNT }, (_, i) => ({
    id: `project-${i}`,
    name: `Proyecto ${i}`,
    createdAt: new Date(2026, JULY, 1).toISOString(),
  }));

  const tasks = Array.from({ length: TASK_COUNT }, (_, i) => ({
    id: `task-${i}`,
    projectId: `project-${i % PROJECT_COUNT}`,
    name: `Tarea ${i}`,
    createdAt: new Date(2026, JULY, 1).toISOString(),
  }));

  const timeEntries = Array.from({ length: ENTRY_COUNT }, (_, i) => {
    const day = 1 + (i % 28);
    const startedAt = new Date(2026, JULY, day, 9);
    const endedAt = new Date(2026, JULY, day, 10);
    return {
      id: `entry-${i}`,
      taskId: `task-${i % TASK_COUNT}`,
      startedAt: startedAt.toISOString(),
      endedAt: endedAt.toISOString(),
      durationMs: 60 * 60 * 1000,
      source: "timer" as const,
    };
  });

  useProjectsStore.setState({ projects });
  useTasksStore.setState({ tasks, timeEntries, activeTimer: null });
}

describe("time-history selectors — rendimiento (RP-003)", () => {
  beforeEach(() => {
    seedLargeDataset();
  });

  it("agrega 1000 Registros de Tiempo (filas por Tarea, totales por Proyecto y resumen) en menos de 2 segundos", () => {
    const start = performance.now();

    const rows = selectTaskRowsForMonth(2026, JULY);
    for (let i = 0; i < PROJECT_COUNT; i += 1) {
      selectProjectTotalInMonth(`project-${i}`, 2026, JULY);
    }
    const summary = selectMonthSummary(2026, JULY);

    const elapsedMs = performance.now() - start;

    expect(rows).toHaveLength(TASK_COUNT);
    expect(summary.recordCount).toBe(ENTRY_COUNT);
    expect(elapsedMs).toBeLessThan(2000);
  });
});
