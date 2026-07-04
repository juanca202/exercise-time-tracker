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

  describe("initial state", () => {
    it("should_always_start_empty_regardless_of_previously_persisted_data", () => {
      // Arrange
      saveState({
        projects: [aProject()],
        tasks: [aTask()],
        timeEntries: [],
        activeTimer: null,
      });

      // Act
      const store = createTimeTrackingStore();

      // Assert: el estado inicial nunca lee localStorage (evita mismatches de hidratación SSR)
      expect(store.getState().projects).toEqual([]);
      expect(store.getState().tasks).toEqual([]);
      expect(store.getState().timeEntries).toEqual([]);
      expect(store.getState().activeTimer).toBeNull();
    });
  });

  describe("hydrate", () => {
    it("should_load_previously_persisted_data_into_the_store", () => {
      // Arrange
      const project = aProject();
      const task = aTask();
      saveState({
        projects: [project],
        tasks: [task],
        timeEntries: [],
        activeTimer: null,
      });
      const store = createTimeTrackingStore();

      // Act
      store.getState().hydrate();

      // Assert
      expect(store.getState().projects).toEqual([project]);
      expect(store.getState().tasks).toEqual([task]);
    });

    it("should_be_a_no_op_when_nothing_was_persisted", () => {
      // Arrange
      const store = createTimeTrackingStore();

      // Act
      store.getState().hydrate();

      // Assert
      expect(store.getState().projects).toEqual([]);
      expect(store.getState().tasks).toEqual([]);
      expect(store.getState().timeEntries).toEqual([]);
      expect(store.getState().activeTimer).toBeNull();
    });
  });
});
