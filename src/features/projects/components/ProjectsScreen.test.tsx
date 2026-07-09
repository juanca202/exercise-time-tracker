import { useTasksStore } from "@/features/tasks";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useProjectsStore } from "../store/projectsStore";
import { ProjectsScreen } from "./ProjectsScreen";

describe("ProjectsScreen", () => {
  beforeEach(() => {
    localStorage.clear();
    useProjectsStore.setState({ projects: [] });
    useTasksStore.setState({ tasks: [], timeEntries: [], activeTimer: null });
  });

  // El handle del diálogo de "Nuevo Proyecto" es un singleton a nivel de módulo;
  // cerrarlo evita que quede abierto y contamine el siguiente test.
  afterEach(async () => {
    await userEvent.keyboard("{Escape}");
  });

  it("muestra la tarjeta del Proyecto con Nombre, Descripción y Tiempo Registrado (TC-005)", () => {
    const createdAt = new Date(2026, 6, 1).toISOString();
    useProjectsStore.setState({
      projects: [
        {
          id: "project-1",
          name: "Rediseño Web",
          description: "Actualización del sitio corporativo",
          createdAt,
        },
      ],
    });
    useTasksStore.setState({
      tasks: [
        { id: "task-1", projectId: "project-1", name: "Diseño", createdAt },
      ],
      timeEntries: [
        {
          id: "e1",
          taskId: "task-1",
          startedAt: createdAt,
          endedAt: createdAt,
          durationMs: (3 * 60 + 30) * 60_000,
          source: "manual",
        },
      ],
    });

    render(<ProjectsScreen />);

    expect(screen.getByRole("heading", { name: "Rediseño Web" })).toBeVisible();
    expect(
      screen.getByText("Actualización del sitio corporativo"),
    ).toBeVisible();
    expect(screen.getByText("3h 30m")).toBeVisible();
  });

  it("no muestra ninguna tarjeta de Proyecto cuando no hay Proyectos creados (TC-006)", () => {
    render(<ProjectsScreen />);

    expect(screen.getByRole("heading", { name: "Proyectos" })).toBeVisible();
    expect(screen.queryAllByRole("heading", { level: 2 })).toHaveLength(0);
  });
});
