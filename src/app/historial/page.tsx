"use client";

import { useState } from "react";
import { useProjectStore } from "@/shared/store/use-project-store";
import { useTaskStore } from "@/shared/store/use-task-store";
import { useTimeEntryStore } from "@/shared/store/use-time-entry-store";
import { formatMonthLabel } from "@/features/reports/format-date";
import { HistoryTable } from "@/features/reports/components/history-table";
import { FeaturedProjectCards } from "@/features/reports/components/featured-project-cards";
import { topProjectsForPeriod } from "@/features/reports/top-projects-for-period";

function nextMonth(year: number, month: number, delta: number) {
  const zeroBased = month - 1 + delta;
  const newYear = year + Math.floor(zeroBased / 12);
  const newMonth = ((zeroBased % 12) + 12) % 12;
  return { year: newYear, month: newMonth + 1 };
}

export default function HistoryPage() {
  const projects = useProjectStore((state) => state.projects);
  const tasks = useTaskStore((state) => state.tasks);
  const timeEntries = useTimeEntryStore((state) => state.timeEntries);
  const [period, setPeriod] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  });

  const prefix = `${period.year}-${period.month.toString().padStart(2, "0")}`;
  const entriesInPeriod = timeEntries.filter((entry) =>
    entry.date.startsWith(prefix),
  );
  const featuredProjects = topProjectsForPeriod(
    entriesInPeriod,
    tasks,
    projects,
  );

  return (
    <div className="flex h-full min-h-0 flex-col gap-6 p-10">
      <div className="flex shrink-0 items-end justify-between">
        <h1 className="text-3xl font-semibold text-primary">
          Historial de Tiempo
        </h1>
        <div className="flex items-center gap-4 rounded-lg border border-outline-variant bg-white p-1 shadow-sm">
          <button
            type="button"
            aria-label="Periodo anterior"
            onClick={() => setPeriod(nextMonth(period.year, period.month, -1))}
            className="rounded p-2 text-on-surface-variant hover:bg-surface"
          >
            ‹
          </button>
          <div className="px-2 text-center">
            <p className="font-mono text-xs tracking-wider text-outline uppercase">
              Periodo seleccionado
            </p>
            <p className="text-base font-bold text-primary">
              {formatMonthLabel(period.year, period.month)}
            </p>
          </div>
          <button
            type="button"
            aria-label="Periodo siguiente"
            onClick={() => setPeriod(nextMonth(period.year, period.month, 1))}
            className="rounded p-2 text-on-surface-variant hover:bg-surface"
          >
            ›
          </button>
        </div>
      </div>

      <div className="shrink-0">
        <FeaturedProjectCards items={featuredProjects} />
      </div>

      <HistoryTable
        timeEntries={entriesInPeriod}
        tasks={tasks}
        projects={projects}
      />
    </div>
  );
}
