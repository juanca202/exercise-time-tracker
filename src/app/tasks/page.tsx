"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { NewTaskModal } from "@/features/time-tracking/components/new-task-modal";

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
      {/* El card de temporizador (US-002) y el panel de entrada manual +
          tareas recientes (US-003) se añaden aquí. */}
      <NewTaskModal open={isModalOpen} onOpenChange={setModalOpen} />
    </section>
  );
}
