import { beforeEach, describe, expect, it } from "vitest";
import {
  initialTimeTrackerState,
  useTimeTrackerStore,
} from "./time-tracker-store";

beforeEach(() => {
  useTimeTrackerStore.setState(initialTimeTrackerState);
  localStorage.clear();
});

describe("createProject", () => {
  it("adds a project with a trimmed name", () => {
    const project = useTimeTrackerStore
      .getState()
      .createProject({ name: "  Rebranding  " });

    expect(project.name).toBe("Rebranding");
    expect(useTimeTrackerStore.getState().projects[project.id]).toEqual(
      project,
    );
  });

  it("persists the project to localStorage", () => {
    useTimeTrackerStore.getState().createProject({ name: "Rebranding" });

    const raw = localStorage.getItem("time-tracker:v1");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw as string);
    expect(Object.values(parsed.state.projects)).toHaveLength(1);
  });

  it("throws when the name is empty", () => {
    expect(() =>
      useTimeTrackerStore.getState().createProject({ name: "   " }),
    ).toThrow("El nombre del proyecto es obligatorio.");
  });
});

describe("createTask", () => {
  it("adds a task linked to an existing project", () => {
    const project = useTimeTrackerStore
      .getState()
      .createProject({ name: "Rebranding" });
    const task = useTimeTrackerStore
      .getState()
      .createTask({ projectId: project.id, name: "Wireframes" });

    expect(task.projectId).toBe(project.id);
    expect(useTimeTrackerStore.getState().tasks[task.id]).toEqual(task);
  });

  it("throws when the name is empty", () => {
    const project = useTimeTrackerStore
      .getState()
      .createProject({ name: "Rebranding" });
    expect(() =>
      useTimeTrackerStore
        .getState()
        .createTask({ projectId: project.id, name: " " }),
    ).toThrow("El nombre de la tarea es obligatorio.");
  });

  it("throws when the project does not exist", () => {
    expect(() =>
      useTimeTrackerStore
        .getState()
        .createTask({ projectId: "missing", name: "Wireframes" }),
    ).toThrow("El proyecto no existe.");
  });
});

describe("startTimer / stopTimer", () => {
  it("starts a timer for an existing task", () => {
    const project = useTimeTrackerStore
      .getState()
      .createProject({ name: "Rebranding" });
    const task = useTimeTrackerStore
      .getState()
      .createTask({ projectId: project.id, name: "Wireframes" });
    const startedAt = new Date("2026-07-02T09:00:00.000Z");

    useTimeTrackerStore.getState().startTimer(task.id, startedAt);

    expect(useTimeTrackerStore.getState().activeTimer).toEqual({
      taskId: task.id,
      startedAt: startedAt.toISOString(),
    });
  });

  it("throws when the task does not exist", () => {
    expect(() => useTimeTrackerStore.getState().startTimer("missing")).toThrow(
      "La tarea no existe.",
    );
  });

  it("stops the active timer and records a time entry with the elapsed duration", () => {
    const project = useTimeTrackerStore
      .getState()
      .createProject({ name: "Rebranding" });
    const task = useTimeTrackerStore
      .getState()
      .createTask({ projectId: project.id, name: "Wireframes" });
    const startedAt = new Date("2026-07-02T09:00:00.000Z");
    const stoppedAt = new Date("2026-07-02T09:30:00.000Z");

    useTimeTrackerStore.getState().startTimer(task.id, startedAt);
    useTimeTrackerStore.getState().stopTimer(stoppedAt);

    const entries = Object.values(useTimeTrackerStore.getState().timeEntries);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      taskId: task.id,
      date: "2026-07-02",
      durationSeconds: 1800,
      source: "timer",
    });
    expect(useTimeTrackerStore.getState().activeTimer).toBeNull();
  });

  it("stopping with no active timer is a no-op", () => {
    useTimeTrackerStore
      .getState()
      .stopTimer(new Date("2026-07-02T09:30:00.000Z"));

    expect(useTimeTrackerStore.getState().activeTimer).toBeNull();
    expect(
      Object.values(useTimeTrackerStore.getState().timeEntries),
    ).toHaveLength(0);
  });

  it("discards a zero-duration entry when start and stop happen at the same instant", () => {
    const project = useTimeTrackerStore
      .getState()
      .createProject({ name: "Rebranding" });
    const task = useTimeTrackerStore
      .getState()
      .createTask({ projectId: project.id, name: "Wireframes" });
    const instant = new Date("2026-07-02T09:00:00.000Z");

    useTimeTrackerStore.getState().startTimer(task.id, instant);
    useTimeTrackerStore.getState().stopTimer(instant);

    expect(
      Object.values(useTimeTrackerStore.getState().timeEntries),
    ).toHaveLength(0);
  });

  it("switching to a new timer stops the previous one first (RN-03)", () => {
    const project = useTimeTrackerStore
      .getState()
      .createProject({ name: "Rebranding" });
    const taskA = useTimeTrackerStore
      .getState()
      .createTask({ projectId: project.id, name: "Wireframes" });
    const taskB = useTimeTrackerStore
      .getState()
      .createTask({ projectId: project.id, name: "Revisión" });
    const startA = new Date("2026-07-02T09:00:00.000Z");
    const switchAt = new Date("2026-07-02T09:15:00.000Z");

    useTimeTrackerStore.getState().startTimer(taskA.id, startA);
    useTimeTrackerStore.getState().startTimer(taskB.id, switchAt);

    const entries = Object.values(useTimeTrackerStore.getState().timeEntries);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      taskId: taskA.id,
      durationSeconds: 900,
      source: "timer",
    });
    expect(useTimeTrackerStore.getState().activeTimer).toEqual({
      taskId: taskB.id,
      startedAt: switchAt.toISOString(),
    });
  });
});
