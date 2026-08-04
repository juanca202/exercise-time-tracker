import { beforeEach, describe, expect, it } from "vitest";
import { localStorageAdapter } from "@/shared/persistence/local-storage-adapter";
import { useTaskStore } from "./use-task-store";

function resetStore() {
  useTaskStore.setState({ tasks: [] });
}

describe("useTaskStore", () => {
  beforeEach(() => {
    resetStore();
  });

  it("crea una Tarea asociada a un Proyecto", () => {
    const task = useTaskStore
      .getState()
      .createTask({ projectId: "project-1", name: "Wireframing" });

    expect(useTaskStore.getState().tasks).toEqual([task]);
    expect(task.projectId).toBe("project-1");
    expect(task.name).toBe("Wireframing");
  });

  it("edita el Nombre y reasigna la Tarea a otro Proyecto", () => {
    const task = useTaskStore
      .getState()
      .createTask({ projectId: "project-1", name: "Original" });

    useTaskStore
      .getState()
      .updateTask(task.id, { projectId: "project-2", name: "Editada" });

    expect(useTaskStore.getState().tasks).toEqual([
      { id: task.id, projectId: "project-2", name: "Editada" },
    ]);
  });

  it("elimina una Tarea por id", () => {
    const task = useTaskStore
      .getState()
      .createTask({ projectId: "project-1", name: "A eliminar" });

    useTaskStore.getState().deleteTask(task.id);

    expect(useTaskStore.getState().tasks).toEqual([]);
  });

  it("rehidrata las Tareas persistidas en localStorage tras un reinicio simulado", async () => {
    localStorageAdapter.setItem(
      "tareas",
      JSON.stringify({
        state: {
          tasks: [{ id: "t1", projectId: "project-2", name: "Editada" }],
        },
        version: 0,
      }),
    );

    await useTaskStore.persist.rehydrate();

    expect(useTaskStore.getState().tasks).toEqual([
      { id: "t1", projectId: "project-2", name: "Editada" },
    ]);
  });
});
