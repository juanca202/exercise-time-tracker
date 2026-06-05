import {
  filterByCurrentMonth,
  filterByCurrentWeek,
  filterByMonth,
  getWeeklyGoalPercent,
  sumDuration,
} from "./aggregations";
import type {
  HistoryRow,
  HistorySummary,
  ProjectSummary,
  RecentTaskRow,
  TimeTrackerState,
} from "./types";

type SelectorState = Pick<
  TimeTrackerState,
  "projects" | "tasks" | "timeEntries" | "selectedPeriod"
>;

export function selectWeeklyTotalMs(state: SelectorState): number {
  return sumDuration(filterByCurrentWeek(state.timeEntries));
}

export function selectMonthlyTotalMs(state: SelectorState): number {
  return sumDuration(filterByCurrentMonth(state.timeEntries));
}

export function selectWeeklyGoalPercent(state: SelectorState): number {
  return getWeeklyGoalPercent(selectWeeklyTotalMs(state));
}

export function selectProjectTotalMs(
  state: SelectorState,
  projectId: string,
): number {
  const taskIds = new Set(
    state.tasks.filter((t) => t.projectId === projectId).map((t) => t.id),
  );
  const periodEntries = filterByMonth(
    state.timeEntries,
    state.selectedPeriod.year,
    state.selectedPeriod.month,
  );
  return sumDuration(periodEntries.filter((e) => taskIds.has(e.taskId)));
}

export function selectHistoryRows(state: SelectorState): HistoryRow[] {
  const taskById = new Map(state.tasks.map((t) => [t.id, t]));
  const projectById = new Map(state.projects.map((p) => [p.id, p]));
  const periodEntries = filterByMonth(
    state.timeEntries,
    state.selectedPeriod.year,
    state.selectedPeriod.month,
  );

  return periodEntries
    .map((entry) => {
      const task = taskById.get(entry.taskId);
      const project = task ? projectById.get(task.projectId) : undefined;
      if (!task || !project) return null;

      return {
        entryId: entry.id,
        date: entry.date,
        projectName: project.name,
        taskName: task.name,
        durationMs: entry.durationMs,
      };
    })
    .filter((row): row is HistoryRow => row !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function selectHistorySummary(state: SelectorState): HistorySummary {
  const rows = selectHistoryRows(state);
  const projectNames = new Set(rows.map((r) => r.projectName));
  const rowIds = new Set(rows.map((r) => r.entryId));

  return {
    count: rows.length,
    projectCount: projectNames.size,
    totalMs: sumDuration(state.timeEntries.filter((e) => rowIds.has(e.id))),
  };
}

export function selectProjectSummaries(state: SelectorState): ProjectSummary[] {
  return state.projects.map((project) => ({
    projectId: project.id,
    name: project.name,
    totalMs: selectProjectTotalMs(state, project.id),
  }));
}

export function selectRecentTasks(
  state: SelectorState,
  limit = 5,
): RecentTaskRow[] {
  const projectById = new Map(state.projects.map((p) => [p.id, p]));
  const taskById = new Map(state.tasks.map((t) => [t.id, t]));

  const latestByTask = new Map<string, (typeof state.timeEntries)[number]>();
  for (const entry of state.timeEntries) {
    const existing = latestByTask.get(entry.taskId);
    if (
      !existing ||
      new Date(entry.endedAt).getTime() > new Date(existing.endedAt).getTime()
    ) {
      latestByTask.set(entry.taskId, entry);
    }
  }

  const rows: RecentTaskRow[] = [];
  for (const [taskId, entry] of latestByTask) {
    const task = taskById.get(taskId);
    if (!task) continue;
    const project = projectById.get(task.projectId);
    if (!project) continue;

    rows.push({
      taskId: task.id,
      taskName: task.name,
      projectId: project.id,
      projectName: project.name,
      lastEntryDurationMs: entry.durationMs,
      lastEntryAt: entry.endedAt,
    });
  }

  return rows
    .sort(
      (a, b) =>
        new Date(b.lastEntryAt).getTime() - new Date(a.lastEntryAt).getTime(),
    )
    .slice(0, limit);
}
