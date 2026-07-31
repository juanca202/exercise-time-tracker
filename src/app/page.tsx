"use client";

import { useState } from "react";
import { useProjectStore } from "@/shared/store/use-project-store";
import { useTaskActions } from "@/features/tasks/use-task-actions";
import { TaskForm } from "@/features/tasks/components/task-form";
import { RecentTasksList } from "@/features/tasks/components/recent-tasks-list";
import { useTimerStore } from "@/features/timer/use-timer-store";
import { CurrentActivityCard } from "@/features/timer/components/current-activity-card";
import { useManualTimeEntryActions } from "@/features/manual-time-entry/use-manual-time-entry-actions";
import { ManualEntryForm } from "@/features/manual-time-entry/components/manual-entry-form";
import { useTimeEntryStore } from "@/shared/store/use-time-entry-store";
import {
  totalSecondsForMonth,
  totalSecondsForWeek,
} from "@/features/reports/calculate-totals";
import { calculateWeeklyGoalPercentage } from "@/features/reports/weekly-goal";
import { TasksSummaryHeader } from "@/features/reports/components/tasks-summary-header";
import { PageActionBar } from "@/shared/layout/page-action-bar";
import type { Task } from "@/shared/store/entities";

type FormState = { mode: "create" } | { mode: "edit"; task: Task };

export default function TasksPage() {
  const projects = useProjectStore((state) => state.projects);
  const { tasks, createTask, updateTask, deleteTask } = useTaskActions();
  const { createManualTimeEntry } = useManualTimeEntryActions();
  const timeEntries = useTimeEntryStore((state) => state.timeEntries);
  const activeTimer = useTimerStore((state) => state.activeTimer);
  const startTimer = useTimerStore((state) => state.start);
  const stopTimer = useTimerStore((state) => state.stop);

  const [formState, setFormState] = useState<FormState | null>(null);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);

  const now = new Date();
  const totalSecondsThisWeek = totalSecondsForWeek(timeEntries, now);
  const totalSecondsThisMonth = totalSecondsForMonth(
    timeEntries,
    now.getFullYear(),
    now.getMonth() + 1,
  );
  const weeklyGoalPercentage =
    calculateWeeklyGoalPercentage(totalSecondsThisWeek);

  const activeTask = activeTimer
    ? tasks.find((task) => task.id === activeTimer.taskId)
    : undefined;
  const activeProject = activeTask
    ? projects.find((project) => project.id === activeTask.projectId)
    : undefined;

  function handleFormSubmit(values: { projectId: string; name: string }) {
    if (formState?.mode === "edit") {
      const result = updateTask(formState.task.id, values);
      if (!result.updated) {
        return;
      }
    } else {
      createTask(values);
    }
    setFormState(null);
  }

  function handleDeleteTask(task: Task) {
    const result = deleteTask(task.id);
    if (!result.deleted) {
      setBlockedMessage(
        `No se puede eliminar "${task.name}" porque tiene ${result.blockedByTimeEntryCount} Registro(s) de Tiempo asociado(s).`,
      );
    } else {
      setBlockedMessage(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageActionBar>
        <button
          type="button"
          onClick={() => setFormState({ mode: "create" })}
          className="rounded-sm bg-primary px-4 py-2 text-base font-bold text-white"
        >
          Nueva Tarea
        </button>
      </PageActionBar>

      <div className="flex flex-col gap-6 p-10 pt-0">
        <TasksSummaryHeader
          weeklyGoalPercentage={weeklyGoalPercentage}
          totalSecondsThisWeek={totalSecondsThisWeek}
          totalSecondsThisMonth={totalSecondsThisMonth}
        />

        {blockedMessage && (
          <div className="rounded border border-error-container bg-error-container px-4 py-3 text-sm text-on-error-container">
            {blockedMessage}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-full lg:col-span-2">
            <CurrentActivityCard
              activeTimer={activeTimer}
              task={activeTask}
              project={activeProject}
              onStop={stopTimer}
            />
          </div>
          <ManualEntryForm
            projects={projects}
            tasks={tasks}
            onSubmit={createManualTimeEntry}
          />
        </div>

        <RecentTasksList
          tasks={tasks}
          projects={projects}
          activeTaskId={activeTimer?.taskId}
          onPlay={startTimer}
          onEdit={(task) => setFormState({ mode: "edit", task })}
          onDelete={handleDeleteTask}
        />
      </div>

      <TaskForm
        key={
          formState === null
            ? "closed"
            : formState.mode === "edit"
              ? formState.task.id
              : "create"
        }
        open={formState !== null}
        onOpenChange={(open) => {
          if (!open) {
            setFormState(null);
          }
        }}
        projects={projects}
        initialValues={
          formState?.mode === "edit"
            ? { projectId: formState.task.projectId, name: formState.task.name }
            : undefined
        }
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
