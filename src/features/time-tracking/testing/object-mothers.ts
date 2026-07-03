import type { ActiveTimer, Project, Task, TimeEntry } from "../types/domain";

/** Construye un Proyecto válido con overrides opcionales. */
export function aProject(overrides: Partial<Project> = {}): Project {
  return {
    id: "project-1",
    name: "Proyecto de prueba",
    description: "Descripción de prueba",
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

/** Construye una Tarea válida con overrides opcionales. */
export function aTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    projectId: "project-1",
    name: "Tarea de prueba",
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

/** Construye un Registro de Tiempo válido con overrides opcionales. */
export function aTimeEntry(overrides: Partial<TimeEntry> = {}): TimeEntry {
  return {
    id: "entry-1",
    taskId: "task-1",
    date: "2026-01-01",
    durationSeconds: 3600,
    source: "manual",
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

/** Construye un temporizador activo válido con overrides opcionales. */
export function anActiveTimer(
  overrides: Partial<ActiveTimer> = {},
): ActiveTimer {
  return {
    taskId: "task-1",
    startedAt: "2026-01-01T09:00:00.000Z",
    ...overrides,
  };
}
