import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { RecentEntriesList } from "./recent-entries-list";
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

describe("RecentEntriesList", () => {
  beforeEach(() => {
    resetStore();
  });

  it("should_render_nothing_when_there_are_no_time_entries", () => {
    // Arrange & Act
    const { container } = render(<RecentEntriesList />);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  it("should_list_recent_entries_with_task_project_and_duration", () => {
    // Arrange
    const project = useTimeTrackingStore
      .getState()
      .createProject({ name: "Proyecto OpenUI" });
    const task = useTimeTrackingStore.getState().createTask({
      projectId: project.id,
      name: "Desarrollo de Componentes UI",
    });
    useTimeTrackingStore.getState().createManualTimeEntry({
      taskId: task.id,
      date: "2026-01-01",
      durationSeconds: 15322,
    });

    // Act
    render(<RecentEntriesList />);

    // Assert
    expect(
      screen.getByText("Desarrollo de Componentes UI"),
    ).toBeInTheDocument();
    expect(screen.getByText("Proyecto OpenUI")).toBeInTheDocument();
    expect(screen.getByText("04:15:22")).toBeInTheDocument();
  });

  it("should_restart_the_timer_for_the_task_when_clicking_the_play_button", async () => {
    // Arrange
    const user = userEvent.setup();
    const project = useTimeTrackingStore
      .getState()
      .createProject({ name: "Proyecto" });
    const task = useTimeTrackingStore.getState().createTask({
      projectId: project.id,
      name: "Tarea",
    });
    useTimeTrackingStore.getState().createManualTimeEntry({
      taskId: task.id,
      date: "2026-01-01",
      durationSeconds: 60,
    });
    render(<RecentEntriesList />);

    // Act
    await user.click(
      screen.getByRole("button", { name: "Reiniciar temporizador de Tarea" }),
    );

    // Assert
    expect(useTimeTrackingStore.getState().activeTimer).toMatchObject({
      taskId: task.id,
    });
  });
});
