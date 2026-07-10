import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useProjectStore } from "@/features/project-management";
import { useTaskTimeTrackingStore } from "../model/task-time-tracking-store";
import { TasksPanel } from "./tasks-panel";

function seedProject() {
  return useProjectStore.getState().createProject({ name: "Proyecto Alfa" });
}

describe("TasksPanel", () => {
  beforeEach(() => {
    localStorage.clear();
    useProjectStore.setState({ projects: [] });
    useTaskTimeTrackingStore.setState({
      tasks: [],
      timeEntries: [],
      activeTimer: null,
    });
  });

  it("muestra el estado vacío cuando no existe ninguna Tarea", () => {
    // Act
    render(<TasksPanel />);

    // Assert
    expect(
      screen.getByText(/todavía no hay tareas creadas/i),
    ).toBeInTheDocument();
  });

  it('presenta el modal "Nueva Tarea" con los campos y acciones esperadas (TC-005)', async () => {
    // Arrange
    seedProject();
    const user = userEvent.setup();
    render(<TasksPanel />);

    // Act
    await user.click(screen.getByRole("button", { name: /nueva tarea/i }));

    // Assert
    expect(
      screen.getByRole("dialog", { name: /nueva tarea/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/^proyecto$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^nombre$/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /cancelar/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /crear tarea/i }),
    ).toBeInTheDocument();
  });

  it('cierra el modal sin crear ninguna Tarea al hacer clic en "Cancelar" (TC-006)', async () => {
    // Arrange
    seedProject();
    const user = userEvent.setup();
    render(<TasksPanel />);
    await user.click(screen.getByRole("button", { name: /nueva tarea/i }));
    await user.selectOptions(
      screen.getByLabelText(/^proyecto$/i),
      "Proyecto Alfa",
    );
    await user.type(screen.getByLabelText(/^nombre$/i), "Diseñar wireframes");

    // Act
    await user.click(screen.getByRole("button", { name: /cancelar/i }));

    // Assert
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(useTaskTimeTrackingStore.getState().tasks).toEqual([]);
  });

  it("crea la Tarea asociada al Proyecto seleccionado (TC-001)", async () => {
    // Arrange
    seedProject();
    const user = userEvent.setup();
    render(<TasksPanel />);
    await user.click(screen.getByRole("button", { name: /nueva tarea/i }));

    // Act
    await user.selectOptions(
      screen.getByLabelText(/^proyecto$/i),
      "Proyecto Alfa",
    );
    await user.type(screen.getByLabelText(/^nombre$/i), "Diseñar wireframes");
    await user.click(screen.getByRole("button", { name: /crear tarea/i }));

    // Assert
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByText("Diseñar wireframes")).toBeInTheDocument();
    expect(useTaskTimeTrackingStore.getState().tasks).toHaveLength(1);
  });

  it("rechaza la creación sin Nombre (TC-002)", async () => {
    // Arrange
    seedProject();
    const user = userEvent.setup();
    render(<TasksPanel />);
    await user.click(screen.getByRole("button", { name: /nueva tarea/i }));

    // Act
    await user.selectOptions(
      screen.getByLabelText(/^proyecto$/i),
      "Proyecto Alfa",
    );
    await user.click(screen.getByRole("button", { name: /crear tarea/i }));

    // Assert
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/el nombre es obligatorio/i)).toBeInTheDocument();
    expect(useTaskTimeTrackingStore.getState().tasks).toEqual([]);
  });

  it("rechaza la creación sin Proyecto seleccionado (TC-003)", async () => {
    // Arrange
    seedProject();
    const user = userEvent.setup();
    render(<TasksPanel />);
    await user.click(screen.getByRole("button", { name: /nueva tarea/i }));

    // Act
    await user.type(screen.getByLabelText(/^nombre$/i), "Diseñar wireframes");
    await user.click(screen.getByRole("button", { name: /crear tarea/i }));

    // Assert
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByText(/debe seleccionar un proyecto/i),
    ).toBeInTheDocument();
    expect(useTaskTimeTrackingStore.getState().tasks).toEqual([]);
  });

  describe("temporizador único", () => {
    beforeEach(() => {
      vi.useFakeTimers({ toFake: ["Date"] });
      vi.setSystemTime(0);
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('no muestra la acción "Detener Sesión" cuando no hay temporizador activo (TC-011)', () => {
      // Arrange
      const project = seedProject();
      useTaskTimeTrackingStore.setState({
        tasks: [
          { id: "task-1", name: "Diseñar wireframes", projectId: project.id },
        ],
      });

      // Act
      render(<TasksPanel />);

      // Assert
      expect(
        screen.queryByRole("button", { name: /detener sesión/i }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /iniciar temporizador/i }),
      ).toBeInTheDocument();
    });

    it("inicia el temporizador y refleja el estado en ejecución en la interfaz (TC-007)", async () => {
      // Arrange
      const project = seedProject();
      useTaskTimeTrackingStore.setState({
        tasks: [
          { id: "task-1", name: "Diseñar wireframes", projectId: project.id },
        ],
      });
      const user = userEvent.setup();
      render(<TasksPanel />);

      // Act
      await user.click(
        screen.getByRole("button", { name: /iniciar temporizador/i }),
      );

      // Assert
      expect(
        screen.getByRole("button", { name: /detener sesión/i }),
      ).toBeInTheDocument();
      expect(screen.getAllByText("Diseñar wireframes").length).toBeGreaterThan(
        0,
      );
      expect(useTaskTimeTrackingStore.getState().activeTimer?.taskId).toBe(
        "task-1",
      );
    });

    it('detiene el temporizador activo con "Detener Sesión" (TC-010)', async () => {
      // Arrange
      const project = seedProject();
      useTaskTimeTrackingStore.setState({
        tasks: [
          { id: "task-1", name: "Diseñar wireframes", projectId: project.id },
        ],
        activeTimer: { taskId: "task-1", startedAt: 0 },
      });
      vi.setSystemTime(90 * 1000);
      const user = userEvent.setup();
      render(<TasksPanel />);

      // Act
      await user.click(screen.getByRole("button", { name: /detener sesión/i }));

      // Assert
      expect(useTaskTimeTrackingStore.getState().activeTimer).toBeNull();
      expect(useTaskTimeTrackingStore.getState().timeEntries).toHaveLength(1);
    });

    it("muestra el reloj en vivo de la tarjeta de actividad actual y lo excluye de la lista de Tareas", () => {
      // Arrange
      const project = seedProject();
      useTaskTimeTrackingStore.setState({
        tasks: [
          { id: "task-1", name: "Diseñar wireframes", projectId: project.id },
          { id: "task-2", name: "Revisar backlog", projectId: project.id },
        ],
        activeTimer: { taskId: "task-1", startedAt: 0 },
      });
      vi.setSystemTime(65 * 1000);

      // Act
      render(<TasksPanel />);

      // Assert
      expect(screen.getByText("0:01:05")).toBeInTheDocument();
      expect(screen.getByText("Revisar backlog")).toBeInTheDocument();
      expect(
        screen.queryByRole("button", {
          name: /iniciar temporizador de diseñar wireframes/i,
        }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Entrada Manual", () => {
    it("crea el Registro de Tiempo manual con Fecha, Proyecto/Tarea y Duración válidas (TC-015)", async () => {
      // Arrange
      const project = seedProject();
      useTaskTimeTrackingStore.setState({
        tasks: [
          { id: "task-1", name: "Diseñar wireframes", projectId: project.id },
        ],
      });
      const user = userEvent.setup();
      render(<TasksPanel />);

      // Act
      await user.type(screen.getByLabelText(/fecha/i), "2026-07-08");
      await user.selectOptions(
        screen.getByLabelText(/proyecto \/ tarea/i),
        "task-1",
      );
      await user.type(screen.getByLabelText(/duración/i), "120");
      await user.click(
        screen.getByRole("button", { name: /guardar registro/i }),
      );

      // Assert
      const entries = useTaskTimeTrackingStore.getState().timeEntries;
      expect(entries).toHaveLength(1);
      expect(entries[0]).toMatchObject({
        taskId: "task-1",
        durationSeconds: 120 * 60,
        source: "manual",
      });
    });

    it("rechaza el registro si falta la Fecha (TC-016)", async () => {
      // Arrange
      const project = seedProject();
      useTaskTimeTrackingStore.setState({
        tasks: [
          { id: "task-1", name: "Diseñar wireframes", projectId: project.id },
        ],
      });
      const user = userEvent.setup();
      render(<TasksPanel />);

      // Act
      await user.selectOptions(
        screen.getByLabelText(/proyecto \/ tarea/i),
        "task-1",
      );
      await user.type(screen.getByLabelText(/duración/i), "120");
      await user.click(
        screen.getByRole("button", { name: /guardar registro/i }),
      );

      // Assert
      expect(screen.getByText(/la fecha es obligatoria/i)).toBeInTheDocument();
      expect(useTaskTimeTrackingStore.getState().timeEntries).toEqual([]);
    });

    it("rechaza el registro si falta la Tarea", async () => {
      // Arrange
      useTaskTimeTrackingStore.setState({
        tasks: [
          {
            id: "task-1",
            name: "Diseñar wireframes",
            projectId: seedProject().id,
          },
        ],
      });
      const user = userEvent.setup();
      render(<TasksPanel />);

      // Act
      await user.type(screen.getByLabelText(/fecha/i), "2026-07-08");
      await user.type(screen.getByLabelText(/duración/i), "120");
      await user.click(
        screen.getByRole("button", { name: /guardar registro/i }),
      );

      // Assert
      expect(
        screen.getByText(/debe seleccionar una tarea/i),
      ).toBeInTheDocument();
      expect(useTaskTimeTrackingStore.getState().timeEntries).toEqual([]);
    });

    it("rechaza una Duración igual a cero (TC-019)", async () => {
      // Arrange
      const project = seedProject();
      useTaskTimeTrackingStore.setState({
        tasks: [
          { id: "task-1", name: "Diseñar wireframes", projectId: project.id },
        ],
      });
      const user = userEvent.setup();
      render(<TasksPanel />);

      // Act
      await user.type(screen.getByLabelText(/fecha/i), "2026-07-08");
      await user.selectOptions(
        screen.getByLabelText(/proyecto \/ tarea/i),
        "task-1",
      );
      await user.type(screen.getByLabelText(/duración/i), "0");
      await user.click(
        screen.getByRole("button", { name: /guardar registro/i }),
      );

      // Assert
      expect(
        screen.getByText(/la duración debe ser mayor que cero/i),
      ).toBeInTheDocument();
      expect(useTaskTimeTrackingStore.getState().timeEntries).toEqual([]);
    });

    it("muestra el nombre de la Tarea sin Proyecto cuando no se encuentra el Proyecto asociado", () => {
      // Arrange
      useTaskTimeTrackingStore.setState({
        tasks: [
          {
            id: "task-1",
            name: "Tarea huérfana",
            projectId: "proyecto-inexistente",
          },
        ],
      });

      // Act
      render(<TasksPanel />);

      // Assert
      expect(
        screen.getByRole("option", { name: "Tarea huérfana" }),
      ).toBeInTheDocument();
    });
  });
});
