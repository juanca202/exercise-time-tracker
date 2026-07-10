"use client";

import { Button } from "@base-ui/react/button";
import { Dialog } from "@base-ui/react/dialog";
import { Field } from "@base-ui/react/field";
import { Form } from "@base-ui/react/form";
import { IconX } from "@/shared/ui/icons";
import { useProjectStore } from "../model/project-store";

function validateName(value: unknown) {
  return String(value ?? "").trim() ? null : "El nombre es obligatorio";
}

export function NewProjectDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const createProject = useProjectStore((state) => state.createProject);

  function handleFormSubmit(values: Record<string, unknown>) {
    createProject({
      name: String(values.name ?? ""),
      description: values.description ? String(values.description) : undefined,
    });
    onOpenChange(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-[rgba(25,28,30,0.4)] backdrop-blur-[2px]" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-full max-w-[512px] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-surface shadow-xl">
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <Dialog.Title className="text-2xl font-semibold text-ink">
              Nuevo Proyecto
            </Dialog.Title>
            <Dialog.Close
              aria-label="Cerrar"
              render={
                <Button className="text-ink-muted">
                  <IconX className="size-3.5" />
                </Button>
              }
            />
          </div>
          <Form
            className="flex flex-col gap-4 p-6"
            onFormSubmit={handleFormSubmit}
          >
            <Field.Root
              name="name"
              validate={validateName}
              className="flex flex-col gap-1.5"
            >
              <Field.Label className="text-xs font-medium tracking-[0.05em] text-ink-muted uppercase">
                Nombre del Proyecto
              </Field.Label>
              <Field.Control
                required
                placeholder="ej. Estrategia de Marketing Q4"
                className="rounded border border-border px-3.5 py-3 text-sm text-ink placeholder:text-placeholder"
              />
              <Field.Error className="text-sm text-error-ink" />
            </Field.Root>
            <Field.Root name="description" className="flex flex-col gap-1.5">
              <Field.Label className="text-xs font-medium tracking-[0.05em] text-ink-muted uppercase">
                Descripción
              </Field.Label>
              <Field.Control
                render={<textarea rows={3} />}
                placeholder="Define los objetivos primarios..."
                className="rounded border border-border px-3.5 py-3 text-sm text-ink placeholder:text-placeholder"
              />
            </Field.Root>
            <div className="flex justify-end gap-3 pt-2">
              <Dialog.Close
                render={
                  <Button
                    type="button"
                    className="rounded-sm border border-border px-6 py-2.5 text-sm font-bold text-ink"
                  >
                    Cancelar
                  </Button>
                }
              />
              <Button
                type="submit"
                className="rounded-sm bg-ink px-6 py-2.5 text-sm font-bold text-white shadow-sm"
              >
                Crear Proyecto
              </Button>
            </div>
          </Form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
