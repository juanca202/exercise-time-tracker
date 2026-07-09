import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTasksStore } from "./tasksStore";

describe("tasksStore", () => {
  beforeEach(() => {
    useTasksStore.setState({ tasks: [], timeEntries: [], activeTimer: null });
    localStorage.clear();
  });

  describe("addTask", () => {
    it("crea una Tarea asociada a un Proyecto existente", () => {
      const task = useTasksStore
        .getState()
        .addTask("project-1", "Diseñar wireframes");

      expect(task).not.toBeNull();
      expect(useTasksStore.getState().tasks).toMatchObject([
        { projectId: "project-1", name: "Diseñar wireframes" },
      ]);
    });

    it("rechaza la creación cuando el Nombre está vacío", () => {
      const task = useTasksStore.getState().addTask("project-1", "");

      expect(task).toBeNull();
      expect(useTasksStore.getState().tasks).toHaveLength(0);
    });

    it("rechaza la creación cuando no se seleccionó un Proyecto", () => {
      const task = useTasksStore.getState().addTask("", "Revisar backlog");

      expect(task).toBeNull();
      expect(useTasksStore.getState().tasks).toHaveLength(0);
    });
  });

  describe("startTimer / stopTimer", () => {
    it("inicia el temporizador de una Tarea sin temporizador activo previo", () => {
      useTasksStore.getState().startTimer("task-1");

      expect(useTasksStore.getState().activeTimer?.taskId).toBe("task-1");
      expect(useTasksStore.getState().timeEntries).toHaveLength(0);
    });

    it("detiene el temporizador activo y persiste su Registro de Tiempo", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 6, 8, 9, 0, 0));
      useTasksStore.getState().startTimer("task-1");

      vi.setSystemTime(new Date(2026, 6, 8, 9, 30, 0));
      useTasksStore.getState().stopTimer();

      const { activeTimer, timeEntries } = useTasksStore.getState();
      expect(activeTimer).toBeNull();
      expect(timeEntries).toMatchObject([
        { taskId: "task-1", durationMs: 30 * 60 * 1000, source: "timer" },
      ]);
      vi.useRealTimers();
    });

    it("al iniciar un temporizador en otra Tarea, detiene y persiste el anterior antes de activar el nuevo (BR-02)", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 6, 8, 9, 0, 0));
      useTasksStore.getState().startTimer("task-a");

      vi.setSystemTime(new Date(2026, 6, 8, 9, 5, 0));
      useTasksStore.getState().startTimer("task-b");

      const { activeTimer, timeEntries } = useTasksStore.getState();
      expect(activeTimer?.taskId).toBe("task-b");
      expect(timeEntries).toMatchObject([
        { taskId: "task-a", durationMs: 5 * 60 * 1000 },
      ]);
      vi.useRealTimers();
    });

    it("persiste una duración mínima válida al cambiar de temporizador casi inmediatamente", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 6, 8, 9, 0, 0, 0));
      useTasksStore.getState().startTimer("task-a");

      vi.setSystemTime(new Date(2026, 6, 8, 9, 0, 0, 1));
      useTasksStore.getState().startTimer("task-b");

      const { timeEntries } = useTasksStore.getState();
      expect(timeEntries).toMatchObject([{ taskId: "task-a", durationMs: 1 }]);
      vi.useRealTimers();
    });

    it("no persiste un Registro de Tiempo si la duración calculada es cero", () => {
      const fixedNow = new Date(2026, 6, 8, 9, 0, 0);
      vi.useFakeTimers();
      vi.setSystemTime(fixedNow);
      useTasksStore.getState().startTimer("task-1");
      useTasksStore.getState().stopTimer();

      expect(useTasksStore.getState().timeEntries).toHaveLength(0);
      expect(useTasksStore.getState().activeTimer).toBeNull();
      vi.useRealTimers();
    });

    it("no tiene efecto al detener sin ningún temporizador activo", () => {
      useTasksStore.getState().stopTimer();

      expect(useTasksStore.getState().activeTimer).toBeNull();
      expect(useTasksStore.getState().timeEntries).toHaveLength(0);
    });
  });

  describe("addManualTimeEntry", () => {
    it("crea un Registro de Tiempo manual válido", () => {
      const entry = useTasksStore
        .getState()
        .addManualTimeEntry("task-1", "2026-07-08", 90 * 60 * 1000);

      expect(entry).not.toBeNull();
      expect(useTasksStore.getState().timeEntries).toMatchObject([
        { taskId: "task-1", durationMs: 90 * 60 * 1000, source: "manual" },
      ]);
    });

    it("rechaza cuando falta la Tarea, la Fecha o la Duración", () => {
      expect(
        useTasksStore.getState().addManualTimeEntry("", "2026-07-08", 60_000),
      ).toBeNull();
      expect(
        useTasksStore.getState().addManualTimeEntry("task-1", "", 60_000),
      ).toBeNull();
      expect(useTasksStore.getState().timeEntries).toHaveLength(0);
    });

    it("rechaza una Duración negativa o igual a cero", () => {
      expect(
        useTasksStore.getState().addManualTimeEntry("task-1", "2026-07-08", -1),
      ).toBeNull();
      expect(
        useTasksStore.getState().addManualTimeEntry("task-1", "2026-07-08", 0),
      ).toBeNull();
      expect(useTasksStore.getState().timeEntries).toHaveLength(0);
    });
  });
});
