import { describe, expect, it } from "vitest";
import { monthTotalSeconds, totalsByProject, totalsByTask } from "./totals";
import { aProject, aTask, aTimeEntry } from "../testing/object-mothers";

/**
 * RP-003: la visualización de reportes debe cargar en menos de 2 segundos
 * para un volumen de datos razonable (~1000 registros). Esta prueba mide el
 * tiempo real de las agregaciones (por tarea, por proyecto y por mes) sobre
 * 1000 Registros de Tiempo repartidos entre varios proyectos y tareas.
 */
describe("reporting performance with 1000 time entries (RP-003)", () => {
  it("should_compute_all_totals_for_1000_entries_in_under_two_seconds", () => {
    // Arrange
    const projects = Array.from({ length: 8 }, (_, i) =>
      aProject({ id: `p${i}`, name: `Proyecto ${i}` }),
    );
    const tasks = Array.from({ length: 40 }, (_, i) =>
      aTask({ id: `t${i}`, projectId: `p${i % 8}`, name: `Tarea ${i}` }),
    );
    const timeEntries = Array.from({ length: 1000 }, (_, i) =>
      aTimeEntry({
        id: `e${i}`,
        taskId: `t${i % 40}`,
        date: `2026-${String((i % 12) + 1).padStart(2, "0")}-01`,
        durationSeconds: 60 + i,
      }),
    );

    // Act
    const start = Date.now();
    totalsByTask(tasks, timeEntries);
    totalsByProject(projects, tasks, timeEntries);
    monthTotalSeconds(timeEntries, 2026, 1);
    const elapsedMs = Date.now() - start;

    // Assert
    expect(elapsedMs).toBeLessThan(2000);
  });
});
