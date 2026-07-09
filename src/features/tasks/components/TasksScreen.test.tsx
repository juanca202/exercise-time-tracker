import { useProjectsStore } from "@/features/projects";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTasksStore } from "../store/tasksStore";
import { TasksScreen } from "./TasksScreen";

describe("TasksScreen", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 8, 12, 0, 0)); // miércoles

    useProjectsStore.setState({
      projects: [
        {
          id: "project-1",
          name: "Proyecto Alfa",
          createdAt: new Date(2026, 6, 1).toISOString(),
        },
      ],
    });
    useTasksStore.setState({ tasks: [], timeEntries: [], activeTimer: null });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("muestra el estado vacío de Tareas Recientes cuando no hay Tareas creadas", () => {
    render(<TasksScreen />);

    expect(screen.getByText("Todavía no creaste ninguna tarea.")).toBeVisible();
    expect(screen.getAllByText("0h 00m")).toHaveLength(2); // Total Semanal y Total Mensual
    expect(screen.getByText("0%")).toBeVisible();
  });

  it("lista las Tareas Recientes y calcula el Total Semanal a partir de los Registros de Tiempo", () => {
    const wednesday = new Date(2026, 6, 8, 9, 0, 0).toISOString();
    useTasksStore.setState({
      tasks: [
        {
          id: "task-1",
          projectId: "project-1",
          name: "Diseñar wireframes",
          createdAt: wednesday,
        },
      ],
      timeEntries: [
        {
          id: "e1",
          taskId: "task-1",
          startedAt: wednesday,
          endedAt: wednesday,
          durationMs: 90 * 60_000,
          source: "manual",
        },
      ],
    });

    render(<TasksScreen />);

    expect(
      screen.getByRole("heading", { name: "Diseñar wireframes" }),
    ).toBeVisible();
    expect(screen.getAllByText("1h 30m")).toHaveLength(2); // Total Semanal y Total Mensual
  });

  it('incluye el link "Ver Historial" hacia /history', () => {
    render(<TasksScreen />);

    expect(screen.getByRole("link", { name: "Ver Historial" })).toHaveAttribute(
      "href",
      "/history",
    );
  });
});
