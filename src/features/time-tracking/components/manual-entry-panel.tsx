"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { Field } from "@/components/field";
import { SelectField } from "@/components/select-field";
import { parseDurationInput } from "../lib/duration-input";
import { useTimeTrackingStore } from "../store/time-tracking-store";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Panel "Entrada Manual": crea un Registro de Tiempo manual para una Tarea
 * indicando Fecha, Tarea y Duración (formato `HH:MM`).
 */
export function ManualEntryPanel() {
  const projects = useTimeTrackingStore((state) => state.projects);
  const tasks = useTimeTrackingStore((state) => state.tasks);
  const createManualTimeEntry = useTimeTrackingStore(
    (state) => state.createManualTimeEntry,
  );

  const [date, setDate] = useState(today());
  const [taskId, setTaskId] = useState<string | null>(null);
  const [durationInput, setDurationInput] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  const groups = [
    {
      options: tasks.map((task) => {
        const project = projects.find((p) => p.id === task.projectId);
        return {
          value: task.id,
          label: project ? `${project.name} — ${task.name}` : task.name,
        };
      }),
    },
  ];

  function handleSubmit() {
    if (!taskId) {
      setError("Debes seleccionar una Tarea.");
      return;
    }

    const durationSeconds = parseDurationInput(durationInput);
    if (durationSeconds === null) {
      setError("Ingresa una duración válida mayor a cero (formato HH:MM).");
      return;
    }

    createManualTimeEntry({ taskId, date, durationSeconds });
    setDurationInput("");
    setError(undefined);
  }

  return (
    <div className="flex flex-col gap-4 rounded-(--radius-container) border border-border bg-surface-elevated p-6">
      <h2 className="font-semibold text-foreground">Entrada Manual</h2>
      <Field
        label="Fecha"
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
      />
      <SelectField
        label="Proyecto / Tarea"
        placeholder={
          tasks.length === 0 ? "Crea una tarea primero" : "Selecciona una tarea"
        }
        value={taskId}
        onValueChange={(value) => {
          setTaskId(value);
          if (error) setError(undefined);
        }}
        groups={groups}
        disabled={tasks.length === 0}
      />
      <Field
        label="Duración"
        placeholder="02:30"
        value={durationInput}
        onValueChange={(value) => {
          setDurationInput(value);
          if (error) setError(undefined);
        }}
        error={error}
      />
      <Button variant="primary" onClick={handleSubmit}>
        Guardar Registro
      </Button>
    </div>
  );
}
