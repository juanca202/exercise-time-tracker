"use client";

import { useState } from "react";
import { Button } from "@base-ui/react/button";
import { useProjectStore } from "@/features/project-management";
import { formatDuration } from "@/shared/lib/format-duration";
import { useHydratePersistedStore } from "@/shared/lib/use-hydrate-persisted-store";
import { StatCard } from "@/shared/ui/stat-card";
import { TopActionBar } from "@/shared/ui/top-action-bar";
import { useTaskTimeTrackingStore } from "../model/task-time-tracking-store";
import { useWeeklyMonthlyTotals } from "../model/use-weekly-monthly-totals";
import { CurrentActivityCard } from "./current-activity-card";
import { ManualEntryForm } from "./manual-entry-form";
import { NewTaskDialog } from "./new-task-dialog";
import { TaskRow } from "./task-row";

export function TasksPanel() {
  useHydratePersistedStore(useTaskTimeTrackingStore);
  useHydratePersistedStore(useProjectStore);

  const [dialogOpen, setDialogOpen] = useState(false);
  const tasks = useTaskTimeTrackingStore((state) => state.tasks);
  const activeTimer = useTaskTimeTrackingStore((state) => state.activeTimer);
  const stopTimer = useTaskTimeTrackingStore((state) => state.stopTimer);
  const { weeklySeconds, monthlySeconds } = useWeeklyMonthlyTotals();

  const activeTask = activeTimer
    ? tasks.find((task) => task.id === activeTimer.taskId)
    : undefined;
  const otherTasks = tasks.filter((task) => task.id !== activeTimer?.taskId);

  return (
    <>
      <TopActionBar>
        <Button
          onClick={() => setDialogOpen(true)}
          className="rounded-sm bg-ink px-4 py-2 text-sm font-bold text-white"
        >
          Nueva Tarea
        </Button>
      </TopActionBar>
      <section className="flex w-full max-w-[1280px] flex-col gap-10 p-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-[32px] font-semibold text-ink">Tareas</h2>
          <div className="flex gap-4">
            <StatCard
              label="Total Semanal"
              value={formatDuration(weeklySeconds)}
            />
            <StatCard
              label="Total Mensual"
              value={formatDuration(monthlySeconds)}
            />
          </div>
        </div>

        {activeTask && activeTimer ? (
          <CurrentActivityCard
            task={activeTask}
            startedAt={activeTimer.startedAt}
            onStop={stopTimer}
          />
        ) : null}

        <div className="border border-border bg-surface shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between border-b border-border bg-page px-6 py-5">
            <h3 className="text-base font-bold text-ink">Tareas</h3>
          </div>
          {otherTasks.length === 0 ? (
            <p className="p-6 text-sm text-ink-muted">
              Todavía no hay Tareas creadas.
            </p>
          ) : (
            <ul>
              {otherTasks.map((task, index) => (
                <TaskRow key={task.id} task={task} index={index} />
              ))}
            </ul>
          )}
        </div>

        <ManualEntryForm />
      </section>
      <NewTaskDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
