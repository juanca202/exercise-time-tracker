"use client";

import { useState } from "react";
import { formatHoursAndMinutes, projectTotalSeconds } from "../lib/totals";
import { useTimeTrackingStore } from "../store/time-tracking-store";
import { NewProjectModal } from "./new-project-modal";

/**
 * Cuadrícula de tarjetas de Proyecto (nombre, descripción, tiempo total
 * registrado) más una tarjeta para crear un nuevo Proyecto.
 */
export function ProjectGrid() {
  const projects = useTimeTrackingStore((state) => state.projects);
  const tasks = useTimeTrackingStore((state) => state.tasks);
  const timeEntries = useTimeTrackingStore((state) => state.timeEntries);
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <section>
      <h1 className="mb-6 text-2xl font-semibold text-foreground">Proyectos</h1>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <li
            key={project.id}
            className="flex flex-col gap-3 rounded-(--radius-container) border border-border bg-surface-elevated p-5"
          >
            <h2 className="font-semibold text-foreground">{project.name}</h2>
            {project.description ? (
              <p className="text-sm text-tertiary">{project.description}</p>
            ) : null}
            <div className="mt-auto">
              <p className="text-xs font-medium tracking-wide text-tertiary uppercase">
                Tiempo registrado
              </p>
              <p className="font-mono text-lg text-foreground">
                {formatHoursAndMinutes(
                  projectTotalSeconds(project.id, tasks, timeEntries),
                )}
              </p>
            </div>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex h-full min-h-40 w-full flex-col items-center justify-center gap-2 rounded-(--radius-container) border border-dashed border-border-strong text-sm font-medium text-tertiary hover:text-foreground"
          >
            <span aria-hidden className="text-2xl">
              +
            </span>
            Crear Nuevo Proyecto
          </button>
        </li>
      </ul>
      <NewProjectModal open={isModalOpen} onOpenChange={setModalOpen} />
    </section>
  );
}
