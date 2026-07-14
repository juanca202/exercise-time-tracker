import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  crearProyecto,
  crearRegistroDeTiempo,
  crearTarea,
} from "@/shared/testing/objectMother";

describe("useHistorialRegistros", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it("TC-001: expone las filas del historial completo con Tarea y Proyecto resueltos", async () => {
    // Arrange
    const { useTimeTrackerStore } =
      await import("@/shared/store/useTimeTrackerStore");
    const { useHistorialRegistros } = await import("./useHistorialRegistros");
    const proyectoAlfa = crearProyecto({ id: "P-1", nombre: "Alfa" });
    const tareaDiseno = crearTarea({
      id: "T-1",
      nombre: "Diseño UI",
      proyectoId: "P-1",
    });
    useTimeTrackerStore.getState().establecerProyectos([proyectoAlfa]);
    useTimeTrackerStore.getState().establecerTareas([tareaDiseno]);
    useTimeTrackerStore
      .getState()
      .establecerRegistrosDeTiempo([
        crearRegistroDeTiempo({ tareaId: "T-1", duracion: 90 }),
        crearRegistroDeTiempo({ tareaId: "T-1", duracion: 45 }),
      ]);

    // Act
    const { result } = renderHook(() => useHistorialRegistros());
    await waitFor(() => expect(result.current.hasHydrated).toBe(true));

    // Assert
    expect(result.current.filas).toHaveLength(2);
    expect(result.current.filas[0].tarea.nombre).toBe("Diseño UI");
    expect(result.current.filas[0].proyecto?.nombre).toBe("Alfa");
    expect(result.current.totalesPorTarea.get("T-1")).toBe(135);
  });

  it("TC-003: con el store vacío, no hay filas ni totales espurios", async () => {
    // Arrange
    const { useHistorialRegistros } = await import("./useHistorialRegistros");

    // Act
    const { result } = renderHook(() => useHistorialRegistros());
    await waitFor(() => expect(result.current.hasHydrated).toBe(true));

    // Assert
    expect(result.current.filas).toEqual([]);
    expect(result.current.totalesPorTarea.size).toBe(0);
    expect(result.current.totalesPorProyecto.size).toBe(0);
    expect(result.current.totalesPorMes.size).toBe(0);
  });

  it("filtra de la lista un Registro cuya Tarea ya no existe, sin lanzar excepción", async () => {
    // Arrange
    const { useTimeTrackerStore } =
      await import("@/shared/store/useTimeTrackerStore");
    const { useHistorialRegistros } = await import("./useHistorialRegistros");
    useTimeTrackerStore
      .getState()
      .establecerRegistrosDeTiempo([
        crearRegistroDeTiempo({ tareaId: "T-inexistente", duracion: 90 }),
      ]);

    // Act
    const { result } = renderHook(() => useHistorialRegistros());
    await waitFor(() => expect(result.current.hasHydrated).toBe(true));

    // Assert
    expect(result.current.filas).toEqual([]);
  });
});
