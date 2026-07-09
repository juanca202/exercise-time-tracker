"use client";

import { useProjectsStore } from "@/features/projects";
import { Select } from "@base-ui/react/select";
import { useState } from "react";
import { useTasksStore } from "../store/tasksStore";
import { parseHoursMinutes } from "../utils/parseHoursMinutes";
import { ChevronIcon } from "./icons";

function todayDateInputValue(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Formulario "Entrada Manual": Fecha, Proyecto/Tarea y Duración (AC-009/010/011 de US-30272). */
export function ManualEntryForm() {
  const tasks = useTasksStore((state) => state.tasks);
  const projects = useProjectsStore((state) => state.projects);
  const addManualTimeEntry = useTasksStore((state) => state.addManualTimeEntry);

  const [date, setDate] = useState(todayDateInputValue);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [duration, setDuration] = useState("");
  const [error, setError] = useState<string | null>(null);

  function taskLabel(id: string): string {
    const task = tasks.find((candidate) => candidate.id === id);
    if (!task) {
      return "";
    }
    const project = projects.find(
      (candidate) => candidate.id === task.projectId,
    );
    return project ? `${project.name} — ${task.name}` : task.name;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const durationMs = parseHoursMinutes(duration);
    const entry =
      taskId && date && durationMs !== null
        ? addManualTimeEntry(taskId, new Date(date).toISOString(), durationMs)
        : null;

    if (!entry) {
      setError("Completá Fecha, Proyecto/Tarea y una Duración válida (HH:MM).");
      return;
    }

    setDate(todayDateInputValue());
    setTaskId(null);
    setDuration("");
    setError(null);
  }

  return (
    <div className="flex h-full flex-col gap-6 border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
      <h3 className="text-2xl font-semibold text-primary">Entrada Manual</h3>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-5">
        <div>
          <label
            htmlFor="manual-entry-date"
            className="font-mono text-xs font-medium tracking-wider text-on-surface-variant/70 uppercase"
          >
            Fecha
          </label>
          <input
            id="manual-entry-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="mt-2 w-full rounded border border-outline-variant p-3 text-sm text-on-surface outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="font-mono text-xs font-medium tracking-wider text-on-surface-variant/70 uppercase">
            Proyecto / Tarea
          </label>
          <Select.Root
            items={tasks.map((task) => ({
              value: task.id,
              label: taskLabel(task.id),
            }))}
            value={taskId}
            onValueChange={setTaskId}
          >
            <Select.Trigger
              aria-label="Proyecto / Tarea"
              className="mt-2 flex w-full items-center justify-between rounded border border-outline-variant p-3 text-sm text-on-surface outline-none focus:border-primary"
            >
              <Select.Value placeholder="Selecciona una tarea" />
              <Select.Icon className="text-on-surface-variant">
                <ChevronIcon />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Positioner sideOffset={4} className="z-50">
                <Select.Popup className="max-h-64 overflow-auto rounded border border-outline-variant bg-surface-container-lowest py-1 shadow-lg">
                  <Select.List>
                    {tasks.map((task) => (
                      <Select.Item
                        key={task.id}
                        value={task.id}
                        className="cursor-pointer px-3.5 py-2 text-sm text-on-surface data-[highlighted]:bg-surface-container-low"
                      >
                        <Select.ItemText>{taskLabel(task.id)}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.List>
                </Select.Popup>
              </Select.Positioner>
            </Select.Portal>
          </Select.Root>
        </div>

        <div>
          <label
            htmlFor="manual-entry-duration"
            className="font-mono text-xs font-medium tracking-wider text-on-surface-variant/70 uppercase"
          >
            Duración
          </label>
          <input
            id="manual-entry-duration"
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
            placeholder="02:30"
            className="mt-2 w-full rounded border border-outline-variant p-3 text-sm text-on-surface outline-none focus:border-primary"
          />
        </div>

        {error && <p className="text-sm text-error">{error}</p>}

        <button
          type="submit"
          className="mt-auto rounded-card bg-primary py-4 text-sm font-bold text-on-primary shadow-sm hover:opacity-90"
        >
          Guardar Registro
        </button>
      </form>
    </div>
  );
}
