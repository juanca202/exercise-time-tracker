import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { useProjectStore } from "@/shared/store/use-project-store";
import { useTaskStore } from "@/shared/store/use-task-store";
import { useTimeEntryStore } from "@/shared/store/use-time-entry-store";
import { useTimerStore } from "@/features/timer/use-timer-store";
import TasksPage from "./page";

function resetStores() {
  useProjectStore.setState({ projects: [] });
  useTaskStore.setState({ tasks: [] });
  useTimeEntryStore.setState({ timeEntries: [] });
  useTimerStore.setState({ activeTimer: null });
}

describe("TasksPage", () => {
  beforeEach(() => {
    resetStores();
  });

  it("muestra el aviso de bloqueo al intentar eliminar una Tarea con Registros de Tiempo asociados (AC-008, BR-06)", async () => {
    const project = useProjectStore
      .getState()
      .createProject({ name: "P1", description: "" });
    const task = useTaskStore
      .getState()
      .createTask({ projectId: project.id, name: "Con Registros" });
    useTimeEntryStore.getState().createTimeEntry({
      taskId: task.id,
      source: "manual",
      date: "2026-07-30",
      durationSeconds: 3600,
    });

    render(<TasksPage />);

    await userEvent.click(screen.getByRole("button", { name: "Eliminar" }));

    expect(
      screen.getByText(
        'No se puede eliminar "Con Registros" porque tiene 1 Registro(s) de Tiempo asociado(s).',
      ),
    ).toBeInTheDocument();
    expect(useTaskStore.getState().tasks).toHaveLength(1);
  });

  it("muestra el aviso de bloqueo al intentar eliminar una Tarea con un temporizador activo", async () => {
    const project = useProjectStore
      .getState()
      .createProject({ name: "P1", description: "" });
    const task = useTaskStore
      .getState()
      .createTask({ projectId: project.id, name: "En Ejecución" });
    useTimerStore.getState().start(task.id);

    render(<TasksPage />);

    await userEvent.click(screen.getByRole("button", { name: "Eliminar" }));

    expect(
      screen.getByText(
        'No se puede eliminar "En Ejecución" porque tiene un temporizador en ejecución.',
      ),
    ).toBeInTheDocument();
    expect(useTaskStore.getState().tasks).toHaveLength(1);
  });

  it("elimina una Tarea sin Registros de Tiempo ni temporizador activo", async () => {
    const project = useProjectStore
      .getState()
      .createProject({ name: "P1", description: "" });
    useTaskStore
      .getState()
      .createTask({ projectId: project.id, name: "Sin Registros" });

    render(<TasksPage />);

    await userEvent.click(screen.getByRole("button", { name: "Eliminar" }));

    expect(screen.queryByText("Sin Registros")).not.toBeInTheDocument();
    expect(useTaskStore.getState().tasks).toEqual([]);
  });
});
