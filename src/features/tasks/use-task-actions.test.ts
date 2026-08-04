import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useProjectStore } from "@/shared/store/use-project-store";
import { useTaskStore } from "@/shared/store/use-task-store";
import { useTimeEntryStore } from "@/shared/store/use-time-entry-store";
import { useTaskActions } from "./use-task-actions";

function resetStores() {
  useProjectStore.setState({ projects: [] });
  useTaskStore.setState({ tasks: [] });
  useTimeEntryStore.setState({ timeEntries: [] });
}

describe("useTaskActions", () => {
  beforeEach(() => {
    resetStores();
  });

  it("crea una Tarea asociada a un Proyecto", () => {
    const project = useProjectStore
      .getState()
      .createProject({ name: "P1", description: "" });
    const { result } = renderHook(() => useTaskActions());

    act(() => {
      result.current.createTask({ projectId: project.id, name: "T1" });
    });

    expect(useTaskStore.getState().tasks).toHaveLength(1);
  });

  it("rechaza la creación de una Tarea con un Proyecto inexistente", () => {
    const { result } = renderHook(() => useTaskActions());

    let createResult: ReturnType<typeof result.current.createTask>;
    act(() => {
      createResult = result.current.createTask({
        projectId: "inexistente",
        name: "T1",
      });
    });

    expect(createResult!).toEqual({ created: false, projectNotFound: true });
    expect(useTaskStore.getState().tasks).toEqual([]);
  });

  it("reasigna una Tarea a otro Proyecto existente", () => {
    const projectA = useProjectStore
      .getState()
      .createProject({ name: "A", description: "" });
    const projectB = useProjectStore
      .getState()
      .createProject({ name: "B", description: "" });
    const task = useTaskStore
      .getState()
      .createTask({ projectId: projectA.id, name: "T1" });
    const { result } = renderHook(() => useTaskActions());

    let updateResult: ReturnType<typeof result.current.updateTask>;
    act(() => {
      updateResult = result.current.updateTask(task.id, {
        projectId: projectB.id,
        name: "T1 editada",
      });
    });

    expect(updateResult!).toEqual({ updated: true });
    expect(useTaskStore.getState().tasks[0].projectId).toBe(projectB.id);
  });

  it("rechaza la reasignación a un Proyecto inexistente", () => {
    const project = useProjectStore
      .getState()
      .createProject({ name: "A", description: "" });
    const task = useTaskStore
      .getState()
      .createTask({ projectId: project.id, name: "T1" });
    const { result } = renderHook(() => useTaskActions());

    let updateResult: ReturnType<typeof result.current.updateTask>;
    act(() => {
      updateResult = result.current.updateTask(task.id, {
        projectId: "inexistente",
        name: "T1",
      });
    });

    expect(updateResult!).toEqual({ updated: false, projectNotFound: true });
    expect(useTaskStore.getState().tasks[0].projectId).toBe(project.id);
  });

  it("elimina una Tarea sin Registros de Tiempo asociados", () => {
    const project = useProjectStore
      .getState()
      .createProject({ name: "A", description: "" });
    const task = useTaskStore
      .getState()
      .createTask({ projectId: project.id, name: "T1" });
    const { result } = renderHook(() => useTaskActions());

    let deleteResult: ReturnType<typeof result.current.deleteTask>;
    act(() => {
      deleteResult = result.current.deleteTask(task.id);
    });

    expect(deleteResult!).toEqual({ deleted: true });
    expect(useTaskStore.getState().tasks).toEqual([]);
  });

  it("bloquea la eliminación de una Tarea con Registros de Tiempo asociados", () => {
    const project = useProjectStore
      .getState()
      .createProject({ name: "A", description: "" });
    const task = useTaskStore
      .getState()
      .createTask({ projectId: project.id, name: "T1" });
    useTimeEntryStore.getState().createTimeEntry({
      taskId: task.id,
      source: "manual",
      date: "2026-07-30",
      durationSeconds: 60,
    });
    const { result } = renderHook(() => useTaskActions());

    let deleteResult: ReturnType<typeof result.current.deleteTask>;
    act(() => {
      deleteResult = result.current.deleteTask(task.id);
    });

    expect(deleteResult!).toEqual({
      deleted: false,
      blockedByTimeEntryCount: 1,
    });
    expect(useTaskStore.getState().tasks).toHaveLength(1);
  });

  it("bloquea la eliminación de una Tarea con un temporizador activo", () => {
    const project = useProjectStore
      .getState()
      .createProject({ name: "A", description: "" });
    const task = useTaskStore
      .getState()
      .createTask({ projectId: project.id, name: "T1" });
    const { result } = renderHook(() => useTaskActions());

    let deleteResult: ReturnType<typeof result.current.deleteTask>;
    act(() => {
      deleteResult = result.current.deleteTask(task.id, task.id);
    });

    expect(deleteResult!).toEqual({
      deleted: false,
      blockedByActiveTimer: true,
    });
    expect(useTaskStore.getState().tasks).toHaveLength(1);
  });
});
