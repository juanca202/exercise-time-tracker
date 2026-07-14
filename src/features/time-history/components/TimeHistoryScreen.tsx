"use client";

import { useHydrateProjectsStore, useProjectsStore } from "@/features/projects";
import { useHydrateTasksStore, useTasksStore } from "@/features/tasks";
import { AppShell } from "@/components/layout/AppShell";
import { useState } from "react";
import {
  selectMonthSummary,
  selectProjectTotalInMonth,
  selectTaskRowsForMonth,
} from "../selectors";
import { PeriodSelector } from "./PeriodSelector";
import { PeriodSummaryFooter } from "./PeriodSummaryFooter";
import { ProjectSummaryCard } from "./ProjectSummaryCard";
import { TimeHistoryTable } from "./TimeHistoryTable";

function currentPeriod() {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() };
}

/** Pantalla "Historial de registros": Tareas del periodo, resumen por Proyecto y navegación mensual. */
export function TimeHistoryScreen() {
  useHydrateProjectsStore();
  useHydrateTasksStore();
  const projects = useProjectsStore((state) => state.projects);
  // Se suscribe a timeEntries/tasks para que las agregaciones reaccionen a nuevos Registros.
  useTasksStore((state) => state.timeEntries);
  useTasksStore((state) => state.tasks);

  const [selectedMonth, setSelectedMonth] = useState(currentPeriod);

  function goToPreviousMonth() {
    setSelectedMonth(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 },
    );
  }

  function goToNextMonth() {
    setSelectedMonth(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 },
    );
  }

  const rows = selectTaskRowsForMonth(selectedMonth.year, selectedMonth.month);
  const summary = selectMonthSummary(selectedMonth.year, selectedMonth.month);

  return (
    <AppShell activeNav="history">
      <div className="mx-auto max-w-[1280px] p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-3xl font-semibold text-primary">
            Historial de Tiempo
          </h1>
          <PeriodSelector
            year={selectedMonth.year}
            month={selectedMonth.month}
            onPrevious={goToPreviousMonth}
            onNext={goToNextMonth}
          />
        </div>

        {projects.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-6">
            {projects.map((project) => (
              <ProjectSummaryCard
                key={project.id}
                projectName={project.name}
                totalMs={selectProjectTotalInMonth(
                  project.id,
                  selectedMonth.year,
                  selectedMonth.month,
                )}
              />
            ))}
          </div>
        )}

        <div className="mt-6 overflow-hidden rounded-card border border-outline-variant bg-surface-container-lowest shadow-sm">
          <div className="overflow-x-auto">
            <TimeHistoryTable rows={rows} />
          </div>
          <PeriodSummaryFooter summary={summary} />
        </div>
      </div>
    </AppShell>
  );
}
