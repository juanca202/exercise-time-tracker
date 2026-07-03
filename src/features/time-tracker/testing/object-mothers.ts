import type { Project, Task, TimeEntry } from "../model/types";

export function aProject(overrides: Partial<Project> = {}): Project {
  return {
    id: "project-1",
    name: "Proyecto de Prueba",
    description: undefined,
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

export function aTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    projectId: "project-1",
    name: "Tarea de Prueba",
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

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
