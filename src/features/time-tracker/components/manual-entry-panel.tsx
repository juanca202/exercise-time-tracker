"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { parseDuration } from "../lib/duration";
import { useTimeTrackerStore } from "../store/time-tracker-store";

function todayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function ManualEntryPanel() {
  const projects = useTimeTrackerStore((s) => s.projects);
  const tasks = useTimeTrackerStore((s) => s.tasks);
  const createManualEntry = useTimeTrackerStore((s) => s.createManualEntry);

  const [date, setDate] = useState(todayIsoDate());
  const [taskId, setTaskId] = useState<string | null>(null);
  const [duration, setDuration] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const taskOptions = tasks.map((task) => {
    const project = projects.find((p) => p.id === task.projectId);
    return {
      value: task.id,
      label: project ? `${project.name} / ${task.name}` : task.name,
    };
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSuccess(false);

    if (!taskId) {
      setError("Selecciona una tarea");
      return;
    }

    const durationMs = parseDuration(duration);
    if (durationMs === null || durationMs <= 0) {
      setError("La duración debe ser mayor que cero");
      return;
    }

    const result = createManualEntry({ taskId, date, durationMs });
    if (!result.ok) {
      setError(result.message);
      return;
    }

    setDuration("");
    setError(null);
    setSuccess(true);
  };

  return (
    <section className="flex min-h-80 flex-col rounded-lg border border-card-border bg-surface-container-lowest p-6 shadow-elevation-1">
      <h2 className="text-body-lg font-semibold text-on-surface">
        Entrada Manual
      </h2>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-1 flex-col gap-5">
        <Input
          label="Fecha"
          type="date"
          name="entryDate"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <Select
          label="Proyecto / Tarea"
          value={taskId}
          onValueChange={setTaskId}
          placeholder="Selecciona proyecto y tarea"
          options={taskOptions}
          disabled={tasks.length === 0}
        />

        <Input
          label="Duración"
          name="duration"
          placeholder="02:30"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />

        {tasks.length === 0 ? (
          <p className="text-body-md text-on-surface-variant">
            Crea un proyecto y una tarea antes de registrar tiempo manualmente.
          </p>
        ) : null}

        {error ? (
          <p className="text-body-md text-error" role="alert">
            {error}
          </p>
        ) : null}

        {success ? (
          <p className="text-body-md text-secondary" role="status">
            Registro guardado correctamente.
          </p>
        ) : null}

        <Button
          type="submit"
          className="mt-auto w-full"
          disabled={tasks.length === 0}
        >
          Guardar Registro
        </Button>
      </form>
    </section>
  );
}
