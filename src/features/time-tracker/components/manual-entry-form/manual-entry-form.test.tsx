import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { aProject, aTask } from "../../testing/object-mothers";
import {
  initialTimeTrackerState,
  useTimeTrackerStore,
} from "../../store/time-tracker-store";
import { ManualEntryForm } from "./manual-entry-form";

beforeEach(() => {
  useTimeTrackerStore.setState(initialTimeTrackerState);
  localStorage.clear();
  const project = aProject({ id: "project-1", name: "Rediseño" });
  const task = aTask({
    id: "task-1",
    projectId: "project-1",
    name: "Wireframes",
  });
  useTimeTrackerStore.setState({
    projects: { [project.id]: project },
    tasks: { [task.id]: task },
  });
});

describe("ManualEntryForm", () => {
  it("saves a manual entry with the selected task and entered duration", async () => {
    const user = userEvent.setup();
    render(<ManualEntryForm />);

    await user.selectOptions(
      screen.getByLabelText("Proyecto / Tarea"),
      "task-1",
    );
    await user.type(screen.getByLabelText("Duración"), "02:30");
    await user.click(screen.getByRole("button", { name: "Guardar Registro" }));

    const entries = Object.values(useTimeTrackerStore.getState().timeEntries);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      taskId: "task-1",
      durationSeconds: 9000,
      source: "manual",
    });
  });

  it("shows a validation error for an invalid duration", async () => {
    const user = userEvent.setup();
    render(<ManualEntryForm />);

    await user.selectOptions(
      screen.getByLabelText("Proyecto / Tarea"),
      "task-1",
    );
    await user.type(screen.getByLabelText("Duración"), "abc");
    await user.click(screen.getByRole("button", { name: "Guardar Registro" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Ingresa una duración válida en formato HH:MM.",
    );
    expect(
      Object.values(useTimeTrackerStore.getState().timeEntries),
    ).toHaveLength(0);
  });

  it("shows a validation error when no task is selected", async () => {
    const user = userEvent.setup();
    render(<ManualEntryForm />);

    await user.type(screen.getByLabelText("Duración"), "02:30");
    await user.click(screen.getByRole("button", { name: "Guardar Registro" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Selecciona una tarea.",
    );
  });
});
