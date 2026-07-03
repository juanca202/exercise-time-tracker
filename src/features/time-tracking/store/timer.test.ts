import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createTimeTrackingStore } from "./time-tracking-store";

describe("time-tracking-store: timer", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T09:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function storeWithTask() {
    const store = createTimeTrackingStore();
    const project = store.getState().createProject({ name: "Proyecto" });
    const task = store.getState().createTask({
      projectId: project.id,
      name: "Tarea",
    });
    return { store, task };
  }

  describe("startTimer", () => {
    it("should_set_the_active_timer_with_the_task_and_start_time", () => {
      // Arrange
      const { store, task } = storeWithTask();

      // Act
      store.getState().startTimer(task.id);

      // Assert
      expect(store.getState().activeTimer).toEqual({
        taskId: task.id,
        startedAt: "2026-01-01T09:00:00.000Z",
      });
    });

    it("should_stop_and_persist_the_previous_timer_when_starting_a_different_task", () => {
      // Arrange
      const store = createTimeTrackingStore();
      const project = store.getState().createProject({ name: "Proyecto" });
      const taskA = store.getState().createTask({
        projectId: project.id,
        name: "Tarea A",
      });
      const taskB = store.getState().createTask({
        projectId: project.id,
        name: "Tarea B",
      });
      store.getState().startTimer(taskA.id);
      vi.setSystemTime(new Date("2026-01-01T09:30:00.000Z"));

      // Act
      store.getState().startTimer(taskB.id);

      // Assert
      expect(store.getState().activeTimer).toEqual({
        taskId: taskB.id,
        startedAt: "2026-01-01T09:30:00.000Z",
      });
      const entries = store.getState().timeEntries;
      expect(entries).toHaveLength(1);
      expect(entries[0]).toMatchObject({
        taskId: taskA.id,
        source: "timer",
        durationSeconds: 1800,
      });
    });

    it("should_be_a_no_op_when_starting_the_same_task_that_is_already_active", () => {
      // Arrange
      const { store, task } = storeWithTask();
      store.getState().startTimer(task.id);
      const firstActiveTimer = store.getState().activeTimer;
      vi.setSystemTime(new Date("2026-01-01T09:15:00.000Z"));

      // Act
      store.getState().startTimer(task.id);

      // Assert
      expect(store.getState().activeTimer).toEqual(firstActiveTimer);
      expect(store.getState().timeEntries).toHaveLength(0);
    });
  });

  describe("stopTimer", () => {
    it("should_be_a_no_op_when_there_is_no_active_timer", () => {
      // Arrange
      const store = createTimeTrackingStore();

      // Act
      store.getState().stopTimer();

      // Assert
      expect(store.getState().activeTimer).toBeNull();
      expect(store.getState().timeEntries).toHaveLength(0);
    });

    it("should_persist_a_timer_time_entry_with_a_positive_duration", () => {
      // Arrange
      const { store, task } = storeWithTask();
      store.getState().startTimer(task.id);
      vi.setSystemTime(new Date("2026-01-01T10:04:04.000Z"));

      // Act
      store.getState().stopTimer();

      // Assert
      expect(store.getState().activeTimer).toBeNull();
      const entries = store.getState().timeEntries;
      expect(entries).toHaveLength(1);
      expect(entries[0]).toMatchObject({
        taskId: task.id,
        source: "timer",
        durationSeconds: 3844,
        startTime: "2026-01-01T09:00:00.000Z",
        endTime: "2026-01-01T10:04:04.000Z",
      });
    });

    it("should_not_persist_a_time_entry_when_the_computed_duration_is_not_positive", () => {
      // Arrange
      const { store, task } = storeWithTask();
      store.getState().startTimer(task.id);
      // el reloj no avanza: duración calculada sería 0

      // Act
      store.getState().stopTimer();

      // Assert
      expect(store.getState().activeTimer).toBeNull();
      expect(store.getState().timeEntries).toHaveLength(0);
    });
  });
});
