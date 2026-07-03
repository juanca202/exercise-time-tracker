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
