"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useTimeTrackerStore } from "../store/time-tracker-store";

type Step = "form" | "start-prompt";

interface CreatedTask {
  id: string;
  name: string;
}

export function NewTaskModal() {
  const open = useTimeTrackerStore((s) => s.modals.newTask);
  const projects = useTimeTrackerStore((s) => s.projects);
  const closeModal = useTimeTrackerStore((s) => s.closeModal);
  const createTask = useTimeTrackerStore((s) => s.createTask);
  const startTimer = useTimeTrackerStore((s) => s.startTimer);

  const [step, setStep] = useState<Step>("form");
  const [createdTask, setCreatedTask] = useState<CreatedTask | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setStep("form");
    setCreatedTask(null);
    setError(null);
    setName("");
    setProjectId(null);
  };

  const handleClose = () => {
    resetForm();
    closeModal("newTask");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!projectId) {
      setError("Selecciona un proyecto");
      return;
    }

    const result = createTask({ projectId, name });
    if (!result.ok) {
      setError(result.message);
      return;
    }

    if (result.taskId) {
      setCreatedTask({
        id: result.taskId,
        name: name.trim(),
      });
      setStep("start-prompt");
      setError(null);
      setName("");
      setProjectId(null);
    }
  };

  const handleStartTimer = () => {
    if (createdTask) {
      startTimer({ taskId: createdTask.id });
    }
    handleClose();
  };

  const handleSkipTimer = () => {
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !next && handleClose()}
      title={step === "form" ? "Nueva Tarea" : "¿Iniciar temporizador?"}
    >
      {step === "form" ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Select
            label="Proyecto"
            value={projectId}
            onValueChange={setProjectId}
            placeholder="Selecciona un proyecto"
            options={projects.map((p) => ({ value: p.id, label: p.name }))}
            disabled={projects.length === 0}
          />
          <Input
            label="Nombre"
            name="taskName"
            placeholder="¿En qué estás trabajando?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {projects.length === 0 ? (
            <p className="text-sm text-on-surface-variant">
              Crea un proyecto antes de añadir tareas.
            </p>
          ) : null}
          {error ? (
            <p className="text-sm text-error" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={projects.length === 0}>
              Crear Tarea
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-on-surface">
            La tarea <span className="font-semibold">{createdTask?.name}</span>{" "}
            se creó correctamente. ¿Quieres iniciar el temporizador ahora?
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={handleSkipTimer}>
              No, gracias
            </Button>
            <Button type="button" onClick={handleStartTimer}>
              Sí, iniciar
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
