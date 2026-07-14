import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TIME_TRACKER_STORAGE_KEY } from "@/shared/store/useTimeTrackerStore";
import {
  crearProyecto,
  crearRegistroDeTiempo,
  crearTarea,
} from "@/shared/testing/objectMother";

describe("HistorialScreen", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it("TC-001: renderiza el historial completo con totales por Proyecto, Tarea y mes", async () => {
    // Arrange
    const { useTimeTrackerStore } =
      await import("@/shared/store/useTimeTrackerStore");
    const { HistorialScreen } = await import("./HistorialScreen");
    const proyectoAlfa = crearProyecto({ id: "P-1", nombre: "Alfa" });
    const tareaDiseno = crearTarea({
      id: "T-1",
      nombre: "Diseño UI",
      proyectoId: "P-1",
    });
    useTimeTrackerStore.getState().establecerProyectos([proyectoAlfa]);
    useTimeTrackerStore.getState().establecerTareas([tareaDiseno]);
    useTimeTrackerStore.getState().establecerRegistrosDeTiempo([
      crearRegistroDeTiempo({
        tareaId: "T-1",
        horaInicio: "2026-05-10T09:00:00",
        duracion: 90,
      }),
    ]);

    // Act
    render(<HistorialScreen />);

    // Assert
    expect(await screen.findByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Diseño UI" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Alfa" })).toBeInTheDocument();
    expect(screen.getByText("Total por Proyecto")).toBeInTheDocument();
    expect(screen.getByText("Total por Tarea")).toBeInTheDocument();
    expect(screen.getByText("Total por mes")).toBeInTheDocument();
  });

  it("TC-003: renderiza el estado vacío cuando no hay Registros de Tiempo", async () => {
    // Arrange
    const { HistorialScreen } = await import("./HistorialScreen");

    // Act
    render(<HistorialScreen />);

    // Assert
    await waitFor(() =>
      expect(
        screen.getByText("No hay registros de tiempo aún"),
      ).toBeInTheDocument(),
    );
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("TC-002: degrada a estado vacío con aviso cuando el storage tiene JSON inválido, sin lanzar", async () => {
    // Arrange
    localStorage.setItem(TIME_TRACKER_STORAGE_KEY, "{esto-no-es-json-valido");
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const { HistorialScreen } = await import("./HistorialScreen");

    // Act
    render(<HistorialScreen />);

    // Assert
    await waitFor(() =>
      expect(
        screen.getByText("No hay registros de tiempo aún"),
      ).toBeInTheDocument(),
    );
    expect(
      screen.getByText(/No se pudieron leer los registros guardados/),
    ).toBeInTheDocument();
    consoleErrorSpy.mockRestore();
  });
});
