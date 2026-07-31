import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { colorFromString } from "@/shared/color-from-string";
import { RecentTasksList } from "./recent-tasks-list";

const projects = [{ id: "p1", name: "Proyecto A", description: "" }];
const tasks = [{ id: "t1", projectId: "p1", name: "Wireframing" }];

describe("RecentTasksList", () => {
  it("muestra el mensaje de lista vacía cuando no hay Tareas", () => {
    render(
      <RecentTasksList
        tasks={[]}
        projects={projects}
        onPlay={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Todavía no creaste ninguna Tarea."),
    ).toBeInTheDocument();
  });

  it("muestra cada Tarea con su Proyecto asociado", () => {
    render(
      <RecentTasksList
        tasks={tasks}
        projects={projects}
        onPlay={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("Wireframing")).toBeInTheDocument();
    expect(screen.getByText("Proyecto A")).toBeInTheDocument();
  });

  it("muestra el cuadro de icono con fondo derivado del nombre de la Tarea", () => {
    render(
      <RecentTasksList
        tasks={tasks}
        projects={projects}
        onPlay={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByTestId("task-icon-badge")).toHaveStyle({
      backgroundColor: colorFromString("Wireframing"),
    });
  });

  it("invoca onPlay al iniciar el temporizador de una Tarea", async () => {
    const onPlay = vi.fn();
    render(
      <RecentTasksList
        tasks={tasks}
        projects={projects}
        onPlay={onPlay}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: "Iniciar temporizador para Wireframing",
      }),
    );

    expect(onPlay).toHaveBeenCalledWith("t1");
  });

  it("invoca onEdit y onDelete con la Tarea correspondiente", async () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(
      <RecentTasksList
        tasks={tasks}
        projects={projects}
        onPlay={vi.fn()}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Editar" }));
    await userEvent.click(screen.getByRole("button", { name: "Eliminar" }));

    expect(onEdit).toHaveBeenCalledWith(tasks[0]);
    expect(onDelete).toHaveBeenCalledWith(tasks[0]);
  });

  it('reemplaza el botón de iniciar por "En ejecución" para la Tarea activa', () => {
    render(
      <RecentTasksList
        tasks={tasks}
        projects={projects}
        activeTaskId="t1"
        onPlay={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("En ejecución")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: "Iniciar temporizador para Wireframing",
      }),
    ).not.toBeInTheDocument();
  });
});
