import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TaskForm } from "./task-form";

const projects = [
  { id: "p1", name: "Proyecto A", description: "" },
  { id: "p2", name: "Proyecto B", description: "" },
];

describe("TaskForm", () => {
  it('muestra "Nueva Tarea" con el selector de proyectos', () => {
    render(
      <TaskForm
        open
        onOpenChange={vi.fn()}
        projects={projects}
        onSubmit={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Nueva Tarea" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Proyecto A")).toBeInTheDocument();
    expect(screen.getByText("Proyecto B")).toBeInTheDocument();
  });

  it('muestra "Editar Tarea" con los valores existentes', () => {
    render(
      <TaskForm
        open
        onOpenChange={vi.fn()}
        projects={projects}
        onSubmit={vi.fn()}
        initialValues={{ projectId: "p2", name: "Original" }}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Editar Tarea" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre")).toHaveValue("Original");
  });

  it("envía el Proyecto y el Nombre recortado al confirmar", async () => {
    const onSubmit = vi.fn();
    render(
      <TaskForm
        open
        onOpenChange={vi.fn()}
        projects={projects}
        onSubmit={onSubmit}
      />,
    );

    await userEvent.selectOptions(
      screen.getByLabelText("Proyecto"),
      "Proyecto B",
    );
    await userEvent.type(screen.getByLabelText("Nombre"), "  Wireframing  ");
    await userEvent.click(screen.getByRole("button", { name: "Crear Tarea" }));

    expect(onSubmit).toHaveBeenCalledWith({
      projectId: "p2",
      name: "Wireframing",
    });
  });
});
