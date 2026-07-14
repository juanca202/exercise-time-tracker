import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  crearProyectoDePrueba,
  crearRegistroDeTiempoDePrueba,
  crearTareaDePrueba,
} from "@/shared/domain/object-mother";
import { useAppStore } from "@/shared/store";
import { useHistorialRegistros } from "./useHistorialRegistros";

function reiniciarStoreParaPruebas(): void {
  window.localStorage.clear();
  useAppStore.setState(
    {
      proyectos: [],
      tareas: [],
      registrosDeTiempo: [],
      temporizadorActivo: null,
      haHidratado: false,
    },
    false,
  );
}

describe("useHistorialRegistros", () => {
  beforeEach(() => {
    reiniciarStoreParaPruebas();
  });

  it("TC-001: expone las filas del historial completo con Tarea y Proyecto resueltos", () => {
    // Arrange
    const proyectoAlfa = crearProyectoDePrueba({ id: "P-1", nombre: "Alfa" });
    const tareaDiseno = crearTareaDePrueba({
      id: "T-1",
      nombre: "Diseño UI",
      proyectoId: "P-1",
    });
    useAppStore.setState(
      {
        proyectos: [proyectoAlfa],
        tareas: [tareaDiseno],
        registrosDeTiempo: [
          crearRegistroDeTiempoDePrueba({
            tareaId: "T-1",
            duracionMinutos: 90,
          }),
          crearRegistroDeTiempoDePrueba({
            tareaId: "T-1",
            duracionMinutos: 45,
          }),
        ],
        haHidratado: true,
      },
      false,
    );

    // Act
    const { result } = renderHook(() => useHistorialRegistros());

    // Assert
    expect(result.current.hasHydrated).toBe(true);
    expect(result.current.filas).toHaveLength(2);
    expect(result.current.filas[0].tarea.nombre).toBe("Diseño UI");
    expect(result.current.filas[0].proyecto?.nombre).toBe("Alfa");
    expect(result.current.totalesPorTarea.get("T-1")).toBe(135);
  });

  it("TC-003: con el store vacío, no hay filas ni totales espurios", () => {
    // Arrange
    useAppStore.setState({ haHidratado: true }, false);

    // Act
    const { result } = renderHook(() => useHistorialRegistros());

    // Assert
    expect(result.current.hasHydrated).toBe(true);
    expect(result.current.filas).toEqual([]);
    expect(result.current.totalesPorTarea.size).toBe(0);
    expect(result.current.totalesPorProyecto.size).toBe(0);
    expect(result.current.totalesPorMes.size).toBe(0);
  });

  it("expone hasHydrated en false antes de que el store raíz termine de hidratar", () => {
    // Act
    const { result } = renderHook(() => useHistorialRegistros());

    // Assert
    expect(result.current.hasHydrated).toBe(false);
  });

  it("filtra de la lista un Registro cuya Tarea ya no existe, sin lanzar excepción", () => {
    // Arrange
    useAppStore.setState(
      {
        registrosDeTiempo: [
          crearRegistroDeTiempoDePrueba({
            tareaId: "T-inexistente",
            duracionMinutos: 90,
          }),
        ],
        haHidratado: true,
      },
      false,
    );

    // Act
    const { result } = renderHook(() => useHistorialRegistros());

    // Assert
    expect(result.current.filas).toEqual([]);
  });
});
