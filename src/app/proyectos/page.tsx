"use client";

import { useState } from "react";
import { useProjectActions } from "@/features/projects/use-project-actions";
import { ProjectCard } from "@/features/projects/components/project-card";
import { NewProjectCard } from "@/features/projects/components/new-project-card";
import {
  ProjectForm,
  type ProjectFormValues,
} from "@/features/projects/components/project-form";
import { useTaskStore } from "@/shared/store/use-task-store";
import { useTimeEntryStore } from "@/shared/store/use-time-entry-store";
import { totalSecondsForProject } from "@/features/reports/calculate-totals";
import { PageActionBar } from "@/shared/layout/page-action-bar";
import type { Project } from "@/shared/store/entities";

type FormState = { mode: "create" } | { mode: "edit"; project: Project };

export default function ProjectsPage() {
  const { projects, createProject, updateProject, deleteProject } =
    useProjectActions();
  const tasks = useTaskStore((state) => state.tasks);
  const timeEntries = useTimeEntryStore((state) => state.timeEntries);
  const [formState, setFormState] = useState<FormState | null>(null);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);

  function handleSubmit(values: ProjectFormValues) {
    if (formState?.mode === "edit") {
      updateProject(formState.project.id, values);
    } else {
      createProject(values);
    }
    setFormState(null);
  }

  function handleDelete(project: Project) {
    const result = deleteProject(project.id);
    if (!result.deleted) {
      setBlockedMessage(
        `No se puede eliminar "${project.name}" porque tiene ${result.blockedByTaskCount} Tarea(s) asociada(s). Elimina o reasigna esas Tareas primero.`,
      );
    } else {
      setBlockedMessage(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageActionBar>
        <button
          type="button"
          onClick={() => setFormState({ mode: "create" })}
          className="rounded-sm bg-primary px-4 py-2 text-base font-bold text-white"
        >
          Nuevo Proyecto
        </button>
      </PageActionBar>

      <div className="flex flex-col gap-8 p-10 pt-0">
        <h1 className="text-3xl font-semibold text-primary">Proyectos</h1>

        {blockedMessage && (
          <div className="rounded border border-error-container bg-error-container px-4 py-3 text-sm text-on-error-container">
            {blockedMessage}
          </div>
        )}

        <div className="flex flex-wrap gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              totalSeconds={totalSecondsForProject(
                timeEntries,
                tasks,
                project.id,
              )}
              onEdit={() => setFormState({ mode: "edit", project })}
              onDelete={() => handleDelete(project)}
            />
          ))}
          <NewProjectCard onClick={() => setFormState({ mode: "create" })} />
        </div>
      </div>

      <ProjectForm
        key={
          formState === null
            ? "closed"
            : formState.mode === "edit"
              ? formState.project.id
              : "create"
        }
        open={formState !== null}
        onOpenChange={(open) => {
          if (!open) {
            setFormState(null);
          }
        }}
        initialValues={
          formState?.mode === "edit"
            ? {
                name: formState.project.name,
                description: formState.project.description,
              }
            : undefined
        }
        onSubmit={handleSubmit}
      />
    </div>
  );
}
