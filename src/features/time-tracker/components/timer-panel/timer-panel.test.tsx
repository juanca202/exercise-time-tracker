import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { aProject, aTask } from "../../testing/object-mothers";
import {
  initialTimeTrackerState,
  useTimeTrackerStore,
} from "../../store/time-tracker-store";
import { TimerPanel } from "./timer-panel";

beforeEach(() => {
  useTimeTrackerStore.setState(initialTimeTrackerState);
  localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("TimerPanel", () => {
  it("shows the empty state when there is no active timer", () => {
    render(<TimerPanel />);
    expect(
      screen.getByText(
        "Ningún temporizador activo. Inicia uno desde una tarea.",
      ),
    ).toBeInTheDocument();
  });

  it("shows the running task and ticks the elapsed time every second", () => {
    vi.useFakeTimers();
    const startedAt = new Date("2026-07-02T09:00:00.000Z");
    vi.setSystemTime(startedAt);

    const project = aProject({ id: "project-1", name: "Rediseño" });
    const task = aTask({
      id: "task-1",
      projectId: "project-1",
      name: "Wireframes",
    });
    useTimeTrackerStore.setState({
      projects: { [project.id]: project },
      tasks: { [task.id]: task },
      activeTimer: { taskId: task.id, startedAt: startedAt.toISOString() },
    });

    render(<TimerPanel />);
    expect(screen.getByText("Wireframes")).toBeInTheDocument();
    expect(screen.getByText("00:00:00")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByText("00:00:03")).toBeInTheDocument();
  });

  it("stops the timer and clears the active state when the button is clicked", async () => {
    const startedAt = new Date("2026-07-02T09:00:00.000Z");
    const project = aProject({ id: "project-1" });
    const task = aTask({ id: "task-1", projectId: "project-1" });
    useTimeTrackerStore.setState({
      projects: { [project.id]: project },
      tasks: { [task.id]: task },
      activeTimer: { taskId: task.id, startedAt: startedAt.toISOString() },
    });

    render(<TimerPanel />);
    screen.getByRole("button", { name: "Detener Sesión" }).click();

    expect(useTimeTrackerStore.getState().activeTimer).toBeNull();
  });
});
