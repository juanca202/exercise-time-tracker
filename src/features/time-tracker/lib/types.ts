export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  name: string;
  createdAt: string;
}

export type TimeEntrySource = "timer" | "manual";

export interface TimeEntry {
  id: string;
  taskId: string;
  date: string;
  startedAt: string;
  endedAt: string;
  durationMs: number;
  source: TimeEntrySource;
  createdAt: string;
}

export interface ActiveTimer {
  taskId: string;
  startedAt: string;
}

export interface SelectedPeriod {
  year: number;
  month: number;
}

export type ModalId = "newProject" | "newTask";

export interface TimeTrackerState {
  projects: Project[];
  tasks: Task[];
  timeEntries: TimeEntry[];
  activeTimer: ActiveTimer | null;
  selectedPeriod: SelectedPeriod;
  modals: Record<ModalId, boolean>;
}

export type StoreErrorCode =
  | "NAME_REQUIRED"
  | "NO_PROJECTS"
  | "INVALID_DURATION"
  | "INTERVAL_TOO_SHORT"
  | "TASK_NOT_FOUND"
  | "PROJECT_NOT_FOUND";

export type StoreResult =
  | { ok: true; taskId?: string }
  | { ok: false; code: StoreErrorCode; message: string };

export interface RecentTaskRow {
  taskId: string;
  taskName: string;
  projectId: string;
  projectName: string;
  lastEntryDurationMs: number;
  lastEntryAt: string;
}

export interface HistoryRow {
  entryId: string;
  date: string;
  projectName: string;
  taskName: string;
  durationMs: number;
}

export interface HistorySummary {
  count: number;
  projectCount: number;
  totalMs: number;
}

export interface ProjectSummary {
  projectId: string;
  name: string;
  totalMs: number;
}
