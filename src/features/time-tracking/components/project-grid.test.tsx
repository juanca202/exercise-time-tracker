import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { ProjectGrid } from "./project-grid";
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

describe("ProjectGrid", () => {
  beforeEach(() => {
    resetStore();
  });

  it("should_create_a_project_with_name_and_description", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<ProjectGrid />);

    // Act
    await user.click(
      screen.getByRole("button", { name: "Crear Nuevo Proyecto" }),
    );
    await user.type(
      screen.getByLabelText("Nombre del Proyecto"),
      "Rediseño de marca",
    );
    await user.type(
      screen.getByLabelText("Descripción"),
      "Nuevo logotipo y guía de estilo",
    );
    await user.click(screen.getByRole("button", { name: "Crear Proyecto" }));

    // Assert
    expect(
      screen.getByRole("heading", { name: "Rediseño de marca" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Nuevo logotipo y guía de estilo"),
    ).toBeInTheDocument();
  });

  it("should_block_submission_and_show_an_error_when_name_is_empty", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<ProjectGrid />);

    // Act
    await user.click(
      screen.getByRole("button", { name: "Crear Nuevo Proyecto" }),
    );
    await user.click(screen.getByRole("button", { name: "Crear Proyecto" }));

    // Assert
    expect(
      screen.getByText("El nombre del proyecto es obligatorio."),
    ).toBeInTheDocument();
    expect(useTimeTrackingStore.getState().projects).toHaveLength(0);
  });

  it("should_show_zero_time_for_a_project_without_time_entries", () => {
    // Arrange
    useTimeTrackingStore
      .getState()
      .createProject({ name: "Proyecto sin tiempo" });

    // Act
    render(<ProjectGrid />);

    // Assert
    expect(screen.getByText("0h 00m")).toBeInTheDocument();
  });
});
