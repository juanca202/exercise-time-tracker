"use client";

import { useHydrateTasksStore } from "@/features/tasks";
import { AppShell } from "@/components/layout/AppShell";
import { useProjectsStore } from "../store/projectsStore";
import { useHydrateProjectsStore } from "../store/useHydrateProjectsStore";
import {
  NewProjectButton,
  NewProjectCardTrigger,
  NewProjectDialog,
} from "./NewProjectModal";
import { ProjectCard } from "./ProjectCard";

/** Pantalla "Proyectos": listado de Proyectos y la acción para crear uno nuevo. */
export function ProjectsScreen() {
  useHydrateProjectsStore();
  // ProjectCard lee tasksStore (selectProjectTotalTime); también se hidrata acá.
  useHydrateTasksStore();
  const projects = useProjectsStore((state) => state.projects);

  return (
    <AppShell activeNav="projects" headerAction={<NewProjectButton />}>
      <div className="mx-auto max-w-[1280px] p-10">
        <h1 className="text-3xl font-semibold text-primary">Proyectos</h1>

        <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          <li>
            <NewProjectCardTrigger />
          </li>
        </ul>

        <NewProjectDialog />
      </div>
    </AppShell>
  );
}
