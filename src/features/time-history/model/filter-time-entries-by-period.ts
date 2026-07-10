import type { TimeEntry } from "@/features/task-time-tracking";
import { isTimestampInPeriod, type Period } from "./period";

export function filterTimeEntriesByPeriod(
  entries: TimeEntry[],
  period: Period,
): TimeEntry[] {
  return entries.filter((entry) =>
    isTimestampInPeriod(entry.startedAt, period),
  );
}
