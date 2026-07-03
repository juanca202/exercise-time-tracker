"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Field } from "@base-ui/react/field";
import { type FormEvent, type ReactElement, useState } from "react";
import { useTimeTrackerStore } from "../../store/time-tracker-store";

export function NewProjectModal({ trigger }: { trigger: ReactElement }) {
  const createProject = useTimeTrackerStore((state) => state.createProject);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      createProject({ name, description: description || undefined });
      setName("");
      setDescription("");
      setError(null);
      setOpen(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo crear el proyecto.",
      );
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger render={trigger} />
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-surface-container-lowest p-8 shadow-lg">
          <Dialog.Title className="text-headline-md font-semibold text-on-surface">
            Nuevo Proyecto
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <Field.Root className="flex flex-col gap-2">
              <Field.Label className="text-label-mono uppercase text-on-surface-variant">
                Nombre del Proyecto
              </Field.Label>
              <Field.Control
                value={name}
                onValueChange={setName}
                placeholder="ej. Estrategia de Marketing Q4"
                className="rounded border border-outline-variant px-3 py-2"
              />
            </Field.Root>
            <Field.Root className="flex flex-col gap-2">
              <Field.Label className="text-label-mono uppercase text-on-surface-variant">
                Descripción
              </Field.Label>
              <Field.Control
                render={<textarea />}
                value={description}
                onValueChange={setDescription}
                placeholder="Define los objetivos primarios..."
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
                Crear Proyecto
              </button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
