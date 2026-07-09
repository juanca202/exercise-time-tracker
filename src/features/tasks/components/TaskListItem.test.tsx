import { useProjectsStore } from "@/features/projects";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { useTasksStore } from "../store/tasksStore";
import type { Task } from "../types";
import { TaskListItem } from "./TaskListItem";

function aTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    projectId: "project-1",
    name: "Diseñar wireframes",
    createdAt: new Date(2026, 6, 1).toISOString(),
    ...overrides,
  };
}

describe("TaskListItem", () => {
  beforeEach(() => {
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

  it("muestra Nombre, Proyecto y el tiempo acumulado, y permite iniciar el temporizador (TC-007)", async () => {
    const user = userEvent.setup();
    const task = aTask();
    useTasksStore.setState({
      timeEntries: [
        {
          id: "e1",
          taskId: task.id,
          startedAt: task.createdAt,
          endedAt: task.createdAt,
          durationMs: 90 * 60_000,
          source: "manual",
        },
      ],
    });

    render(
      <ul>
        <TaskListItem task={task} />
      </ul>,
    );

    expect(
      screen.getByRole("heading", { name: "Diseñar wireframes" }),
    ).toBeVisible();
    expect(screen.getByText("Proyecto Alfa")).toBeVisible();
    expect(screen.getByText("01:30:00")).toBeVisible();

    await user.click(
      screen.getByRole("button", {
        name: "Iniciar temporizador de Diseñar wireframes",
      }),
    );

    expect(useTasksStore.getState().activeTimer?.taskId).toBe(task.id);
  });

  it('muestra "En Ejecución" y oculta la acción de inicio cuando la Tarea tiene el temporizador activo (TC-008)', () => {
    const task = aTask();
    useTasksStore.setState({
      activeTimer: { taskId: task.id, startedAt: task.createdAt },
    });

    render(
      <ul>
        <TaskListItem task={task} />
      </ul>,
    );

    expect(screen.getByText("En Ejecución")).toBeVisible();
    expect(
      screen.queryByRole("button", {
        name: "Iniciar temporizador de Diseñar wireframes",
      }),
    ).not.toBeInTheDocument();
  });

  it("muestra 00:00:00 y ninguna última actividad cuando la Tarea no tiene Registros de Tiempo", () => {
    const task = aTask();

    render(
      <ul>
        <TaskListItem task={task} />
      </ul>,
    );

    expect(screen.getByText("00:00:00")).toBeVisible();
  });
});
