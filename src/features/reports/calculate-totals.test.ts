import { describe, expect, it } from "vitest";
import type { Task, TimeEntry } from "@/shared/store/entities";
import {
  startOfIsoWeek,
  totalSecondsForMonth,
  totalSecondsForProject,
  totalSecondsForTask,
  totalSecondsForWeek,
} from "./calculate-totals";

function timeEntry(overrides: Partial<TimeEntry>): TimeEntry {
  return {
    id: crypto.randomUUID(),
    taskId: "task-1",
    source: "manual",
    date: "2026-07-30",
    durationSeconds: 3600,
    ...overrides,
  };
}

function task(overrides: Partial<Task>): Task {
  return {
    id: crypto.randomUUID(),
    projectId: "project-1",
    name: "Tarea",
    ...overrides,
  };
}

describe("totalSecondsForTask", () => {
  it("suma los Registros de Tiempo de la Tarea indicada", () => {
    const entries = [
      timeEntry({ taskId: "task-1", durationSeconds: 100 }),
      timeEntry({ taskId: "task-1", durationSeconds: 200 }),
      timeEntry({ taskId: "task-2", durationSeconds: 900 }),
    ];

    expect(totalSecondsForTask(entries, "task-1")).toBe(300);
  });

  it("devuelve 0 cuando la Tarea no tiene Registros de Tiempo", () => {
    expect(totalSecondsForTask([], "task-1")).toBe(0);
  });
});

describe("totalSecondsForProject", () => {
  it("suma los totales de todas las Tareas del Proyecto", () => {
    const tasks = [
      task({ id: "task-1", projectId: "project-1" }),
      task({ id: "task-2", projectId: "project-1" }),
      task({ id: "task-3", projectId: "project-2" }),
    ];
    const entries = [
      timeEntry({ taskId: "task-1", durationSeconds: 100 }),
      timeEntry({ taskId: "task-2", durationSeconds: 50 }),
      timeEntry({ taskId: "task-3", durationSeconds: 900 }),
    ];

    expect(totalSecondsForProject(entries, tasks, "project-1")).toBe(150);
  });

  it("devuelve 0 cuando el Proyecto no tiene Tareas", () => {
    expect(totalSecondsForProject([], [], "project-1")).toBe(0);
  });
});

describe("totalSecondsForMonth", () => {
  it("suma los Registros de Tiempo cuya fecha cae en el mes indicado", () => {
    const entries = [
      timeEntry({ date: "2026-07-05", durationSeconds: 100 }),
      timeEntry({ date: "2026-07-31", durationSeconds: 200 }),
      timeEntry({ date: "2026-08-01", durationSeconds: 900 }),
    ];

    expect(totalSecondsForMonth(entries, 2026, 7)).toBe(300);
  });

  it("devuelve 0 cuando no hay Registros de Tiempo en el mes seleccionado", () => {
    const entries = [timeEntry({ date: "2026-08-01", durationSeconds: 900 })];

    expect(totalSecondsForMonth(entries, 2026, 7)).toBe(0);
  });
});

describe("startOfIsoWeek", () => {
  it("devuelve el lunes de la semana para un jueves", () => {
    const thursday = new Date(2026, 6, 30);
    const monday = startOfIsoWeek(thursday);

    expect(monday.getFullYear()).toBe(2026);
    expect(monday.getMonth()).toBe(6);
    expect(monday.getDate()).toBe(27);
  });

  it("devuelve el mismo día para un lunes", () => {
    const monday = new Date(2026, 6, 27);

    expect(startOfIsoWeek(monday).getDate()).toBe(27);
  });

  it("retrocede 6 días para un domingo", () => {
    const sunday = new Date(2026, 7, 2);
    const monday = startOfIsoWeek(sunday);

    expect(monday.getMonth()).toBe(6);
    expect(monday.getDate()).toBe(27);
  });
});

describe("totalSecondsForWeek", () => {
  it("suma solo los Registros de Tiempo dentro de la semana lunes-domingo", () => {
    const thursday = new Date(2026, 6, 30);
    const entries = [
      timeEntry({ date: "2026-07-27", durationSeconds: 100 }),
      timeEntry({ date: "2026-08-02", durationSeconds: 50 }),
      timeEntry({ date: "2026-07-26", durationSeconds: 900 }),
      timeEntry({ date: "2026-08-03", durationSeconds: 900 }),
    ];

    expect(totalSecondsForWeek(entries, thursday)).toBe(150);
  });
});
