import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createEmptyStateMother,
  createProjectMother,
  createTaskMother,
  createTimeEntryMother,
} from "../testing/object-mothers";
import {
  initialTimeTrackerState as storeInitialState,
  useTimeTrackerStore,
} from "./time-tracker-store";

describe("useTimeTrackerStore — US1", () => {
  beforeEach(() => {
    localStorage.clear();
    useTimeTrackerStore.setState({ ...storeInitialState });
  });

  describe("createProject", () => {
    it("rechaza proyecto sin nombre", () => {
      const result = useTimeTrackerStore.getState().createProject({
        name: "   ",
      });

      expect(result).toEqual({
        ok: false,
        code: "NAME_REQUIRED",
        message: "El nombre es obligatorio",
      });
      expect(useTimeTrackerStore.getState().projects).toHaveLength(0);
    });

    it("crea proyecto con nombre y descripción opcional", () => {
      const result = useTimeTrackerStore.getState().createProject({
        name: " Quantum Redesign ",
        description: " Rebranding ",
      });

      expect(result).toEqual({ ok: true });
      expect(useTimeTrackerStore.getState().projects).toHaveLength(1);
      expect(useTimeTrackerStore.getState().projects[0]).toMatchObject({
        name: "Quantum Redesign",
        description: "Rebranding",
      });
    });
  });

  describe("createTask", () => {
    it("rechaza tarea si no hay proyectos", () => {
      const result = useTimeTrackerStore.getState().createTask({
        projectId: "missing",
        name: "Nueva tarea",
      });

      expect(result).toEqual({
        ok: false,
        code: "NO_PROJECTS",
        message: "Crea un proyecto antes de añadir tareas",
      });
    });

    it("rechaza tarea sin nombre", () => {
      useTimeTrackerStore.setState({
        ...createEmptyStateMother(),
        projects: [createProjectMother()],
      });

      const result = useTimeTrackerStore.getState().createTask({
        projectId: "project-1",
        name: "  ",
      });

      expect(result).toEqual({
        ok: false,
        code: "NAME_REQUIRED",
        message: "El nombre es obligatorio",
      });
    });

    it("rechaza tarea si el proyecto no existe", () => {
      useTimeTrackerStore.setState({
        ...createEmptyStateMother(),
        projects: [createProjectMother()],
      });

      const result = useTimeTrackerStore.getState().createTask({
        projectId: "unknown",
        name: "Tarea válida",
      });

      expect(result).toEqual({
        ok: false,
        code: "PROJECT_NOT_FOUND",
        message: "Proyecto no encontrado",
      });
    });

    it("crea tarea asociada a un proyecto existente", () => {
      useTimeTrackerStore.setState({
        ...createEmptyStateMother(),
        projects: [createProjectMother()],
      });

      const result = useTimeTrackerStore.getState().createTask({
        projectId: "project-1",
        name: " Desarrollo UI ",
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.taskId).toBe(useTimeTrackerStore.getState().tasks[0].id);
      }
      expect(useTimeTrackerStore.getState().tasks).toHaveLength(1);
      expect(useTimeTrackerStore.getState().tasks[0]).toMatchObject({
        projectId: "project-1",
        name: "Desarrollo UI",
      });
    });
  });

  describe("modals", () => {
    it("abre y cierra modales", () => {
      useTimeTrackerStore.getState().openModal("newProject");
      expect(useTimeTrackerStore.getState().modals.newProject).toBe(true);

      useTimeTrackerStore.getState().closeModal("newProject");
      expect(useTimeTrackerStore.getState().modals.newProject).toBe(false);
    });
  });

  describe("persistencia", () => {
    it("persiste proyectos y tareas en localStorage", () => {
      useTimeTrackerStore.getState().createProject({
        name: "Proyecto Demo",
        description: "Descripción de prueba",
      });
      useTimeTrackerStore.getState().createTask({
        projectId: useTimeTrackerStore.getState().projects[0].id,
        name: "Tarea Demo",
      });

      const raw = localStorage.getItem("time-tracker:v1");
      expect(raw).toBeTruthy();
      expect(raw).toContain("Proyecto Demo");
      expect(raw).toContain("Tarea Demo");
    });
  });
});

