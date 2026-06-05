"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTimeTrackerStore } from "../store/time-tracker-store";

export function NewProjectModal() {
  const open = useTimeTrackerStore((s) => s.modals.newProject);
  const closeModal = useTimeTrackerStore((s) => s.closeModal);
  const createProject = useTimeTrackerStore((s) => s.createProject);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setError(null);
    setName("");
    setDescription("");
    closeModal("newProject");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const result = createProject({ name, description });
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setName("");
    setDescription("");
    setError(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !next && handleClose()}
      title="Nuevo Proyecto"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Nombre del proyecto"
          name="projectName"
          placeholder="ej. Estrategia de Marketing Q4"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Textarea
          label="Descripción"
          name="projectDescription"
          placeholder="Define los objetivos primarios..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {error ? (
          <p className="text-sm text-error" role="alert">
            {error}
          </p>
        ) : null}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit">Crear Proyecto</Button>
        </div>
      </form>
    </Dialog>
  );
}
