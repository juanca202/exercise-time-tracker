"use client";

import { useProjectsStore } from "@/features/projects";
import { Dialog } from "@base-ui/react/dialog";
import { Field } from "@base-ui/react/field";
import { Select } from "@base-ui/react/select";
import { useState } from "react";
import { useTasksStore } from "../store/tasksStore";
import { ChevronIcon } from "./icons";

/** Handle compartido del diálogo "Nueva Tarea": permite abrirlo desde triggers desconectados. */
const newTaskDialogHandle = Dialog.createHandle();

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

/** Diálogo "Nueva Tarea": campos Proyecto y Nombre, acciones Cancelar/Crear Tarea (AC-001/003 de US-30272). */
export function NewTaskDialog() {
  const projects = useProjectsStore((state) => state.projects);
  const addTask = useTasksStore((state) => state.addTask);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [projectError, setProjectError] = useState(false);
  const [nameError, setNameError] = useState(false);

  function resetForm() {
    setProjectId(null);
    setName("");
    setProjectError(false);
    setNameError(false);
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      resetForm();
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const task = addTask(projectId ?? "", name);
    if (!task) {
      setProjectError(!projectId);
      setNameError(!name.trim());
      return;
    }

    resetForm();
    newTaskDialogHandle.close();
  }

  return (
    <Dialog.Root handle={newTaskDialogHandle} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-on-surface/40 backdrop-blur-[2px]" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-card border border-outline-variant bg-surface-container-lowest shadow-lg">
          <div className="flex items-center justify-between border-b border-outline-variant px-6 pt-6 pb-[25px]">
            <Dialog.Title className="text-2xl font-semibold text-primary">
              Nueva Tarea
            </Dialog.Title>
            <Dialog.Close
              aria-label="Cerrar"
              className="text-on-surface-variant hover:text-on-surface"
            >
              <CloseIcon />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
            <Field.Root invalid={projectError}>
              <Field.Label className="w-full font-mono text-xs font-medium tracking-wider text-on-surface-variant uppercase">
                Proyecto
              </Field.Label>
              <Select.Root
                items={projects.map((project) => ({
                  value: project.id,
                  label: project.name,
                }))}
                value={projectId}
                onValueChange={(value) => {
                  setProjectId(value);
                  if (projectError) {
                    setProjectError(false);
                  }
                }}
              >
                <Select.Trigger className="mt-1.5 flex w-full items-center justify-between rounded border border-outline-variant px-3.5 py-3.5 text-sm text-on-surface outline-none focus:border-primary">
                  <Select.Value placeholder="Selecciona un proyecto" />
                  <Select.Icon className="text-on-surface-variant">
                    <ChevronIcon />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Positioner sideOffset={4} className="z-50">
                    <Select.Popup className="max-h-64 overflow-auto rounded border border-outline-variant bg-surface-container-lowest py-1 shadow-lg">
                      <Select.List>
                        {projects.map((project) => (
                          <Select.Item
                            key={project.id}
                            value={project.id}
                            className="cursor-pointer px-3.5 py-2 text-sm text-on-surface data-[highlighted]:bg-surface-container-low"
                          >
                            <Select.ItemText>{project.name}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.List>
                    </Select.Popup>
                  </Select.Positioner>
                </Select.Portal>
              </Select.Root>
              {projectError && (
                <Field.Error className="mt-1 text-sm text-error" match={true}>
                  Seleccioná un Proyecto.
                </Field.Error>
              )}
            </Field.Root>

            <Field.Root invalid={nameError}>
              <Field.Label className="w-full font-mono text-xs font-medium tracking-wider text-on-surface-variant uppercase">
                Nombre
              </Field.Label>
              <Field.Control
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (nameError) {
                    setNameError(false);
                  }
                }}
                placeholder="¿En qué estás trabajando?"
                className="mt-1.5 w-full rounded border border-outline-variant px-3.5 py-3.5 text-sm text-on-surface outline-none focus:border-primary"
              />
              {nameError && (
                <Field.Error className="mt-1 text-sm text-error" match={true}>
                  El Nombre es obligatorio.
                </Field.Error>
              )}
            </Field.Root>

            <div className="flex justify-end gap-3 pt-4">
              <Dialog.Close className="rounded-[2px] border border-outline-variant px-6 py-2.5 text-sm font-bold text-primary hover:bg-surface-container-low">
                Cancelar
              </Dialog.Close>
              <button
                type="submit"
                className="rounded-[2px] bg-primary px-6 py-2.5 text-sm font-bold text-on-primary shadow-sm hover:opacity-90"
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

/** Trigger del TopAppBar: abre el diálogo "Nueva Tarea". */
export function NewTaskButton() {
  return (
    <Dialog.Trigger
      handle={newTaskDialogHandle}
      className="rounded-[2px] bg-primary px-4 py-2 text-sm font-bold text-on-primary hover:opacity-90"
    >
      Nueva Tarea
    </Dialog.Trigger>
  );
}
