"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { ManualEntryPanel } from "@/features/time-tracking/components/manual-entry-panel";
import { NewTaskModal } from "@/features/time-tracking/components/new-task-modal";
import { RecentEntriesList } from "@/features/time-tracking/components/recent-entries-list";
import { TimerCard } from "@/features/time-tracking/components/timer-card";

export default function TasksPage() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Tareas</h1>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          Nueva Tarea
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <TimerCard />
        <ManualEntryPanel />
      </div>
      <div className="mt-6">
        <RecentEntriesList />
      </div>
      <NewTaskModal open={isModalOpen} onOpenChange={setModalOpen} />
    </section>
  );
}
