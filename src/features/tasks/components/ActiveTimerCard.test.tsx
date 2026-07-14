import { useProjectsStore } from "@/features/projects";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTasksStore } from "../store/tasksStore";
import { ActiveTimerCard } from "./ActiveTimerCard";

describe("ActiveTimerCard", () => {
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
    useTasksStore.setState({
      tasks: [
        {
          id: "task-1",
          projectId: "project-1",
          name: "Diseñar wireframes",
          createdAt: new Date(2026, 6, 1).toISOString(),
        },
      ],
      timeEntries: [],
      activeTimer: null,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("muestra el estado inactivo cuando no hay ningún temporizador activo (TC-011)", () => {
    render(<ActiveTimerCard />);

    expect(
      screen.getByText("No tenés ningún temporizador activo."),
    ).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "Detener Sesión" }),
    ).not.toBeInTheDocument();
  });

  it("muestra la Tarea, el Proyecto y el tiempo transcurrido del temporizador activo (TC-007)", () => {
    const now = new Date(2026, 6, 8, 10, 0, 0);
    vi.useFakeTimers();
    vi.setSystemTime(now);

    useTasksStore.setState({
      activeTimer: { taskId: "task-1", startedAt: now.toISOString() },
    });

    render(<ActiveTimerCard />);

    expect(
      screen.getByRole("heading", { name: "Diseñar wireframes" }),
    ).toBeVisible();
    expect(screen.getByText("Proyecto Alfa")).toBeVisible();
    expect(screen.getByText("00:00:00")).toBeVisible();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByText("00:00:05")).toBeVisible();
  });

  it('detiene el temporizador activo al hacer clic en "Detener Sesión" (TC-010)', async () => {
    const user = userEvent.setup();

    useTasksStore.setState({
      activeTimer: { taskId: "task-1", startedAt: new Date().toISOString() },
    });

    render(<ActiveTimerCard />);

    await user.click(screen.getByRole("button", { name: "Detener Sesión" }));

    expect(useTasksStore.getState().activeTimer).toBeNull();
  });
});
