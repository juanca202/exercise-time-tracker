"use client";

import { useState, type FormEvent } from "react";
import type { Project, Task } from "@/shared/store/entities";
import { parseDurationInput } from "../parse-duration";

interface ManualEntryFormProps {
  projects: Project[];
  tasks: Task[];
  onSubmit: (values: {
    taskId: string;
    date: string;
    durationSeconds: number;
  }) => { created: boolean; error?: "duration-not-positive" | "future-date" };
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

const ERROR_MESSAGES = {
  "duration-not-positive": "La duración debe ser mayor a 0.",
  "future-date": "La fecha no puede ser futura.",
};

/** Panel "Entrada Manual" (fiel al diseño de Figma, nodo 1:1413). */
export function ManualEntryForm({
  projects,
  tasks,
  onSubmit,
}: ManualEntryFormProps) {
  const [date, setDate] = useState(todayIsoDate());
  const [taskId, setTaskId] = useState("");
  const [duration, setDuration] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const durationSeconds = parseDurationInput(duration);
    if (durationSeconds === null) {
      setError("Ingresa la duración en formato HH:MM.");
      return;
    }

    const result = onSubmit({ taskId, date, durationSeconds });
    if (!result.created && result.error) {
      setError(ERROR_MESSAGES[result.error]);
      return;
    }

    setError(null);
    setDuration("");
  }

  return (
    <div className="flex flex-col gap-5 rounded-sm border border-outline-variant bg-white p-6 shadow-[0_4px_6px_rgba(0,0,0,0.04)]">
      <h3 className="text-2xl font-semibold text-primary">Entrada Manual</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="manual-entry-date"
            className="font-mono text-xs tracking-wider text-on-surface-variant uppercase opacity-50"
          >
            Fecha
          </label>
          <input
            id="manual-entry-date"
            type="date"
            required
            max={todayIsoDate()}
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="rounded border border-outline-variant p-3.5 text-sm text-on-surface"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="manual-entry-task"
            className="font-mono text-xs tracking-wider text-on-surface-variant uppercase opacity-50"
          >
            Proyecto / Tarea
          </label>
          <select
            id="manual-entry-task"
            required
            value={taskId}
            onChange={(event) => setTaskId(event.target.value)}
            className="rounded border border-outline-variant p-3.5 text-sm text-on-surface"
          >
            <option value="" disabled>
              Selecciona una tarea
            </option>
            {projects.map((project) => {
              const projectTasks = tasks.filter(
                (task) => task.projectId === project.id,
              );
              if (projectTasks.length === 0) {
                return null;
              }
              return (
                <optgroup key={project.id} label={project.name}>
                  {projectTasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.name}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="manual-entry-duration"
            className="font-mono text-xs tracking-wider text-on-surface-variant uppercase opacity-50"
          >
            Duración
          </label>
          <input
            id="manual-entry-duration"
            required
            placeholder="02:30"
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
            className="rounded border border-outline-variant p-3.5 text-sm text-on-surface"
          />
        </div>
        {error && <p className="text-sm text-error">{error}</p>}
        <button
          type="submit"
          className="rounded-lg bg-primary py-4 text-base font-bold text-white shadow-md"
        >
          Guardar Registro
        </button>
      </form>
    </div>
  );
}
