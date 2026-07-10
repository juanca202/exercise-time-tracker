import { useMemo, useState } from "react";
import { useProjectStore } from "@/features/project-management";
import { useTaskTimeTrackingStore } from "@/features/task-time-tracking";
import {
  aggregateTimeHistory,
  type TimeHistoryAggregation,
} from "./aggregate-time-history";
import { filterTimeEntriesByPeriod } from "./filter-time-entries-by-period";
import {
  formatPeriodLabel,
  getCurrentPeriod,
  getNextPeriod,
  getPreviousPeriod,
  type Period,
} from "./period";

export interface UseTimeHistoryResult extends TimeHistoryAggregation {
  period: Period;
  periodLabel: string;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
}

export function useTimeHistory(): UseTimeHistoryResult {
  const [period, setPeriod] = useState<Period>(getCurrentPeriod);
  const timeEntries = useTaskTimeTrackingStore((state) => state.timeEntries);
  const tasks = useTaskTimeTrackingStore((state) => state.tasks);
  const projects = useProjectStore((state) => state.projects);

  const entriesInPeriod = useMemo(
    () => filterTimeEntriesByPeriod(timeEntries, period),
    [timeEntries, period],
  );

  const aggregation = useMemo(
    () => aggregateTimeHistory({ entriesInPeriod, tasks, projects }),
    [entriesInPeriod, tasks, projects],
  );

  return {
    period,
    periodLabel: formatPeriodLabel(period),
    goToPreviousMonth: () => setPeriod((current) => getPreviousPeriod(current)),
    goToNextMonth: () => setPeriod((current) => getNextPeriod(current)),
    ...aggregation,
  };
}
