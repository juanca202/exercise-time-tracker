"use client";

import { Field } from "@base-ui/react/field";
import { type FormEvent, useState } from "react";
import { parseManualDuration } from "../../lib/duration";
import { useTimeTrackerStore } from "../../store/time-tracker-store";

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function ManualEntryForm() {
  const tasks = useTimeTrackerStore((state) => state.tasks);
  const projects = useTimeTrackerStore((state) => state.projects);
  const addManualEntry = useTimeTrackerStore((state) => state.addManualEntry);

  const [taskId, setTaskId] = useState("");
  const [date, setDate] = useState(todayIsoDate);
  const [duration, setDuration] = useState("");
  const [error, setError] = useState<string | null>(null);

  const taskOptions = Object.values(tasks).map((task) => ({
    id: task.id,
    label: `${projects[task.projectId]?.name ?? "Proyecto"} / ${task.name}`,
  }));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!taskId) {
      setError("Selecciona una tarea.");
      return;
    }
    const durationSeconds = parseManualDuration(duration);
    if (durationSeconds === null) {
      setError("Ingresa una duración válida en formato HH:MM.");
      return;
    }
    try {
      addManualEntry({ taskId, date, durationSeconds });
      setDuration("");
      setError(null);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo guardar el registro.",
      );
    }
  }

  return (
    <section
      aria-label="Entrada Manual"
      className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6"
    >
      <h2 className="text-headline-md font-semibold text-on-surface">
        Entrada Manual
      </h2>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <Field.Root className="flex flex-col gap-2">
          <Field.Label className="text-label-mono uppercase text-on-surface-variant">
            Fecha
          </Field.Label>
          <Field.Control
            type="date"
            value={date}
            onValueChange={setDate}
            className="rounded border border-outline-variant px-3 py-2"
          />
        </Field.Root>
        <Field.Root className="flex flex-col gap-2">
          <Field.Label className="text-label-mono uppercase text-on-surface-variant">
            Proyecto / Tarea
          </Field.Label>
          <Field.Control
            render={<select />}
            value={taskId}
            onValueChange={setTaskId}
            className="rounded border border-outline-variant px-3 py-2"
          >
            <option value="">Selecciona un proyecto/tarea</option>
            {taskOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </Field.Control>
        </Field.Root>
        <Field.Root className="flex flex-col gap-2">
          <Field.Label className="text-label-mono uppercase text-on-surface-variant">
            Duración
          </Field.Label>
          <Field.Control
            value={duration}
            onValueChange={setDuration}
            placeholder="02:30"
            className="rounded border border-outline-variant px-3 py-2 font-mono"
          />
        </Field.Root>
        {error ? (
          <p role="alert" className="text-body-md text-error">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          className="rounded bg-primary px-4 py-2 text-body-lg text-on-primary"
        >
          Guardar Registro
        </button>
      </form>
    </section>
  );
}
