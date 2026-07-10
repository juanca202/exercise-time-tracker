"use client";

import { useState } from "react";
import { Button } from "@base-ui/react/button";
import { TopActionBar } from "@/shared/ui/top-action-bar";
import { useHydratePersistedStore } from "@/shared/lib/use-hydrate-persisted-store";
import { IconPlus } from "@/shared/ui/icons";
import { useProjectStore } from "../model/project-store";
import { NewProjectDialog } from "./new-project-dialog";
import { ProjectCard } from "./project-card";

export function ProjectsPage() {
  useHydratePersistedStore(useProjectStore);
  const projects = useProjectStore((state) => state.projects);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <TopActionBar>
        <Button
          onClick={() => setDialogOpen(true)}
          className="rounded-sm bg-ink px-4 py-2 text-sm font-bold text-white"
        >
          Nuevo Proyecto
        </Button>
      </TopActionBar>
      <section className="flex w-full max-w-[1280px] flex-col gap-8 p-10">
        <h2 className="text-[32px] font-semibold text-ink">Proyectos</h2>

        {projects.length === 0 ? (
          <p className="text-sm text-ink-muted">
            Todavía no hay Proyectos creados.
          </p>
        ) : null}
        <div className="flex flex-wrap gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="flex min-h-[250px] w-full flex-col items-center justify-center gap-3 rounded border-2 border-dashed border-border px-8 py-12 sm:w-[280px]"
          >
            <span className="flex size-12 items-center justify-center rounded-xl bg-surface-muted">
              <IconPlus className="size-3.5 text-ink-muted" />
            </span>
            <span className="text-base font-bold text-ink-muted">
              Crear Nuevo Proyecto
            </span>
          </button>
        </div>
      </section>
      <NewProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
