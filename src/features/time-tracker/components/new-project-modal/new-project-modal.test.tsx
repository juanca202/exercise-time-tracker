import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import {
  initialTimeTrackerState,
  useTimeTrackerStore,
} from "../../store/time-tracker-store";
import { NewProjectModal } from "./new-project-modal";

beforeEach(() => {
  useTimeTrackerStore.setState(initialTimeTrackerState);
  localStorage.clear();
});

describe("NewProjectModal", () => {
  it("creates a project with the entered name and description", async () => {
    const user = userEvent.setup();
    render(
      <NewProjectModal
        trigger={<button type="button">Nuevo Proyecto</button>}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Nuevo Proyecto" }));
    await user.type(screen.getByLabelText("Nombre del Proyecto"), "Rebranding");
    await user.type(
      screen.getByLabelText("Descripción"),
      "Nueva identidad visual",
    );
    await user.click(screen.getByRole("button", { name: "Crear Proyecto" }));

    const projects = Object.values(useTimeTrackerStore.getState().projects);
    expect(projects).toHaveLength(1);
    expect(projects[0]).toMatchObject({
      name: "Rebranding",
      description: "Nueva identidad visual",
    });
  });

  it("shows a validation error when the name is empty", async () => {
    const user = userEvent.setup();
    render(
      <NewProjectModal
        trigger={<button type="button">Nuevo Proyecto</button>}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Nuevo Proyecto" }));
    await user.click(screen.getByRole("button", { name: "Crear Proyecto" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "El nombre del proyecto es obligatorio.",
    );
    expect(Object.values(useTimeTrackerStore.getState().projects)).toHaveLength(
      0,
    );
  });
});
