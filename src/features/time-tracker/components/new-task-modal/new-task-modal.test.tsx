import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { aProject } from "../../testing/object-mothers";
import {
  initialTimeTrackerState,
  useTimeTrackerStore,
} from "../../store/time-tracker-store";
import { NewTaskModal } from "./new-task-modal";

beforeEach(() => {
  useTimeTrackerStore.setState(initialTimeTrackerState);
  localStorage.clear();
  const project = aProject({ id: "project-1", name: "Rediseño" });
  useTimeTrackerStore.setState({ projects: { [project.id]: project } });
});

describe("NewTaskModal", () => {
  it("creates a task linked to the selected project", async () => {
    const user = userEvent.setup();
    render(<NewTaskModal />);

    await user.click(screen.getByRole("button", { name: "Nueva Tarea" }));
    await user.selectOptions(screen.getByLabelText("Proyecto"), "project-1");
    await user.type(screen.getByLabelText("Nombre"), "Wireframes");
    await user.click(screen.getByRole("button", { name: "Crear Tarea" }));

    const tasks = Object.values(useTimeTrackerStore.getState().tasks);
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toMatchObject({
      projectId: "project-1",
      name: "Wireframes",
    });
  });

  it("shows a validation error when no project is selected", async () => {
    const user = userEvent.setup();
    render(<NewTaskModal />);

    await user.click(screen.getByRole("button", { name: "Nueva Tarea" }));
    await user.type(screen.getByLabelText("Nombre"), "Wireframes");
    await user.click(screen.getByRole("button", { name: "Crear Tarea" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Selecciona un proyecto.",
    );
    expect(Object.values(useTimeTrackerStore.getState().tasks)).toHaveLength(0);
  });
});
