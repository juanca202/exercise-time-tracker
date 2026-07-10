import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useTaskTimeTrackingStore } from "@/features/task-time-tracking";
import { useProjectTotalTimeSeconds } from "./use-project-total-time";

describe("useProjectTotalTimeSeconds", () => {
  beforeEach(() => {
    localStorage.clear();
    useTaskTimeTrackingStore.setState({
      tasks: [],
      timeEntries: [],
      activeTimer: null,
    });
  });

  it("suma las duraciones de las Tareas del Proyecto (2h 00m + 1h 30m = 3h 30m)", () => {
    // Arrange
    useTaskTimeTrackingStore.setState({
      tasks: [
        { id: "task-1", name: "Diseño", projectId: "project-1" },
        { id: "task-2", name: "Desarrollo", projectId: "project-1" },
        { id: "task-3", name: "Otro proyecto", projectId: "project-2" },
      ],
      timeEntries: [
        {
          id: "e1",
          taskId: "task-1",
          startedAt: 0,
          endedAt: 0,
          durationSeconds: 2 * 3600,
          source: "timer",
        },
        {
          id: "e2",
          taskId: "task-2",
          startedAt: 0,
          endedAt: 0,
          durationSeconds: 1.5 * 3600,
          source: "manual",
        },
        {
          id: "e3",
          taskId: "task-3",
          startedAt: 0,
          endedAt: 0,
          durationSeconds: 999,
          source: "manual",
        },
      ],
    });

    // Act
    const { result } = renderHook(() =>
      useProjectTotalTimeSeconds("project-1"),
    );

    // Assert
    expect(result.current).toBe(3.5 * 3600);
  });

  it("devuelve 0 cuando el Proyecto no tiene Tareas", () => {
    // Arrange
    useTaskTimeTrackingStore.setState({
      tasks: [],
      timeEntries: [],
      activeTimer: null,
    });

    // Act
    const { result } = renderHook(() =>
      useProjectTotalTimeSeconds("project-sin-tareas"),
    );

    // Assert
    expect(result.current).toBe(0);
  });

  it("devuelve 0 cuando las Tareas del Proyecto no tienen Registros de Tiempo", () => {
    // Arrange
    useTaskTimeTrackingStore.setState({
      tasks: [{ id: "task-1", name: "Diseño", projectId: "project-1" }],
      timeEntries: [],
      activeTimer: null,
    });

    // Act
    const { result } = renderHook(() =>
      useProjectTotalTimeSeconds("project-1"),
    );

    // Assert
    expect(result.current).toBe(0);
  });
});
