import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { useProjectStore } from "@/shared/store/use-project-store";
import { useTaskStore } from "@/shared/store/use-task-store";
import { useTimeEntryStore } from "@/shared/store/use-time-entry-store";
import ProjectsPage from "./page";

function resetStores() {
  useProjectStore.setState({ projects: [] });
  useTaskStore.setState({ tasks: [] });
  useTimeEntryStore.setState({ timeEntries: [] });
}

describe("ProjectsPage", () => {
  beforeEach(() => {
    resetStores();
  });

  it("lista todos los Proyectos existentes junto con la tarjeta de creación (AC-006)", () => {
    useProjectStore
      .getState()
      .createProject({ name: "Rediseño de Marca", description: "Q4" });
    useProjectStore
      .getState()
      .createProject({ name: "Migración a Next.js", description: "" });

    render(<ProjectsPage />);

    expect(screen.getByText("Rediseño de Marca")).toBeInTheDocument();
    expect(screen.getByText("Migración a Next.js")).toBeInTheDocument();
    expect(screen.getByText("Crear Nuevo Proyecto")).toBeInTheDocument();
  });

  it("muestra el aviso de bloqueo al intentar eliminar un Proyecto con Tareas asociadas (AC-005, BR-01)", async () => {
    const project = useProjectStore
      .getState()
      .createProject({ name: "Con Tareas", description: "" });
    useTaskStore
      .getState()
      .createTask({ projectId: project.id, name: "Tarea asociada" });

    render(<ProjectsPage />);

    await userEvent.click(screen.getByRole("button", { name: "Eliminar" }));

    expect(
      screen.getByText(
        'No se puede eliminar "Con Tareas" porque tiene 1 Tarea(s) asociada(s). Elimina o reasigna esas Tareas primero.',
      ),
    ).toBeInTheDocument();
    expect(useProjectStore.getState().projects).toHaveLength(1);
  });

  it("elimina un Proyecto sin Tareas asociadas y lo retira del listado", async () => {
    useProjectStore
      .getState()
      .createProject({ name: "Sin Tareas", description: "" });

    render(<ProjectsPage />);

    await userEvent.click(screen.getByRole("button", { name: "Eliminar" }));

    expect(screen.queryByText("Sin Tareas")).not.toBeInTheDocument();
    expect(useProjectStore.getState().projects).toEqual([]);
  });
});
