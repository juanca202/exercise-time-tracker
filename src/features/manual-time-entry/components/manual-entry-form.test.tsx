import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ManualEntryForm } from "./manual-entry-form";

const projects = [{ id: "p1", name: "Proyecto A", description: "" }];
const tasks = [{ id: "t1", projectId: "p1", name: "Wireframing" }];

describe("ManualEntryForm", () => {
  it("envía taskId, fecha y duración en segundos al confirmar", async () => {
    const onSubmit = vi.fn().mockReturnValue({ created: true });
    render(
      <ManualEntryForm projects={projects} tasks={tasks} onSubmit={onSubmit} />,
    );

    await userEvent.selectOptions(
      screen.getByLabelText("Proyecto / Tarea"),
      "Wireframing",
    );
    await userEvent.type(screen.getByLabelText("Duración"), "02:30");
    await userEvent.click(
      screen.getByRole("button", { name: "Guardar Registro" }),
    );

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ taskId: "t1", durationSeconds: 9000 }),
    );
  });

  it("muestra un error si el formato de Duración es inválido", async () => {
    const onSubmit = vi.fn();
    render(
      <ManualEntryForm projects={projects} tasks={tasks} onSubmit={onSubmit} />,
    );

    await userEvent.selectOptions(
      screen.getByLabelText("Proyecto / Tarea"),
      "Wireframing",
    );
    await userEvent.type(screen.getByLabelText("Duración"), "abc");
    await userEvent.click(
      screen.getByRole("button", { name: "Guardar Registro" }),
    );

    expect(onSubmit).not.toHaveBeenCalled();
    expect(
      screen.getByText("Ingresa la duración en formato HH:MM."),
    ).toBeInTheDocument();
  });

  it("muestra el error devuelto por onSubmit (p. ej. duración no positiva)", async () => {
    const onSubmit = vi
      .fn()
      .mockReturnValue({ created: false, error: "duration-not-positive" });
    render(
      <ManualEntryForm projects={projects} tasks={tasks} onSubmit={onSubmit} />,
    );

    await userEvent.selectOptions(
      screen.getByLabelText("Proyecto / Tarea"),
      "Wireframing",
    );
    await userEvent.type(screen.getByLabelText("Duración"), "00:00");
    await userEvent.click(
      screen.getByRole("button", { name: "Guardar Registro" }),
    );

    expect(
      screen.getByText("La duración debe ser mayor a 0."),
    ).toBeInTheDocument();
  });
});
