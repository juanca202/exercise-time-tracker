import type { TimeEntry } from "./time-entry";

export function getLatestTimeEntry(
  entries: TimeEntry[],
  taskId: string,
): TimeEntry | undefined {
  return entries
    .filter((entry) => entry.taskId === taskId)
    .sort((a, b) => b.startedAt - a.startedAt)[0];
}
