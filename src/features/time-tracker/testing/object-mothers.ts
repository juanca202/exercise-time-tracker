import type {
  Project,
  SelectedPeriod,
  Task,
  TimeEntry,
  TimeTrackerState,
} from "../lib/types";

export function createProjectMother(overrides: Partial<Project> = {}): Project {
  return {
    id: "project-1",
    name: "Proyecto Demo",
    description: "Descripción de prueba",
    createdAt: "2026-06-01T10:00:00.000Z",
    ...overrides,
  };
}

export function createTaskMother(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    projectId: "project-1",
    name: "Tarea Demo",
    createdAt: "2026-06-01T10:00:00.000Z",
    ...overrides,
  };
}

export function createTimeEntryMother(
  overrides: Partial<TimeEntry> = {},
): TimeEntry {
  return {
    id: "entry-1",
    taskId: "task-1",
    date: "2026-06-01",
    startedAt: "2026-06-01T09:00:00.000Z",
    endedAt: "2026-06-01T11:00:00.000Z",
    durationMs: 2 * 60 * 60 * 1000,
    source: "manual",
    createdAt: "2026-06-01T11:00:00.000Z",
    ...overrides,
  };
}

export function createSelectedPeriodMother(
  overrides: Partial<SelectedPeriod> = {},
): SelectedPeriod {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    ...overrides,
  };
}

export function createEmptyStateMother(
  overrides: Partial<TimeTrackerState> = {},
): TimeTrackerState {
  return {
    projects: [],
    tasks: [],
    timeEntries: [],
    activeTimer: null,
    selectedPeriod: createSelectedPeriodMother(),
    modals: { newProject: false, newTask: false },
    ...overrides,
  };
}
