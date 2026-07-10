import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * `vi.resetModules()` + reimport fuerza una instancia de store nueva —tal como ocurre
 * al recargar la página, donde el módulo se reevalúa desde cero— sin tocar `localStorage`.
 * Reutilizar la instancia actual y resetear su estado con `setState` no sirve: ese
 * `setState` pasa por el wrapper de `persist` y reescribe (borra) lo ya guardado.
 */
async function reloadTasksStore() {
  vi.resetModules();
  const { useTasksStore } = await import("./tasksStore");
  return useTasksStore;
}

describe("tasksStore — persistencia real tras recarga", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it("una Tarea creada sigue asociada a su Proyecto tras recargar (AC-002, TC-004)", async () => {
    const { useTasksStore } = await import("./tasksStore");
    const task = useTasksStore
      .getState()
      .addTask("project-1", "Diseñar wireframes");
    expect(task).not.toBeNull();

    const reloadedStore = await reloadTasksStore();
    await reloadedStore.persist.rehydrate();

    expect(reloadedStore.getState().tasks).toMatchObject([
      { projectId: "project-1", name: "Diseñar wireframes" },
    ]);
  });

  it("un Registro de Tiempo manual sigue visible en el historial tras recargar (AC-010, TC-017)", async () => {
    const { useTasksStore } = await import("./tasksStore");
    const entry = useTasksStore
      .getState()
      .addManualTimeEntry("task-1", "2026-07-08", 2 * 60 * 60_000);
    expect(entry).not.toBeNull();

    const reloadedStore = await reloadTasksStore();
    await reloadedStore.persist.rehydrate();

    expect(reloadedStore.getState().timeEntries).toMatchObject([
      { taskId: "task-1", durationMs: 2 * 60 * 60_000, source: "manual" },
    ]);
  });
});
