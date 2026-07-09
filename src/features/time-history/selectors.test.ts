import { useProjectsStore } from "@/features/projects";
import { useTasksStore } from "@/features/tasks";
import { beforeEach, describe, expect, it } from "vitest";
import {
  selectEntriesInMonth,
  selectMonthSummary,
  selectProjectTotalInMonth,
  selectTaskRowsForMonth,
} from "./selectors";

const JULY = 6; // month es 0-indexado

function seed() {
  useProjectsStore.setState({
    projects: [
      {
        id: "project-1",
        name: "Proyecto Alfa",
        createdAt: new Date(2026, JULY, 1).toISOString(),
      },
      {
        id: "project-2",
        name: "Proyecto Beta",
        createdAt: new Date(2026, JULY, 1).toISOString(),
      },
    ],
  });

  useTasksStore.setState({
    activeTimer: null,
    tasks: [
      {
        id: "task-1",
        projectId: "project-1",
        name: "Diseñar wireframes",
        createdAt: new Date(2026, JULY, 1).toISOString(),
      },
      {
        id: "task-2",
        projectId: "project-1",
        name: "Revisar backlog",
        createdAt: new Date(2026, JULY, 1).toISOString(),
      },
      {
        id: "task-3",
        projectId: "project-2",
        name: "Documentación",
        createdAt: new Date(2026, JULY, 1).toISOString(),
      },
    ],
    timeEntries: [
      // task-1: dos registros en julio
      {
        id: "e1",
        taskId: "task-1",
        startedAt: new Date(2026, JULY, 5, 9).toISOString(),
        endedAt: new Date(2026, JULY, 5, 10).toISOString(),
        durationMs: 60 * 60 * 1000,
        source: "timer",
      },
      {
        id: "e2",
        taskId: "task-1",
        startedAt: new Date(2026, JULY, 8, 9).toISOString(),
        endedAt: new Date(2026, JULY, 8, 9, 30).toISOString(),
        durationMs: 30 * 60 * 1000,
        source: "timer",
      },
      // task-2: un registro en julio
      {
        id: "e3",
        taskId: "task-2",
        startedAt: new Date(2026, JULY, 6, 9).toISOString(),
        endedAt: new Date(2026, JULY, 6, 9, 45).toISOString(),
        durationMs: 45 * 60 * 1000,
        source: "manual",
      },
      // task-3 (otro proyecto): un registro en junio (mes distinto)
      {
        id: "e4",
        taskId: "task-3",
        startedAt: new Date(2026, JULY - 1, 20).toISOString(),
        endedAt: new Date(2026, JULY - 1, 20, 2).toISOString(),
        durationMs: 2 * 60 * 60 * 1000,
        source: "manual",
      },
    ],
  });
}

describe("time-history selectors", () => {
  beforeEach(() => {
    seed();
  });

  it("selectEntriesInMonth solo retorna Registros del mes indicado", () => {
    expect(selectEntriesInMonth(2026, JULY)).toHaveLength(3);
    expect(selectEntriesInMonth(2026, JULY - 1)).toHaveLength(1);
  });

  it("selectTaskRowsForMonth agrupa por Tarea, suma su Duración y ordena por última actividad", () => {
    const rows = selectTaskRowsForMonth(2026, JULY);

    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({
      taskName: "Diseñar wireframes",
      projectName: "Proyecto Alfa",
      totalMs: 90 * 60 * 1000,
    });
    expect(rows[1]).toMatchObject({
      taskName: "Revisar backlog",
      totalMs: 45 * 60 * 1000,
    });
  });

  it("una Tarea sin Registros en el periodo no aparece en las filas de ese mes", () => {
    const rows = selectTaskRowsForMonth(2026, JULY);

    expect(rows.some((row) => row.taskName === "Documentación")).toBe(false);
  });

  it("selectProjectTotalInMonth suma las Tareas del Proyecto en el periodo (0 sin coincidencias)", () => {
    expect(selectProjectTotalInMonth("project-1", 2026, JULY)).toBe(
      135 * 60 * 1000,
    );
    expect(selectProjectTotalInMonth("project-2", 2026, JULY)).toBe(0);
  });

  it("selectMonthSummary calcula registros, proyectos involucrados y total de horas", () => {
    expect(selectMonthSummary(2026, JULY)).toEqual({
      recordCount: 3,
      projectCount: 1,
      totalMs: 135 * 60 * 1000,
    });
  });

  it("un periodo sin Registros de Tiempo retorna ceros sin errores", () => {
    expect(selectMonthSummary(2026, JULY + 2)).toEqual({
      recordCount: 0,
      projectCount: 0,
      totalMs: 0,
    });
    expect(selectTaskRowsForMonth(2026, JULY + 2)).toEqual([]);
  });
});
