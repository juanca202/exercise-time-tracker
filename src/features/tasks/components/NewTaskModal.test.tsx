import { useProjectsStore } from "@/features/projects";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useTasksStore } from "../store/tasksStore";
import { NewTaskButton, NewTaskDialog } from "./NewTaskModal";

function renderModal() {
  return render(
    <>
      <NewTaskButton />
      <NewTaskDialog />
    </>,
  );
}

describe("NewTaskModal", () => {
  beforeEach(() => {
    useProjectsStore.setState({
      projects: [
        {
          id: "project-1",
          name: "Proyecto Alfa",
          createdAt: new Date(2026, 6, 1).toISOString(),
        },
      ],
    });
    useTasksStore.setState({ tasks: [], timeEntries: [], activeTimer: null });
  });

  // El handle del diálogo es un singleton a nivel de módulo (ver NewProjectModal.test.tsx).
  afterEach(async () => {
    await userEvent.keyboard("{Escape}");
  });

  it("muestra los campos Proyecto y Nombre, y las acciones Cancelar/Crear Tarea (TC-005)", async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole("button", { name: "Nueva Tarea" }));

    expect(screen.getByRole("dialog", { name: "Nueva Tarea" })).toBeVisible();
    expect(screen.getByLabelText("Proyecto", { exact: true })).toBeVisible();
    expect(screen.getByLabelText("Nombre")).toBeVisible();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Crear Tarea" })).toBeVisible();
  });

  it("crea una Tarea con Nombre asociada a un Proyecto existente (TC-001)", async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole("button", { name: "Nueva Tarea" }));
    await user.click(screen.getByLabelText("Proyecto", { exact: true }));
    await user.click(
      await screen.findByRole("option", { name: "Proyecto Alfa" }),
    );
    await user.type(screen.getByLabelText("Nombre"), "Diseñar wireframes");
    await user.click(screen.getByRole("button", { name: "Crear Tarea" }));

    expect(useTasksStore.getState().tasks).toMatchObject([
      { name: "Diseñar wireframes", projectId: "project-1" },
    ]);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("rechaza la creación sin Nombre y mantiene el modal abierto (TC-002)", async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole("button", { name: "Nueva Tarea" }));
    await user.click(screen.getByLabelText("Proyecto", { exact: true }));
    await user.click(
      await screen.findByRole("option", { name: "Proyecto Alfa" }),
    );
    await user.click(screen.getByRole("button", { name: "Crear Tarea" }));

    expect(screen.getByText("El Nombre es obligatorio.")).toBeVisible();
    expect(screen.getByRole("dialog")).toBeVisible();
    expect(useTasksStore.getState().tasks).toHaveLength(0);
  });

  it("rechaza la creación sin Proyecto asociado (TC-003, BR-01)", async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole("button", { name: "Nueva Tarea" }));
    await user.type(screen.getByLabelText("Nombre"), "Diseñar wireframes");
    await user.click(screen.getByRole("button", { name: "Crear Tarea" }));

    expect(screen.getByText("Seleccioná un Proyecto.")).toBeVisible();
    expect(screen.getByRole("dialog")).toBeVisible();
    expect(useTasksStore.getState().tasks).toHaveLength(0);
  });

  it('cierra el modal sin crear nada al hacer clic en "Cancelar" (TC-006)', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole("button", { name: "Nueva Tarea" }));
    await user.click(screen.getByLabelText("Proyecto", { exact: true }));
    await user.click(
      await screen.findByRole("option", { name: "Proyecto Alfa" }),
    );
    await user.type(screen.getByLabelText("Nombre"), "Diseñar wireframes");
    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(useTasksStore.getState().tasks).toHaveLength(0);
  });
});
