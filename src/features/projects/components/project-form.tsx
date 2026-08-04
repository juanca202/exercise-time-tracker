"use client";

import { Dialog } from "@base-ui/react/dialog";
import { useState, type FormEvent } from "react";
import { CloseIcon } from "@/shared/icons/close-icon";

const MAX_NAME_LENGTH = 100;

export interface ProjectFormValues {
  name: string;
  description: string;
}

interface ProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: ProjectFormValues;
  onSubmit: (values: ProjectFormValues) => void;
}

/** Modal de creación/edición de Proyecto (fiel al diseño de Figma, nodo 1:1712). */
export function ProjectForm({
  open,
  onOpenChange,
  initialValues,
  onSubmit,
}: ProjectFormProps) {
  const isEditing = Boolean(initialValues);
  const [name, setName] = useState(initialValues?.name ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ name: name.trim(), description: description.trim() });
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-[#191c1e]/40 backdrop-blur-[2px]" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-full max-w-[512px] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-outline-variant bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-outline-variant px-6 py-6">
            <Dialog.Title className="text-2xl font-semibold text-primary">
              {isEditing ? "Editar Proyecto" : "Nuevo Proyecto"}
            </Dialog.Title>
            <Dialog.Close
              aria-label="Cerrar"
              className="text-on-surface-variant"
            >
              <CloseIcon className="size-3.5" />
            </Dialog.Close>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="project-name"
                className="font-mono text-xs tracking-wider text-on-surface-variant uppercase"
              >
                Nombre del Proyecto
              </label>
              <input
                id="project-name"
                required
                maxLength={MAX_NAME_LENGTH}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="ej. Estrategia de Marketing Q4"
                className="rounded border border-outline-variant px-3.5 py-3.5 text-sm text-on-surface"
              />
            </div>
            <div className="flex flex-col gap-1.5 pb-1.5">
              <label
                htmlFor="project-description"
                className="font-mono text-xs tracking-wider text-on-surface-variant uppercase"
              >
                Descripción
              </label>
              <textarea
                id="project-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Define los objetivos primarios..."
                rows={3}
                className="rounded border border-outline-variant px-3.5 py-3.5 text-sm text-on-surface"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Dialog.Close className="rounded-sm border border-outline-variant px-6 py-2.5 text-base font-bold text-primary">
                Cancelar
              </Dialog.Close>
              <button
                type="submit"
                className="rounded-sm bg-primary px-6 py-2.5 text-base font-bold text-white shadow-md"
              >
                {isEditing ? "Guardar Cambios" : "Crear Proyecto"}
              </button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
