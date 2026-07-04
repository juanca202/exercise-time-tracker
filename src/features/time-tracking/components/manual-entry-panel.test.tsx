import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { ManualEntryPanel } from "./manual-entry-panel";
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

describe("ManualEntryPanel", () => {
  beforeEach(() => {
    resetStore();
  });

  it("should_create_a_manual_time_entry_with_a_valid_duration", async () => {
    // Arrange
    const user = userEvent.setup();
    const project = useTimeTrackingStore
      .getState()
      .createProject({ name: "Proyecto" });
    useTimeTrackingStore
      .getState()
      .createTask({ projectId: project.id, name: "Tarea" });
    render(<ManualEntryPanel />);

    // Act
    await user.click(
      screen.getByRole("combobox", { name: "Proyecto / Tarea" }),
    );
    await user.click(
      await screen.findByRole("option", { name: "Proyecto — Tarea" }),
    );
    await user.type(screen.getByLabelText("Duración"), "02:30");
    await user.click(screen.getByRole("button", { name: "Guardar Registro" }));

    // Assert
    const entries = useTimeTrackingStore.getState().timeEntries;
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      durationSeconds: 9000,
      source: "manual",
    });
  });

  it("should_block_submission_and_show_an_error_when_duration_is_invalid", async () => {
    // Arrange
    const user = userEvent.setup();
    const project = useTimeTrackingStore
      .getState()
      .createProject({ name: "Proyecto" });
    useTimeTrackingStore
      .getState()
      .createTask({ projectId: project.id, name: "Tarea" });
    render(<ManualEntryPanel />);

    // Act
    await user.click(
      screen.getByRole("combobox", { name: "Proyecto / Tarea" }),
    );
    await user.click(
      await screen.findByRole("option", { name: "Proyecto — Tarea" }),
    );
    await user.type(screen.getByLabelText("Duración"), "00:00");
    await user.click(screen.getByRole("button", { name: "Guardar Registro" }));

    // Assert
    expect(
      screen.getByText(
        "Ingresa una duración válida mayor a cero (formato HH:MM).",
      ),
    ).toBeInTheDocument();
    expect(useTimeTrackingStore.getState().timeEntries).toHaveLength(0);
  });

  it("should_block_submission_when_no_task_is_selected", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<ManualEntryPanel />);

    // Act
    await user.type(screen.getByLabelText("Duración"), "01:00");
    await user.click(screen.getByRole("button", { name: "Guardar Registro" }));

    // Assert
    expect(
      screen.getByText("Debes seleccionar una Tarea."),
    ).toBeInTheDocument();
    expect(useTimeTrackingStore.getState().timeEntries).toHaveLength(0);
  });
});
