"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/button";
import { Field } from "@/components/field";
import { Modal } from "@/components/modal";
import { SelectField } from "@/components/select-field";
import { useTimeTrackingStore } from "../store/time-tracking-store";

export interface NewTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal de creación de Tarea: selección de Proyecto existente (obligatoria)
 * y Nombre (obligatorio). Persiste la Tarea a través del store al confirmar.
 */
export function NewTaskModal({ open, onOpenChange }: NewTaskModalProps) {
  const projects = useTimeTrackingStore((state) => state.projects);
  const createTask = useTimeTrackingStore((state) => state.createTask);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  function reset() {
    setProjectId(null);
    setName("");
    setError(undefined);
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      reset();
    }
    onOpenChange(next);
  }

  function handleSubmit() {
    if (!projectId) {
      setError("Debes seleccionar un Proyecto existente.");
      return;
    }
    if (!name.trim()) {
      setError("El nombre de la tarea es obligatorio.");
      return;
    }

    createTask({ projectId, name });
    reset();
    onOpenChange(false);
  }

  return (
    <Modal open={open} onOpenChange={handleOpenChange} title="Nueva Tarea">
      {projects.length === 0 ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-tertiary">
            Todavía no tienes ningún Proyecto. Crea uno primero para poder
            asociarle Tareas.
          </p>
          <Link
            href="/projects"
            className="text-sm font-medium text-primary underline"
          >
            Ir a Proyectos
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <SelectField
            label="Proyecto"
            placeholder="Selecciona un proyecto"
            value={projectId}
            onValueChange={(value) => {
              setProjectId(value);
              if (error) setError(undefined);
            }}
            groups={[
              {
                options: projects.map((project) => ({
                  value: project.id,
                  label: project.name,
                })),
              },
            ]}
            error={
              error === "Debes seleccionar un Proyecto existente."
                ? error
                : undefined
            }
          />
          <Field
            label="Nombre"
            placeholder="¿En qué estás trabajando?"
            value={name}
            onValueChange={(value) => {
              setName(value);
              if (error) setError(undefined);
            }}
            error={
              error === "El nombre de la tarea es obligatorio."
                ? error
                : undefined
            }
          />
          <div className="mt-2 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Crear Tarea
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
