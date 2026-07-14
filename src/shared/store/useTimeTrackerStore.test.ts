import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TIME_TRACKER_STORAGE_KEY } from "./useTimeTrackerStore";

describe("useTimeTrackerStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("expone CRUD crudo por entidad sin reglas de negocio", async () => {
    // Arrange
    vi.resetModules();
    const { useTimeTrackerStore } = await import("./useTimeTrackerStore");

    // Act
    useTimeTrackerStore
      .getState()
      .agregarProyecto({ id: "P-1", nombre: "Alfa" });
    useTimeTrackerStore
      .getState()
      .agregarTarea({ id: "T-1", nombre: "Diseño UI", proyectoId: "P-1" });
    useTimeTrackerStore.getState().agregarRegistroDeTiempo({
      id: "RT-01",
      tareaId: "T-1",
      origen: "manual",
      horaInicio: "2026-05-10T00:00:00",
      duracion: 90,
    });

    // Assert
    const estado = useTimeTrackerStore.getState();
    expect(estado.proyectos).toEqual([{ id: "P-1", nombre: "Alfa" }]);
    expect(estado.tareas).toEqual([
      { id: "T-1", nombre: "Diseño UI", proyectoId: "P-1" },
    ]);
    expect(estado.registrosDeTiempo).toHaveLength(1);
  });
});

describe("useHasHydrated", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it("comienza en false y pasa a true tras el efecto de montaje (sin storage previo)", async () => {
    // Arrange
    const { useHasHydrated: useHasHydratedFresco } =
      await import("./useTimeTrackerStore");

    // Act
    const { result } = renderHook(() => useHasHydratedFresco());

    // Assert
    await waitFor(() => expect(result.current.hasHydrated).toBe(true));
    expect(result.current.parseError).toBe(false);
  });

  it("degrada a estado vacío sin lanzar excepción cuando el storage tiene JSON inválido", async () => {
    // Arrange
    localStorage.setItem(TIME_TRACKER_STORAGE_KEY, "{esto-no-es-json-valido");
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Act
    const storeModule = await import("./useTimeTrackerStore");
    const { result } = renderHook(() => storeModule.useHasHydrated());

    // Assert
    await waitFor(() => expect(result.current.hasHydrated).toBe(true));
    expect(result.current.parseError).toBe(true);
    expect(
      storeModule.useTimeTrackerStore.getState().registrosDeTiempo,
    ).toEqual([]);
    consoleErrorSpy.mockRestore();
  });
});
