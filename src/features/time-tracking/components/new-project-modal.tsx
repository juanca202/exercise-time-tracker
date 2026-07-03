"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { Field } from "@/components/field";
import { Modal } from "@/components/modal";
import { TextareaField } from "@/components/textarea-field";
import { useTimeTrackingStore } from "../store/time-tracking-store";

export interface NewProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal de creación de Proyecto: Nombre (obligatorio) y Descripción
 * (opcional). Persiste el Proyecto a través del store al confirmar.
 */
export function NewProjectModal({ open, onOpenChange }: NewProjectModalProps) {
  const createProject = useTimeTrackingStore((state) => state.createProject);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  function reset() {
    setName("");
    setDescription("");
    setError(undefined);
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      reset();
    }
    onOpenChange(next);
  }

  function handleSubmit() {
    if (!name.trim()) {
      setError("El nombre del proyecto es obligatorio.");
      return;
    }

    createProject({ name, description: description.trim() || undefined });
    reset();
    onOpenChange(false);
  }

  return (
    <Modal open={open} onOpenChange={handleOpenChange} title="Nuevo Proyecto">
      <div className="flex flex-col gap-4">
        <Field
          label="Nombre del Proyecto"
          placeholder="ej. Estrategia de Marketing Q4"
          value={name}
          onValueChange={(value) => {
            setName(value);
            if (error) setError(undefined);
          }}
          error={error}
        />
        <TextareaField
          label="Descripción"
          placeholder="Define los objetivos primarios..."
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
        />
        <div className="mt-2 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Crear Proyecto
          </Button>
        </div>
      </div>
    </Modal>
  );
}
