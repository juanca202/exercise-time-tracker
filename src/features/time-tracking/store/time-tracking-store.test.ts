import { beforeEach, describe, expect, it } from "vitest";
import { createTimeTrackingStore } from "./time-tracking-store";
import { loadState, saveState } from "../lib/storage";
import { aProject, aTask } from "../testing/object-mothers";

describe("time-tracking-store", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("createProject", () => {
    it("should_add_a_project_with_required_name_and_optional_description", () => {
      // Arrange
      const store = createTimeTrackingStore();

      // Act
      const created = store.getState().createProject({
        name: "Rediseño de marca",
        description: "Nuevo logotipo",
      });

      // Assert
      expect(store.getState().projects).toHaveLength(1);
      expect(store.getState().projects[0]).toMatchObject({
        name: "Rediseño de marca",
        description: "Nuevo logotipo",
      });
      expect(created.id).toBeTruthy();
    });

    it("should_persist_the_created_project_to_local_storage", () => {
      // Arrange
      const store = createTimeTrackingStore();

      // Act
      store.getState().createProject({ name: "Proyecto persistido" });

      // Assert
      expect(loadState()?.projects).toHaveLength(1);
      expect(loadState()?.projects[0].name).toBe("Proyecto persistido");
    });

    it("should_throw_when_name_is_empty", () => {
      // Arrange
      const store = createTimeTrackingStore();

      // Act & Assert
      expect(() => store.getState().createProject({ name: "   " })).toThrow();
    });
  });

  describe("createTask", () => {
    it("should_add_a_task_associated_to_an_existing_project", () => {
      // Arrange
      const store = createTimeTrackingStore();
      const project = store.getState().createProject({ name: "Proyecto" });

      // Act
      const created = store.getState().createTask({
        projectId: project.id,
        name: "Tarea 1",
      });

      // Assert
      expect(store.getState().tasks).toHaveLength(1);
      expect(created).toMatchObject({ projectId: project.id, name: "Tarea 1" });
    });

    it("should_throw_when_project_does_not_exist", () => {
      // Arrange
      const store = createTimeTrackingStore();

      // Act & Assert
      expect(() =>
        store.getState().createTask({ projectId: "missing", name: "Tarea" }),
      ).toThrow();
    });

    it("should_throw_when_task_name_is_empty", () => {
      // Arrange
      const store = createTimeTrackingStore();
      const project = store.getState().createProject({ name: "Proyecto" });

      // Act & Assert
      expect(() =>
        store.getState().createTask({ projectId: project.id, name: "" }),
      ).toThrow();
    });
  });

  describe("hydration", () => {
    it("should_hydrate_initial_state_from_previously_persisted_data", () => {
      // Arrange
      const project = aProject();
      const task = aTask();
      saveState({
        projects: [project],
        tasks: [task],
        timeEntries: [],
        activeTimer: null,
      });

      // Act
      const store = createTimeTrackingStore();

      // Assert
      expect(store.getState().projects).toEqual([project]);
      expect(store.getState().tasks).toEqual([task]);
    });

    it("should_start_empty_when_nothing_was_persisted", () => {
      // Arrange
      // (localStorage cleared in beforeEach)

      // Act
      const store = createTimeTrackingStore();

      // Assert
      expect(store.getState().projects).toEqual([]);
      expect(store.getState().tasks).toEqual([]);
      expect(store.getState().timeEntries).toEqual([]);
      expect(store.getState().activeTimer).toBeNull();
    });
  });
});
