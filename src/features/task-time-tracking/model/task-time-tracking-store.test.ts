import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTaskTimeTrackingStore } from "./task-time-tracking-store";

function aTaskInput(
  overrides: Partial<{ name: string; projectId: string }> = {},
) {
  return {
    name: "Diseñar wireframes",
    projectId: "project-alfa",
    ...overrides,
  };
}

function resetStore() {
  useTaskTimeTrackingStore.setState({
    tasks: [],
    timeEntries: [],
    activeTimer: null,
  });
}

describe("useTaskTimeTrackingStore", () => {
  beforeEach(() => {
    localStorage.clear();
    resetStore();
  });

  describe("createTask", () => {
    it("crea una Tarea asociada a un Proyecto (TC-001)", () => {
      // Arrange
      const input = aTaskInput();

      // Act
      const task = useTaskTimeTrackingStore.getState().createTask(input);

      // Assert
      expect(task.name).toBe("Diseñar wireframes");
      expect(task.projectId).toBe("project-alfa");
      expect(useTaskTimeTrackingStore.getState().tasks).toEqual([task]);
    });

    it("rechaza la creación con Nombre vacío (TC-002)", () => {
      // Arrange
      const input = aTaskInput({ name: "   " });

      // Act & Assert
      expect(() =>
        useTaskTimeTrackingStore.getState().createTask(input),
      ).toThrow("El nombre de la tarea es obligatorio");
      expect(useTaskTimeTrackingStore.getState().tasks).toEqual([]);
    });

    it("rechaza la creación sin Proyecto asociado (TC-003)", () => {
      // Arrange
      const input = aTaskInput({ projectId: "" });

      // Act & Assert
      expect(() =>
        useTaskTimeTrackingStore.getState().createTask(input),
      ).toThrow("Debe seleccionar un Proyecto");
      expect(useTaskTimeTrackingStore.getState().tasks).toEqual([]);
    });

    it("persiste la Tarea y su asociación al Proyecto en localStorage (TC-004)", async () => {
      // Arrange
      const input = aTaskInput();

      // Act
      const task = useTaskTimeTrackingStore.getState().createTask(input);
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Assert
      const stored = JSON.parse(
        localStorage.getItem("time-tracker:tasks") ?? "{}",
      );
      expect(stored.state.tasks).toEqual([task]);
    });
  });

  describe("startTimer / stopTimer", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(0);
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("inicia el temporizador de una Tarea (TC-007)", () => {
      // Act
      useTaskTimeTrackingStore.getState().startTimer("task-1");

      // Assert
      expect(useTaskTimeTrackingStore.getState().activeTimer).toEqual({
        taskId: "task-1",
        startedAt: 0,
      });
    });

    it("no hace nada al iniciar el temporizador de la Tarea que ya está en ejecución", () => {
      // Arrange
      useTaskTimeTrackingStore.getState().startTimer("task-1");
      vi.setSystemTime(5000);

      // Act
      useTaskTimeTrackingStore.getState().startTimer("task-1");

      // Assert
      expect(useTaskTimeTrackingStore.getState().activeTimer).toEqual({
        taskId: "task-1",
        startedAt: 0,
      });
      expect(useTaskTimeTrackingStore.getState().timeEntries).toEqual([]);
    });

    it("detiene y persiste el Registro de Tiempo al reemplazar el temporizador activo (TC-008)", () => {
      // Arrange
      useTaskTimeTrackingStore.getState().startTimer("task-1");
      vi.setSystemTime(5000);

      // Act
      useTaskTimeTrackingStore.getState().startTimer("task-2");

      // Assert
      const state = useTaskTimeTrackingStore.getState();
      expect(state.activeTimer).toEqual({ taskId: "task-2", startedAt: 5000 });
      expect(state.timeEntries).toEqual([
        {
          id: expect.any(String),
          taskId: "task-1",
          startedAt: 0,
          endedAt: 5000,
          durationSeconds: 5,
          source: "timer",
        },
      ]);
    });

    it("reemplaza el temporizador con Duración mínima válida de 1 segundo (TC-009)", () => {
      // Arrange
      useTaskTimeTrackingStore.getState().startTimer("task-1");
      vi.setSystemTime(1000);

      // Act
      useTaskTimeTrackingStore.getState().startTimer("task-2");

      // Assert
      const state = useTaskTimeTrackingStore.getState();
      expect(state.timeEntries).toHaveLength(1);
      expect(state.timeEntries[0].durationSeconds).toBe(1);
      expect(state.activeTimer?.taskId).toBe("task-2");
    });

    it("no persiste ningún Registro cuando el reemplazo ocurre con Duración cero, pero igual inicia el nuevo temporizador", () => {
      // Arrange
      useTaskTimeTrackingStore.getState().startTimer("task-1");

      // Act (mismo instante exacto)
      useTaskTimeTrackingStore.getState().startTimer("task-2");

      // Assert
      const state = useTaskTimeTrackingStore.getState();
      expect(state.timeEntries).toEqual([]);
      expect(state.activeTimer).toEqual({ taskId: "task-2", startedAt: 0 });
    });

    it("detiene el temporizador activo y calcula/persiste la Duración (TC-010, TC-012)", () => {
      // Arrange
      useTaskTimeTrackingStore.getState().startTimer("task-1");
      vi.setSystemTime(90 * 1000);

      // Act
      const entry = useTaskTimeTrackingStore.getState().stopTimer();

      // Assert
      expect(entry).toEqual({
        id: expect.any(String),
        taskId: "task-1",
        startedAt: 0,
        endedAt: 90 * 1000,
        durationSeconds: 90,
        source: "timer",
      });
      expect(useTaskTimeTrackingStore.getState().activeTimer).toBeNull();
      expect(useTaskTimeTrackingStore.getState().timeEntries).toEqual([entry]);
    });

    it("rechaza detener cuando no hay temporizador activo (TC-011)", () => {
      // Act & Assert
      expect(() => useTaskTimeTrackingStore.getState().stopTimer()).toThrow(
        "No hay ningún temporizador activo",
      );
    });

    it("rechaza y no persiste un Registro con Duración igual a cero (TC-013)", () => {
      // Arrange
      useTaskTimeTrackingStore.getState().startTimer("task-1");

      // Act & Assert (mismo instante: Hora Fin === Hora Inicio)
      expect(() => useTaskTimeTrackingStore.getState().stopTimer()).toThrow(
        "La duración del temporizador debe ser mayor que cero",
      );
      expect(useTaskTimeTrackingStore.getState().activeTimer).toBeNull();
      expect(useTaskTimeTrackingStore.getState().timeEntries).toEqual([]);
    });

    it("persiste el Registro con la Duración mínima válida de 1 segundo (TC-014)", () => {
      // Arrange
      useTaskTimeTrackingStore.getState().startTimer("task-1");
      vi.setSystemTime(1000);

      // Act
      const entry = useTaskTimeTrackingStore.getState().stopTimer();

      // Assert
      expect(entry.durationSeconds).toBe(1);
    });
  });

  describe("addManualTimeEntry", () => {
    it("crea el Registro de Tiempo manual con Fecha, Tarea y Duración válidas (TC-015)", () => {
      // Arrange
      const input = {
        taskId: "task-1",
        date: "2026-07-08",
        durationMinutes: 120,
      };

      // Act
      const entry = useTaskTimeTrackingStore
        .getState()
        .addManualTimeEntry(input);

      // Assert
      expect(entry.taskId).toBe("task-1");
      expect(entry.durationSeconds).toBe(120 * 60);
      expect(entry.source).toBe("manual");
      expect(useTaskTimeTrackingStore.getState().timeEntries).toEqual([entry]);
    });

    it("persiste el Registro de Tiempo manual en localStorage (TC-017)", async () => {
      // Arrange
      const input = {
        taskId: "task-1",
        date: "2026-07-08",
        durationMinutes: 120,
      };

      // Act
      const entry = useTaskTimeTrackingStore
        .getState()
        .addManualTimeEntry(input);
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Assert
      const stored = JSON.parse(
        localStorage.getItem("time-tracker:tasks") ?? "{}",
      );
      expect(stored.state.timeEntries).toEqual([entry]);
    });

    it("rechaza el registro si falta la Fecha (TC-016)", () => {
      // Arrange
      const input = { taskId: "task-1", date: "", durationMinutes: 120 };

      // Act & Assert
      expect(() =>
        useTaskTimeTrackingStore.getState().addManualTimeEntry(input),
      ).toThrow("La fecha es obligatoria");
    });

    it("rechaza el registro si falta la Tarea", () => {
      // Arrange
      const input = { taskId: "", date: "2026-07-08", durationMinutes: 120 };

      // Act & Assert
      expect(() =>
        useTaskTimeTrackingStore.getState().addManualTimeEntry(input),
      ).toThrow("Debe seleccionar una Tarea");
    });

    it("rechaza una Duración negativa (TC-018)", () => {
      // Arrange
      const input = {
        taskId: "task-1",
        date: "2026-07-08",
        durationMinutes: -60,
      };

      // Act & Assert
      expect(() =>
        useTaskTimeTrackingStore.getState().addManualTimeEntry(input),
      ).toThrow("La duración debe ser mayor que cero");
    });

    it("rechaza una Duración igual a cero (TC-019)", () => {
      // Arrange
      const input = {
        taskId: "task-1",
        date: "2026-07-08",
        durationMinutes: 0,
      };

      // Act & Assert
      expect(() =>
        useTaskTimeTrackingStore.getState().addManualTimeEntry(input),
      ).toThrow("La duración debe ser mayor que cero");
    });

    it("acepta la Duración mínima válida de 1 minuto (TC-020)", () => {
      // Arrange
      const input = {
        taskId: "task-1",
        date: "2026-07-08",
        durationMinutes: 1,
      };

      // Act
      const entry = useTaskTimeTrackingStore
        .getState()
        .addManualTimeEntry(input);

      // Assert
      expect(entry.durationSeconds).toBe(60);
    });
  });

  describe("rendimiento", () => {
    beforeEach(() => {
      vi.useFakeTimers({ toFake: ["Date"] });
      vi.setSystemTime(0);
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("inicia el temporizador en menos de 1 segundo de tiempo real de ejecución (TC-021)", () => {
      // Act
      const start = performance.now();
      useTaskTimeTrackingStore.getState().startTimer("task-1");
      const elapsedMs = performance.now() - start;

      // Assert
      expect(elapsedMs).toBeLessThan(1000);
      expect(useTaskTimeTrackingStore.getState().activeTimer?.taskId).toBe(
        "task-1",
      );
    });

    it("detiene el temporizador y persiste el registro en menos de 1 segundo de tiempo real de ejecución (TC-022)", () => {
      // Arrange
      useTaskTimeTrackingStore.getState().startTimer("task-1");
      vi.setSystemTime(90 * 1000);

      // Act
      const start = performance.now();
      useTaskTimeTrackingStore.getState().stopTimer();
      const elapsedMs = performance.now() - start;

      // Assert
      expect(elapsedMs).toBeLessThan(1000);
      expect(useTaskTimeTrackingStore.getState().timeEntries).toHaveLength(1);
    });
  });
});
