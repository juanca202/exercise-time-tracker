"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { selectProjectTotalMs } from "../lib/selectors";
import { NewProjectModal } from "./new-project-modal";
import { NewTaskModal } from "./new-task-modal";
import { ProjectCard } from "./project-card";
import { useTrackerDerivedState } from "../store/use-derived-state";
import { useTimeTrackerStore } from "../store/time-tracker-store";
import { PlusIcon, iconClassName } from "./icons";

export function ProjectsPage() {
  const projects = useTimeTrackerStore((s) => s.projects);
  const { slice } = useTrackerDerivedState();
  const openModal = useTimeTrackerStore((s) => s.openModal);

  const projectTotals = useMemo(
    () =>
      new Map(
        projects.map((project) => [
          project.id,
          selectProjectTotalMs(slice, project.id),
        ]),
      ),
    [projects, slice],
  );

  const periodTotalMs = useMemo(
    () =>
      projects.reduce(
        (sum, project) => sum + (projectTotals.get(project.id) ?? 0),
        0,
      ),
    [projects, projectTotals],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="primary"
          className="w-fit"
          onClick={() => openModal("newProject")}
        >
          <PlusIcon className={iconClassName("sm")} aria-hidden="true" />
          Nuevo Proyecto
        </Button>
      </div>

      <header>
        <h1 className="text-headline-lg-mobile md:text-headline-lg text-primary">
          Proyectos
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => {
          const totalMs = projectTotals.get(project.id) ?? 0;
          const progressPercent =
            periodTotalMs > 0 ? (totalMs / periodTotalMs) * 100 : 0;

          return (
            <ProjectCard
              key={project.id}
              project={project}
              totalMs={totalMs}
              progressPercent={progressPercent}
            />
          );
        })}
        <button
          type="button"
          onClick={() => openModal("newProject")}
          className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-card-border bg-surface-container-low p-6 text-on-surface-variant transition-colors hover:border-primary hover:text-on-surface"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded border border-card-border">
            <PlusIcon
              className={iconClassName("md", "text-on-surface-variant")}
              aria-hidden="true"
            />
          </span>
          <span className="text-sm font-medium">Crear Nuevo Proyecto</span>
        </button>
      </div>

      <NewProjectModal />
      <NewTaskModal />
    </div>
  );
}
