"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Field } from "@base-ui/react/field";
import { useState } from "react";
import { useProjectsStore } from "../store/projectsStore";

/**
 * Handle compartido del diálogo "Nuevo Proyecto": permite abrirlo desde triggers
 * "desconectados" (el botón del TopAppBar y la tarjeta punteada de la grilla).
 */
const newProjectDialogHandle = Dialog.createHandle();

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="size-4"
    >
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="size-3.5"
    >
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

/** Diálogo "Nuevo Proyecto": el formulario en sí. Los triggers viven en componentes aparte. */
export function NewProjectDialog() {
  const addProject = useProjectsStore((state) => state.addProject);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState(false);

  function resetForm() {
    setName("");
    setDescription("");
    setNameError(false);
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      resetForm();
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const project = addProject(name, description);
    if (!project) {
      setNameError(true);
      return;
    }

    resetForm();
    newProjectDialogHandle.close();
  }

  return (
    <Dialog.Root
      handle={newProjectDialogHandle}
      onOpenChange={handleOpenChange}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-on-surface/40 backdrop-blur-[2px]" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-card border border-outline-variant bg-surface-container-lowest shadow-lg">
          <div className="flex items-center justify-between border-b border-outline-variant px-6 pt-6 pb-[25px]">
            <Dialog.Title className="text-2xl font-semibold text-primary">
              Nuevo Proyecto
            </Dialog.Title>
            <Dialog.Close
              aria-label="Cerrar"
              className="text-on-surface-variant hover:text-on-surface"
            >
              <CloseIcon />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
            <Field.Root invalid={nameError}>
              <Field.Label className="w-full font-mono text-xs font-medium tracking-wider text-on-surface-variant uppercase">
                Nombre del Proyecto
              </Field.Label>
              <Field.Control
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (nameError) {
                    setNameError(false);
                  }
                }}
                placeholder="ej. Estrategia de Marketing Q4"
                className="mt-1.5 w-full rounded border border-outline-variant px-3.5 py-3.5 text-sm text-on-surface outline-none focus:border-primary"
              />
              {nameError && (
                <Field.Error className="mt-1 text-sm text-error" match={true}>
                  El Nombre es obligatorio.
                </Field.Error>
              )}
            </Field.Root>

            <Field.Root>
              <Field.Label className="w-full font-mono text-xs font-medium tracking-wider text-on-surface-variant uppercase">
                Descripción
              </Field.Label>
              <Field.Control
                render={<textarea rows={3} />}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Define los objetivos primarios..."
                className="mt-1.5 w-full resize-none rounded border border-outline-variant px-3.5 py-3 text-sm text-on-surface outline-none focus:border-primary"
              />
            </Field.Root>

            <div className="flex justify-end gap-3 pt-4">
              <Dialog.Close className="rounded-[2px] border border-outline-variant px-6 py-2.5 text-sm font-bold text-primary hover:bg-surface-container-low">
                Cancelar
              </Dialog.Close>
              <button
                type="submit"
                className="rounded-[2px] bg-primary px-6 py-2.5 text-sm font-bold text-on-primary shadow-sm hover:opacity-90"
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

/** Trigger del TopAppBar: abre el diálogo "Nuevo Proyecto". */
export function NewProjectButton() {
  return (
    <Dialog.Trigger
      handle={newProjectDialogHandle}
      className="rounded-[2px] bg-primary px-4 py-2 text-sm font-bold text-on-primary hover:opacity-90"
    >
      Nuevo Proyecto
    </Dialog.Trigger>
  );
}

/** Tarjeta punteada al final de la grilla: trigger alternativo del mismo diálogo (AC-004). */
export function NewProjectCardTrigger() {
  return (
    <Dialog.Trigger
      handle={newProjectDialogHandle}
      className="flex min-h-[250px] w-full flex-col items-center justify-center gap-3 rounded border-2 border-dashed border-outline-variant text-on-surface-variant hover:border-primary"
    >
      <span className="flex size-12 items-center justify-center rounded-xl bg-surface-container-low">
        <PlusIcon />
      </span>
      <span className="text-base font-bold">Crear Nuevo Proyecto</span>
    </Dialog.Trigger>
  );
}
