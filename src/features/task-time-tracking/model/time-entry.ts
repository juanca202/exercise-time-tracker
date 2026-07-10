export type TimeEntrySource = "timer" | "manual";

export interface TimeEntry {
  id: string;
  taskId: string;
  startedAt: number;
  endedAt: number;
  durationSeconds: number;
  source: TimeEntrySource;
}

export interface CreateManualTimeEntryInput {
  taskId: string;
  date: string;
  durationMinutes: number;
}
