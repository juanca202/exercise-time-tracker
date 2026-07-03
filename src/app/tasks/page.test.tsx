import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import TasksPage from "./page";
import { useTimeTrackingStore } from "@/features/time-tracking/store/time-tracking-store";

function resetStore() {
  localStorage.clear();
  useTimeTrackingStore.setState({
    projects: [],
    tasks: [],
    timeEntries: [],
    activeTimer: null,
  });
}

describe("TasksPage", () => {
  beforeEach(() => {
    resetStore();
  });

  it("should_prompt_to_create_a_project_first_when_there_are_none", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<TasksPage />);

    // Act
    await user.click(screen.getByRole("button", { name: "Nueva Tarea" }));

    // Assert
    expect(
      screen.getByText(/Todavía no tienes ningún Proyecto/),
    ).toBeInTheDocument();
    expect(useTimeTrackingStore.getState().tasks).toHaveLength(0);
  });

  it("should_create_a_task_associated_to_an_existing_project", async () => {
    // Arrange
    const user = userEvent.setup();
    const project = useTimeTrackingStore
      .getState()
      .createProject({ name: "Proyecto OpenUI" });
    render(<TasksPage />);

    // Act
    await user.click(screen.getByRole("button", { name: "Nueva Tarea" }));
    await user.click(screen.getByRole("combobox", { name: "Proyecto" }));
    await user.click(
      await screen.findByRole("option", { name: "Proyecto OpenUI" }),
    );
    await user.type(
      screen.getByLabelText("Nombre"),
      "Desarrollo de Componentes UI",
    );
    await user.click(screen.getByRole("button", { name: "Crear Tarea" }));

    // Assert
    const tasks = useTimeTrackingStore.getState().tasks;
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toMatchObject({
      projectId: project.id,
      name: "Desarrollo de Componentes UI",
    });
  });

  it("should_block_submission_when_no_project_is_selected", async () => {
    // Arrange
    const user = userEvent.setup();
    useTimeTrackingStore.getState().createProject({ name: "Proyecto" });
    render(<TasksPage />);

    // Act
    await user.click(screen.getByRole("button", { name: "Nueva Tarea" }));
    await user.type(screen.getByLabelText("Nombre"), "Tarea sin proyecto");
    await user.click(screen.getByRole("button", { name: "Crear Tarea" }));

    // Assert
    expect(
      screen.getByText("Debes seleccionar un Proyecto existente."),
    ).toBeInTheDocument();
    expect(useTimeTrackingStore.getState().tasks).toHaveLength(0);
  });
});
