"use client";

import { Field } from "@base-ui/react/field";
import { Form } from "@base-ui/react/form";
import { useProjectStore } from "@/features/project-management";
import { useTaskTimeTrackingStore } from "../model/task-time-tracking-store";

function validateDate(value: unknown) {
  return value ? null : "La fecha es obligatoria";
}

function validateTaskId(value: unknown) {
  return value ? null : "Debe seleccionar una Tarea";
}

function validateDuration(value: unknown) {
  return Number(value) > 0 ? null : "La duración debe ser mayor que cero";
}

export function ManualEntryForm() {
  const tasks = useTaskTimeTrackingStore((state) => state.tasks);
  const projects = useProjectStore((state) => state.projects);
  const addManualTimeEntry = useTaskTimeTrackingStore(
    (state) => state.addManualTimeEntry,
  );

  function taskLabel(projectId: string, taskName: string) {
    const projectName = projects.find(
      (project) => project.id === projectId,
    )?.name;
    return projectName ? `${projectName} — ${taskName}` : taskName;
  }

  function handleFormSubmit(values: Record<string, unknown>) {
    addManualTimeEntry({
      date: String(values.date ?? ""),
      taskId: String(values.taskId ?? ""),
      durationMinutes: Number(values.durationMinutes),
    });
  }

  return (
    <section className="flex flex-col gap-6 border border-border bg-surface p-6 shadow-[0_4px_6px_rgba(0,0,0,0.04)]">
      <h3 className="text-2xl font-semibold text-ink">Entrada Manual</h3>
      <Form className="flex flex-col gap-5" onFormSubmit={handleFormSubmit}>
        <Field.Root
          name="date"
          validate={validateDate}
          className="flex flex-col gap-2"
        >
          <Field.Label className="text-xs font-medium tracking-[0.05em] text-ink-muted uppercase opacity-50">
            Fecha
          </Field.Label>
          <Field.Control
            type="date"
            className="rounded border border-border p-3 text-sm text-ink"
          />
          <Field.Error className="text-sm text-error-ink" />
        </Field.Root>
        <Field.Root
          name="taskId"
          validate={validateTaskId}
          className="flex flex-col gap-2"
        >
          <Field.Label className="text-xs font-medium tracking-[0.05em] text-ink-muted uppercase opacity-50">
            Proyecto / Tarea
          </Field.Label>
          <Field.Control
            render={
              <select className="rounded border border-border p-3 text-sm text-ink">
                <option value="">Selecciona una Tarea</option>
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {taskLabel(task.projectId, task.name)}
                  </option>
                ))}
              </select>
            }
          />
          <Field.Error className="text-sm text-error-ink" />
        </Field.Root>
        <Field.Root
          name="durationMinutes"
          validate={validateDuration}
          className="flex flex-col gap-2"
        >
          <Field.Label className="text-xs font-medium tracking-[0.05em] text-ink-muted uppercase opacity-50">
            Duración (minutos)
          </Field.Label>
          <Field.Control
            type="number"
            min={1}
            className="rounded border border-border p-3 text-sm text-ink"
          />
          <Field.Error className="text-sm text-error-ink" />
        </Field.Root>
        <button
          type="submit"
          className="rounded-lg bg-ink py-4 text-sm font-bold text-white shadow-sm"
        >
          Guardar Registro
        </button>
      </Form>
    </section>
  );
}
