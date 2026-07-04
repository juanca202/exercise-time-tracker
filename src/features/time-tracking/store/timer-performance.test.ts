import { beforeEach, describe, expect, it } from "vitest";
import { createTimeTrackingStore } from "./time-tracking-store";

/**
 * RP-001/RP-002: iniciar y detener el temporizador deben completarse en
 * menos de 1 segundo desde la acción del usuario. Estas pruebas miden el
 * tiempo real de ejecución (sin temporizadores simulados) de las acciones
 * del store, que son síncronas y en memoria.
 */
describe("time-tracking-store: timer performance (RP-001/RP-002)", () => {
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

  it("should_start_the_timer_in_under_one_second", () => {
    // Arrange
    const { store, task } = storeWithTask();

    // Act
    const start = Date.now();
    store.getState().startTimer(task.id);
    const elapsedMs = Date.now() - start;

    // Assert
    expect(elapsedMs).toBeLessThan(1000);
  });

  it("should_stop_the_timer_and_persist_the_entry_in_under_one_second", () => {
    // Arrange
    const { store, task } = storeWithTask();
    store.getState().startTimer(task.id);

    // Act
    const start = Date.now();
    store.getState().stopTimer();
    const elapsedMs = Date.now() - start;

    // Assert
    expect(elapsedMs).toBeLessThan(1000);
  });
});
