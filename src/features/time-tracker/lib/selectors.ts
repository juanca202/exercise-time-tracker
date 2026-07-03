import type { Project, Task, TimeEntry } from "../model/types";
import { isDateInPeriod, type Period } from "./period";

export function getTaskTotalSeconds(
  timeEntries: Record<string, TimeEntry>,
  taskId: string,
): number {
  return Object.values(timeEntries)
    .filter((entry) => entry.taskId === taskId)
    .reduce((total, entry) => total + entry.durationSeconds, 0);
}

export function getProjectTotalSeconds(
  timeEntries: Record<string, TimeEntry>,
  tasks: Record<string, Task>,
  projectId: string,
): number {
  const taskIds = new Set(
    Object.values(tasks)
      .filter((task) => task.projectId === projectId)
      .map((task) => task.id),
  );
  return Object.values(timeEntries)
    .filter((entry) => taskIds.has(entry.taskId))
    .reduce((total, entry) => total + entry.durationSeconds, 0);
}

export function getEntriesForPeriod(
  timeEntries: Record<string, TimeEntry>,
  period: Period,
): TimeEntry[] {
  return Object.values(timeEntries)
    .filter((entry) => isDateInPeriod(entry.date, period))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getProjectTotalsForPeriod(
  timeEntries: Record<string, TimeEntry>,
  tasks: Record<string, Task>,
  projects: Record<string, Project>,
  period: Period,
): Array<{ project: Project; totalSeconds: number }> {
  const totalsByProject = new Map<string, number>();
  for (const entry of getEntriesForPeriod(timeEntries, period)) {
    const task = tasks[entry.taskId];
    if (!task) {
      continue;
    }
    totalsByProject.set(
      task.projectId,
      (totalsByProject.get(task.projectId) ?? 0) + entry.durationSeconds,
    );
  }
  return Array.from(totalsByProject.entries())
    .map(([projectId, totalSeconds]) => ({
      project: projects[projectId],
      totalSeconds,
    }))
    .filter((item): item is { project: Project; totalSeconds: number } =>
      Boolean(item.project),
    );
}

export function getRecentEntries(
  timeEntries: Record<string, TimeEntry>,
  limit: number,
): TimeEntry[] {
  return Object.values(timeEntries)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}
