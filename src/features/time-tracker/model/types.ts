export type Project = {
  id: string;
  name: string;
  description?: string;
  createdAt: string; // ISO
};

export type Task = {
  id: string;
  projectId: string;
  name: string;
  createdAt: string; // ISO
};

export type TimeEntry = {
  id: string;
  taskId: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // ISO, only set for timer-originated entries
  endTime?: string; // ISO, only set for timer-originated entries
  durationSeconds: number; // captured at creation, never recomputed
  source: "timer" | "manual";
  createdAt: string; // ISO, used to order "recent" entries
};

export type ActiveTimer = {
  taskId: string;
  startedAt: string; // ISO
} | null;
