"use client";

import { ManualEntryForm } from "./manual-entry-form/manual-entry-form";
import { NewTaskModal } from "./new-task-modal/new-task-modal";
import { RecentEntriesList } from "./recent-entries-list/recent-entries-list";
import { TimerPanel } from "./timer-panel/timer-panel";

export function TasksView() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-lg font-semibold text-on-surface">
          Tareas
        </h1>
        <NewTaskModal />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <TimerPanel />
        <ManualEntryForm />
      </div>
      <RecentEntriesList />
    </div>
  );
}
