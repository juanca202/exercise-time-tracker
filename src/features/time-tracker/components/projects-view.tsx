"use client";

import { NewProjectModal } from "./new-project-modal/new-project-modal";
import { ProjectList } from "./project-list/project-list";

export function ProjectsView() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-lg font-semibold text-on-surface">
          Proyectos
        </h1>
        <NewProjectModal
          trigger={
            <button
              type="button"
              className="rounded border border-outline px-4 py-2 text-body-lg font-semibold"
            >
              Nuevo Proyecto
            </button>
          }
        />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ProjectList />
        <NewProjectModal
          trigger={
            <button
              type="button"
              className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-outline text-body-lg font-semibold text-on-surface"
            >
              <span aria-hidden="true" className="text-headline-lg">
                +
              </span>
              Crear Nuevo Proyecto
            </button>
          }
        />
      </div>
    </div>
  );
}