describe("useTimeTrackerStore — US2", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-01T10:00:00.000Z"));
    localStorage.clear();
    useTimeTrackerStore.setState({
      ...storeInitialState,
      projects: [createProjectMother()],
      tasks: [createTaskMother()],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("startTimer / stopTimer", () => {
    it("crea TimeEntry source=timer con duración > 0 al detener", () => {
      const { startTimer, stopTimer } = useTimeTrackerStore.getState();

      expect(startTimer({ taskId: "task-1" })).toEqual({ ok: true });
      expect(useTimeTrackerStore.getState().activeTimer).toMatchObject({
        taskId: "task-1",
        startedAt: "2026-06-01T10:00:00.000Z",
      });

      vi.advanceTimersByTime(5 * 60 * 1000);

      expect(stopTimer()).toEqual({ ok: true });
      expect(useTimeTrackerStore.getState().activeTimer).toBeNull();
      expect(useTimeTrackerStore.getState().timeEntries).toHaveLength(1);
      expect(useTimeTrackerStore.getState().timeEntries[0]).toMatchObject({
        taskId: "task-1",
        source: "timer",
        durationMs: 5 * 60 * 1000,
      });
    });

    it("iniciar timer en tarea B detiene automáticamente timer en tarea A", () => {
      const store = useTimeTrackerStore.getState();

      store.startTimer({ taskId: "task-1" });
      vi.advanceTimersByTime(3 * 60 * 1000);

      useTimeTrackerStore.setState({
        tasks: [
          createTaskMother(),
          createTaskMother({ id: "task-2", name: "Tarea B" }),
        ],
      });

      const result = useTimeTrackerStore
        .getState()
        .startTimer({ taskId: "task-2" });
      expect(result).toEqual({ ok: true });

      const state = useTimeTrackerStore.getState();
      expect(state.timeEntries).toHaveLength(1);
      expect(state.timeEntries[0]).toMatchObject({
        taskId: "task-1",
        source: "timer",
        durationMs: 3 * 60 * 1000,
      });
      expect(state.activeTimer).toMatchObject({
        taskId: "task-2",
        startedAt: "2026-06-01T10:03:00.000Z",
      });
    });
  });

  describe("getElapsedMs", () => {
    it("calcula milisegundos transcurridos desde el inicio del timer", () => {
      useTimeTrackerStore.getState().startTimer({ taskId: "task-1" });
      vi.advanceTimersByTime(90 * 1000);

      expect(useTimeTrackerStore.getState().getElapsedMs()).toBe(90 * 1000);
    });

    it("devuelve 0 sin timer activo", () => {
      expect(useTimeTrackerStore.getState().getElapsedMs()).toBe(0);
    });
  });
});

describe("useTimeTrackerStore — US3", () => {
  beforeEach(() => {
    localStorage.clear();
    useTimeTrackerStore.setState({
      ...storeInitialState,
      projects: [createProjectMother()],
      tasks: [createTaskMother()],
    });
  });

  describe("createManualEntry", () => {
    it("persiste entry source=manual con duración válida", () => {
      const result = useTimeTrackerStore.getState().createManualEntry({
        taskId: "task-1",
        date: "2026-06-15",
        durationMs: 90 * 60 * 1000,
      });

      expect(result).toEqual({ ok: true });
      expect(useTimeTrackerStore.getState().timeEntries).toHaveLength(1);
      expect(useTimeTrackerStore.getState().timeEntries[0]).toMatchObject({
        taskId: "task-1",
        date: "2026-06-15",
        source: "manual",
        durationMs: 90 * 60 * 1000,
      });
    });

    it("rechaza duración ≤ 0", () => {
      const result = useTimeTrackerStore.getState().createManualEntry({
        taskId: "task-1",
        date: "2026-06-15",
        durationMs: 0,
      });

      expect(result).toEqual({
        ok: false,
        code: "INVALID_DURATION",
        message: "La duración debe ser mayor que cero",
      });
      expect(useTimeTrackerStore.getState().timeEntries).toHaveLength(0);
    });
  });
});

describe("useTimeTrackerStore — US4", () => {
  beforeEach(() => {
    localStorage.clear();
    useTimeTrackerStore.setState({
      ...storeInitialState,
      projects: [
        createProjectMother({ id: "project-1", name: "Proyecto A" }),
        createProjectMother({ id: "project-2", name: "Proyecto B" }),
      ],
      tasks: [
        createTaskMother({ id: "task-1", projectId: "project-1" }),
        createTaskMother({
          id: "task-2",
          projectId: "project-2",
          name: "Tarea B",
        }),
      ],
      selectedPeriod: { year: 2026, month: 6 },
      timeEntries: [
        createTimeEntryMother({
          id: "e1",
          taskId: "task-1",
          date: "2026-06-01",
          durationMs: 3600000,
          endedAt: "2026-06-01T11:00:00.000Z",
        }),
        createTimeEntryMother({
          id: "e2",
          taskId: "task-2",
          date: "2026-05-15",
          durationMs: 7200000,
          endedAt: "2026-05-15T11:00:00.000Z",
        }),
        createTimeEntryMother({
          id: "e3",
          taskId: "task-1",
          date: "2026-06-10",
          durationMs: 1800000,
          endedAt: "2026-06-10T14:00:00.000Z",
        }),
      ],
    });
  });

  describe("getProjectTotalMs", () => {
    it("respeta selectedPeriod al calcular total por proyecto", () => {
      expect(
        useTimeTrackerStore.getState().getProjectTotalMs("project-1"),
      ).toBe(5400000);
      expect(
        useTimeTrackerStore.getState().getProjectTotalMs("project-2"),
      ).toBe(0);
    });
  });

  describe("getRecentTasks", () => {
    it("ordena por último registro y limita a 5", () => {
      const recent = useTimeTrackerStore.getState().getRecentTasks(5);
      expect(recent).toHaveLength(2);
      expect(recent[0].taskId).toBe("task-1");
      expect(recent[0].lastEntryDurationMs).toBe(1800000);
      expect(recent[1].taskId).toBe("task-2");
    });
  });
});
