import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useProjectStore } from "@/shared/store/use-project-store";
import { useTaskStore } from "@/shared/store/use-task-store";
import { useProjectActions } from "./use-project-actions";

function resetStores() {
  useProjectStore.setState({ projects: [] });
  useTaskStore.setState({ tasks: [] });
}

describe("useProjectActions", () => {
  beforeEach(() => {
    resetStores();
  });

  it("crea un Proyecto", () => {
    const { result } = renderHook(() => useProjectActions());

    act(() => {
      result.current.createProject({ name: "Nuevo", description: "Desc" });
    });

    expect(useProjectStore.getState().projects).toHaveLength(1);
    expect(useProjectStore.getState().projects[0].name).toBe("Nuevo");
  });

  it("edita un Proyecto existente", () => {
    const { result } = renderHook(() => useProjectActions());
    const project = useProjectStore
      .getState()
      .createProject({ name: "Original", description: "" });

    act(() => {
      result.current.updateProject(project.id, {
        name: "Editado",
        description: "Nueva desc",
      });
    });

    expect(useProjectStore.getState().projects[0]).toEqual({
      id: project.id,
      name: "Editado",
      description: "Nueva desc",
    });
  });

  it("elimina un Proyecto que no tiene Tareas asociadas", () => {
    const project = useProjectStore
      .getState()
      .createProject({ name: "Sin tareas", description: "" });
    const { result } = renderHook(() => useProjectActions());

    let deleteResult: ReturnType<typeof result.current.deleteProject>;
    act(() => {
      deleteResult = result.current.deleteProject(project.id);
    });

    expect(deleteResult!).toEqual({ deleted: true });
    expect(useProjectStore.getState().projects).toEqual([]);
  });

  it("bloquea la eliminación de un Proyecto con Tareas asociadas", () => {
    const project = useProjectStore
      .getState()
      .createProject({ name: "Con tareas", description: "" });
    useTaskStore.getState().createTask({ projectId: project.id, name: "T1" });
    useTaskStore.getState().createTask({ projectId: project.id, name: "T2" });
    const { result } = renderHook(() => useProjectActions());

    let deleteResult: ReturnType<typeof result.current.deleteProject>;
    act(() => {
      deleteResult = result.current.deleteProject(project.id);
    });

    expect(deleteResult!).toEqual({ deleted: false, blockedByTaskCount: 2 });
    expect(useProjectStore.getState().projects).toHaveLength(1);
  });

  it("cuenta las Tareas asociadas a un Proyecto", () => {
    const project = useProjectStore
      .getState()
      .createProject({ name: "P", description: "" });
    useTaskStore.getState().createTask({ projectId: project.id, name: "T1" });

    const { result } = renderHook(() => useProjectActions());

    expect(result.current.countTasksForProject(project.id)).toBe(1);
    expect(result.current.countTasksForProject("otro-id")).toBe(0);
  });
});
