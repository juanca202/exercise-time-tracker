"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Field } from "@base-ui/react/field";
import { type FormEvent, useState } from "react";
import { useTimeTrackerStore } from "../../store/time-tracker-store";

export function NewTaskModal() {
  const projects = useTimeTrackerStore((state) => state.projects);
  const createTask = useTimeTrackerStore((state) => state.createTask);
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const projectOptions = Object.values(projects);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!projectId) {
      setError("Selecciona un proyecto.");
      return;
    }
    try {
      createTask({ projectId, name });
      setName("");
      setProjectId("");
      setError(null);
      setOpen(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo crear la tarea.",
      );
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="rounded bg-primary px-4 py-2 text-body-lg text-on-primary">
        Nueva Tarea
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-surface-container-lowest p-8 shadow-lg">
          <Dialog.Title className="text-headline-md font-semibold text-on-surface">
            Nueva Tarea
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <Field.Root className="flex flex-col gap-2">
              <Field.Label className="text-label-mono uppercase text-on-surface-variant">
                Proyecto
              </Field.Label>
              <Field.Control
                render={<select />}
                value={projectId}
                onValueChange={setProjectId}
                disabled={projectOptions.length === 0}
                className="rounded border border-outline-variant px-3 py-2"
              >
                <option value="">Selecciona un proyecto</option>
                {projectOptions.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </Field.Control>
            </Field.Root>
            <Field.Root className="flex flex-col gap-2">
              <Field.Label className="text-label-mono uppercase text-on-surface-variant">
                Nombre
              </Field.Label>
              <Field.Control
                value={name}
                onValueChange={setName}
                placeholder="¿En qué estás trabajando?"
                className="rounded border border-outline-variant px-3 py-2"
              />
            </Field.Root>
            {error ? (
              <p role="alert" className="text-body-md text-error">
                {error}
              </p>
            ) : null}
            <div className="mt-2 flex justify-end gap-3">
              <Dialog.Close className="rounded border border-outline px-4 py-2 text-body-lg">
                Cancelar
              </Dialog.Close>
              <button
                type="submit"
                className="rounded bg-primary px-4 py-2 text-body-lg text-on-primary"
              >
                Crear Tarea
              </button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
