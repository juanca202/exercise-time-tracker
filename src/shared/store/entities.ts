/** Entidades de dominio compartidas (ver docs/specs/technical-docs/timetracker.md). */

export interface Project {
  id: string;
  name: string;
  description: string;
}

export interface Task {
  id: string;
  projectId: string;
  name: string;
}

export type TimeEntrySource = "timer" | "manual";

export interface TimeEntry {
  id: string;
  taskId: string;
  source: TimeEntrySource;
  date: string;
  durationSeconds: number;
  startTime?: string;
  endTime?: string;
}
