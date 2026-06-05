"use client";

import { useMemo } from "react";
import {
  selectHistoryRows,
  selectHistorySummary,
  selectMonthlyTotalMs,
  selectProjectSummaries,
  selectRecentTasks,
  selectWeeklyGoalPercent,
  selectWeeklyTotalMs,
} from "../lib/selectors";
import { useTimeTrackerStore } from "./time-tracker-store";

export function useTrackerDerivedState() {
  const projects = useTimeTrackerStore((s) => s.projects);
  const tasks = useTimeTrackerStore((s) => s.tasks);
  const timeEntries = useTimeTrackerStore((s) => s.timeEntries);
  const selectedPeriod = useTimeTrackerStore((s) => s.selectedPeriod);

  const slice = useMemo(
    () => ({ projects, tasks, timeEntries, selectedPeriod }),
    [projects, tasks, timeEntries, selectedPeriod],
  );

  const weeklyTotalMs = useMemo(() => selectWeeklyTotalMs(slice), [slice]);
  const monthlyTotalMs = useMemo(() => selectMonthlyTotalMs(slice), [slice]);
  const weeklyGoalPercent = useMemo(
    () => selectWeeklyGoalPercent(slice),
    [slice],
  );
  const recentTasks = useMemo(() => selectRecentTasks(slice, 5), [slice]);
  const historyRows = useMemo(() => selectHistoryRows(slice), [slice]);
  const historySummary = useMemo(() => selectHistorySummary(slice), [slice]);
  const projectSummaries = useMemo(
    () => selectProjectSummaries(slice),
    [slice],
  );

  return {
    slice,
    weeklyTotalMs,
    monthlyTotalMs,
    weeklyGoalPercent,
    recentTasks,
    historyRows,
    historySummary,
    projectSummaries,
  };
}
