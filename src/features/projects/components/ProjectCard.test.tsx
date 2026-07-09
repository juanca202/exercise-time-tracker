import { useTasksStore } from "@/features/tasks";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useProjectsStore } from "../store/projectsStore";
import type { Project } from "../types";
import { ProjectCard } from "./ProjectCard";

function aProject(overrides: Partial<Project> = {}): Project {
  return {
    id: "project-1",
    name: "Rediseño Web",
    description: "Actualización del sitio corporativo",
    createdAt: new Date(2026, 6, 1).toISOString(),
    ...overrides,
  };
}

describe("ProjectCard", () => {
  beforeEach(() => {
    useTasksStore.setState({ tasks: [], timeEntries: [], activeTimer: null });
    useProjectsStore.setState({ projects: [] });
  });

  it("muestra Nombre, Descripción y Tiempo Registrado (TC-005)", () => {
    const project = aProject();
    useTasksStore.setState({
      tasks: [
        {
          id: "task-1",
          projectId: project.id,
          name: "Diseño",
          createdAt: project.createdAt,
        },
      ],
      timeEntries: [
        {
          id: "e1",
          taskId: "task-1",
          startedAt: project.createdAt,
          endedAt: project.createdAt,
          durationMs: (3 * 60 + 30) * 60_000,
          source: "manual",
        },
      ],
    });

    render(
      <ul>
        <ProjectCard project={project} />
      </ul>,
    );

    expect(screen.getByRole("heading", { name: "Rediseño Web" })).toBeVisible();
    expect(
      screen.getByText("Actualización del sitio corporativo"),
    ).toBeVisible();
    expect(screen.getByText("3h 30m")).toBeVisible();
  });

  it("no muestra el párrafo de Descripción cuando el Proyecto no tiene una (TC-002)", () => {
    const project = aProject({ description: undefined });

    render(
      <ul>
        <ProjectCard project={project} />
      </ul>,
    );

    expect(screen.getByRole("heading", { name: "Rediseño Web" })).toBeVisible();
    expect(
      screen.queryByText("Actualización del sitio corporativo"),
    ).not.toBeInTheDocument();
  });

  it("muestra 0h 00m cuando el Proyecto no tiene Tareas ni Registros de Tiempo (TC-009)", () => {
    const project = aProject();

    render(
      <ul>
        <ProjectCard project={project} />
      </ul>,
    );

    expect(screen.getByText("0h 00m")).toBeVisible();
  });
});
