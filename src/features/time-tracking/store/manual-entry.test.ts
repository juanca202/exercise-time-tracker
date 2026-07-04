import { beforeEach, describe, expect, it } from "vitest";
import { createTimeTrackingStore } from "./time-tracking-store";

describe("time-tracking-store: createManualTimeEntry", () => {
  beforeEach(() => {
    localStorage.clear();
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

  it("should_add_a_manual_time_entry_with_the_given_date_and_duration", () => {
    // Arrange
    const { store, task } = storeWithTask();

    // Act
    const entry = store.getState().createManualTimeEntry({
      taskId: task.id,
      date: "2026-01-15",
      durationSeconds: 3600,
    });

    // Assert
    expect(store.getState().timeEntries).toHaveLength(1);
    expect(entry).toMatchObject({
      taskId: task.id,
      date: "2026-01-15",
      durationSeconds: 3600,
      source: "manual",
    });
  });

  it("should_throw_when_duration_is_not_greater_than_zero", () => {
    // Arrange
    const { store, task } = storeWithTask();

    // Act & Assert
    expect(() =>
      store.getState().createManualTimeEntry({
        taskId: task.id,
        date: "2026-01-15",
        durationSeconds: 0,
      }),
    ).toThrow();
  });

  it("should_throw_when_the_task_does_not_exist", () => {
    // Arrange
    const store = createTimeTrackingStore();

    // Act & Assert
    expect(() =>
      store.getState().createManualTimeEntry({
        taskId: "missing",
        date: "2026-01-15",
        durationSeconds: 3600,
      }),
    ).toThrow();
  });
});
