import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { TimerCard } from "./timer-card";
import { useTimeTrackingStore } from "../store/time-tracking-store";

function resetStore() {
  localStorage.clear();
  useTimeTrackingStore.setState({
    projects: [],
    tasks: [],
    timeEntries: [],
    activeTimer: null,
  });
}

describe("TimerCard", () => {
  beforeEach(() => {
    resetStore();
  });

  it("should_disable_start_when_there_are_no_tasks", () => {
    // Arrange & Act
    render(<TimerCard />);

    // Assert
    expect(screen.getByRole("button", { name: "Iniciar" })).toBeDisabled();
  });

  it("should_show_the_active_task_after_starting_the_timer", async () => {
    // Arrange
    const user = userEvent.setup();
    const project = useTimeTrackingStore
      .getState()
      .createProject({ name: "Brand Redesign" });
    useTimeTrackingStore.getState().createTask({
      projectId: project.id,
      name: "Refinando Logotipos",
    });
    render(<TimerCard />);

    // Act
    await user.click(screen.getByRole("combobox", { name: "Tarea" }));
    await user.click(
      await screen.findByRole("option", {
        name: "Brand Redesign — Refinando Logotipos",
      }),
    );
    await user.click(screen.getByRole("button", { name: "Iniciar" }));

    // Assert
    expect(
      screen.getByText("Brand Redesign — Refinando Logotipos"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Detener Sesión" }),
    ).toBeInTheDocument();
  });

  it("should_show_the_elapsed_time_since_the_timer_started", () => {
    // Arrange
    const project = useTimeTrackingStore
      .getState()
      .createProject({ name: "Proyecto" });
    const task = useTimeTrackingStore.getState().createTask({
      projectId: project.id,
      name: "Tarea",
    });
    useTimeTrackingStore.setState({
      activeTimer: {
        taskId: task.id,
        startedAt: new Date(Date.now() - 65_000).toISOString(),
      },
    });

    // Act
    render(<TimerCard />);

    // Assert
    expect(screen.getByText("00:01:05")).toBeInTheDocument();
  });

  it("should_stop_the_timer_and_persist_a_time_entry_when_clicking_stop", async () => {
    // Arrange
    const user = userEvent.setup();
    const project = useTimeTrackingStore
      .getState()
      .createProject({ name: "Proyecto" });
    const task = useTimeTrackingStore.getState().createTask({
      projectId: project.id,
      name: "Tarea",
    });
    useTimeTrackingStore.setState({
      activeTimer: {
        taskId: task.id,
        startedAt: new Date(Date.now() - 60_000).toISOString(),
      },
    });
    render(<TimerCard />);

    // Act
    await user.click(screen.getByRole("button", { name: "Detener Sesión" }));

    // Assert
    expect(useTimeTrackingStore.getState().activeTimer).toBeNull();
    expect(useTimeTrackingStore.getState().timeEntries).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Iniciar" })).toBeInTheDocument();
  });
});
