import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ProjectForm } from "./project-form";

describe("ProjectForm", () => {
  it('muestra "Nuevo Proyecto" y campos vacíos en modo creación', () => {
    render(<ProjectForm open onOpenChange={vi.fn()} onSubmit={vi.fn()} />);

    expect(
      screen.getByRole("heading", { name: "Nuevo Proyecto" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre del Proyecto")).toHaveValue("");
  });

  it('muestra "Editar Proyecto" con los valores existentes en modo edición', () => {
    render(
      <ProjectForm
        open
        onOpenChange={vi.fn()}
        onSubmit={vi.fn()}
        initialValues={{ name: "Original", description: "Desc original" }}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Editar Proyecto" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre del Proyecto")).toHaveValue(
      "Original",
    );
    expect(screen.getByLabelText("Descripción")).toHaveValue("Desc original");
  });

  it("envía el Nombre y la Descripción recortados al confirmar", async () => {
    const onSubmit = vi.fn();
    render(<ProjectForm open onOpenChange={vi.fn()} onSubmit={onSubmit} />);

    await userEvent.type(
      screen.getByLabelText("Nombre del Proyecto"),
      "  Nuevo Proyecto  ",
    );
    await userEvent.type(screen.getByLabelText("Descripción"), "  Detalle  ");
    await userEvent.click(
      screen.getByRole("button", { name: "Crear Proyecto" }),
    );

    expect(onSubmit).toHaveBeenCalledWith({
      name: "Nuevo Proyecto",
      description: "Detalle",
    });
  });

  it("no envía el formulario si el Nombre está vacío", async () => {
    const onSubmit = vi.fn();
    render(<ProjectForm open onOpenChange={vi.fn()} onSubmit={onSubmit} />);

    await userEvent.click(
      screen.getByRole("button", { name: "Crear Proyecto" }),
    );

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
