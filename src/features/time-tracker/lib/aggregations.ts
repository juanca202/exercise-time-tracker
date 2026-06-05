import type { SelectedPeriod, TimeEntry } from "./types";

export const DAILY_GOAL_HOURS = 8;
export const WEEKLY_GOAL_MS = 40 * 60 * 60 * 1000;

export function filterByMonth(
  entries: TimeEntry[],
  year: number,
  month: number,
): TimeEntry[] {
  return entries.filter((entry) => {
    const [entryYear, entryMonth] = entry.date.split("-").map(Number);
    return entryYear === year && entryMonth === month;
  });
}

export function sumDuration(entries: TimeEntry[]): number {
  return entries.reduce((total, entry) => total + entry.durationMs, 0);
}

export function countWeekdaysInMonth(year: number, month: number): number {
  const daysInMonth = new Date(year, month, 0).getDate();
  let count = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const weekday = new Date(year, month - 1, day).getDay();
    if (weekday >= 1 && weekday <= 5) count++;
  }

  return count;
}

export function getWeeklyGoalPercent(weeklyTotalMs: number): number {
  if (weeklyTotalMs <= 0) return 0;
  return Math.round((weeklyTotalMs / WEEKLY_GOAL_MS) * 100);
}

export function getWeekBounds(now = new Date()): { start: Date; end: Date } {
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const start = new Date(now);
  start.setDate(now.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export function filterByCurrentWeek(
  entries: TimeEntry[],
  now = new Date(),
): TimeEntry[] {
  const { start, end } = getWeekBounds(now);
  return entries.filter((entry) => {
    const ended = new Date(entry.endedAt).getTime();
    return ended >= start.getTime() && ended <= end.getTime();
  });
}

export function filterByCurrentMonth(
  entries: TimeEntry[],
  now = new Date(),
): TimeEntry[] {
  return filterByMonth(entries, now.getFullYear(), now.getMonth() + 1);
}

export function getMonthlyGoalMs(year: number, month: number): number {
  return countWeekdaysInMonth(year, month) * DAILY_GOAL_HOURS * 60 * 60 * 1000;
}

export function shiftPeriod(
  period: SelectedPeriod,
  delta: -1 | 1,
): SelectedPeriod {
  let { year, month } = period;
  month += delta;

  if (month < 1) {
    month = 12;
    year -= 1;
  } else if (month > 12) {
    month = 1;
    year += 1;
  }

  return { year, month };
}

export function formatPeriodLabel(period: SelectedPeriod): string {
  const date = new Date(period.year, period.month - 1, 1);
  const label = date.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}
