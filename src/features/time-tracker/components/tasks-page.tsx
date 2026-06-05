"use client";

import { Button } from "@/components/ui/button";
import { ActiveTimerPanel } from "./active-timer-panel";
import { ManualEntryPanel } from "./manual-entry-panel";
import { NewTaskModal } from "./new-task-modal";
import { RecentTasksList } from "./recent-tasks-list";
import { formatDurationHoursMinutes } from "../lib/duration";
import { useTrackerDerivedState } from "../store/use-derived-state";
import { useTimeTrackerStore } from "../store/time-tracker-store";
import { PlusIcon, iconClassName } from "./icons";

export function TasksPage() {
  const openModal = useTimeTrackerStore((s) => s.openModal);
  const { weeklyTotalMs, monthlyTotalMs, weeklyGoalPercent } =
    useTrackerDerivedState();

  return (
    <div className="flex flex-col gap-8">
      <Button
        variant="primary"
        className="w-fit"
        onClick={() => openModal("newTask")}
      >
        <PlusIcon className={iconClassName("sm")} aria-hidden="true" />
        Nueva Tarea
      </Button>

      <header className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-headline-lg-mobile md:text-headline-lg tracking-tight text-primary">
            Tareas
          </h1>
          <p className="text-body-md text-on-surface-variant">
            Has alcanzado el{" "}
            <span className="font-semibold text-accent">
              {weeklyGoalPercent}%
            </span>{" "}
            de tu meta semanal
          </p>
        </div>

        <div className="flex shrink-0 gap-3">
          <article className="min-w-36 rounded-lg border border-card-border bg-surface-container-lowest px-5 py-4 shadow-elevation-1">
            <p className="text-label-mono uppercase text-on-surface-variant">
              Total Semanal
            </p>
            <p className="mt-2 text-xl font-semibold text-primary">
              {formatDurationHoursMinutes(weeklyTotalMs)}
            </p>
          </article>
          <article className="min-w-36 rounded-lg border border-card-border bg-surface-container-lowest px-5 py-4 shadow-elevation-1">
            <p className="text-label-mono uppercase text-on-surface-variant">
              Total Mensual
            </p>
            <p className="mt-2 text-xl font-semibold text-primary">
              {formatDurationHoursMinutes(monthlyTotalMs)}
            </p>
          </article>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
        <ActiveTimerPanel />
        <ManualEntryPanel />
      </div>

      <RecentTasksList />
      <NewTaskModal />
    </div>
  );
}
