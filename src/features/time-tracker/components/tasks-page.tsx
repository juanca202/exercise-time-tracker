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
        variant="secondary"
        className="w-fit"
        onClick={() => openModal("newTask")}
      >
        <PlusIcon className={iconClassName("sm")} aria-hidden="true" />
        Nueva Tarea
      </Button>

      <header className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-on-surface">
            Tareas
          </h1>
          <p className="text-sm text-on-surface-variant">
            Has alcanzado el{" "}
            <span className="font-semibold text-on-surface">
              {weeklyGoalPercent}%
            </span>{" "}
            de tu meta semanal
          </p>
        </div>

        <div className="flex shrink-0 gap-3">
          <article className="min-w-36 rounded-lg border border-outline-variant bg-surface-container-lowest px-5 py-4 shadow-sm">
            <p className="font-mono text-[10px] font-medium tracking-widest text-on-surface-variant uppercase">
              Total Semanal
            </p>
            <p className="mt-2 font-mono text-xl font-semibold text-on-surface">
              {formatDurationHoursMinutes(weeklyTotalMs)}
            </p>
          </article>
          <article className="min-w-36 rounded-lg border border-outline-variant bg-surface-container-lowest px-5 py-4 shadow-sm">
            <p className="font-mono text-[10px] font-medium tracking-widest text-on-surface-variant uppercase">
              Total Mensual
            </p>
            <p className="mt-2 font-mono text-xl font-semibold text-on-surface">
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
