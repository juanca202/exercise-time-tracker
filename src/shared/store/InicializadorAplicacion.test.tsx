import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { crearProyectoDePrueba } from "@/shared/domain/object-mother";
import { InicializadorAplicacion } from "./InicializadorAplicacion";
import { useAppStore } from "./app-store";

const descriptorOriginalDeStorage = Object.getOwnPropertyDescriptor(
  navigator,
  "storage",
);

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

describe("InicializadorAplicacion", () => {
  beforeEach(() => {
    reiniciarStoreParaPruebas();
  });

  afterEach(() => {
    if (descriptorOriginalDeStorage) {
      Object.defineProperty(navigator, "storage", descriptorOriginalDeStorage);
    }
  });

  it("hidrata el store raíz al montarse, pasando haHidratado de false a true (AC-004)", () => {
    // Arrange: persiste datos "de una sesión anterior" antes de montar.
    const proyecto = crearProyectoDePrueba();
    window.localStorage.setItem(
      "time-tracker:estado",
      JSON.stringify({
        version: 1,
        proyectos: [proyecto],
        tareas: [],
        registrosDeTiempo: [],
        temporizadorActivo: null,
      }),
    );
    expect(useAppStore.getState().haHidratado).toBe(false);

    // Act
    const { unmount } = render(<InicializadorAplicacion />);

    // Assert
    expect(useAppStore.getState().haHidratado).toBe(true);
    expect(useAppStore.getState().proyectos).toEqual([proyecto]);

    unmount();
  });

  it("solicita almacenamiento persistente al navegador al montarse (AC-005)", () => {
    // Arrange
    const persist = vi.fn().mockResolvedValue(true);
    Object.defineProperty(navigator, "storage", {
      configurable: true,
      value: { persist },
    });

    // Act
    const { unmount } = render(<InicializadorAplicacion />);

    // Assert
    expect(persist).toHaveBeenCalledTimes(1);

    unmount();
  });

  it("no falla al montarse cuando el navegador no expone almacenamiento persistente (AC-005)", () => {
    // Arrange
    Object.defineProperty(navigator, "storage", {
      configurable: true,
      value: undefined,
    });

    // Act & Assert: no debe lanzar durante el montaje.
    expect(() => render(<InicializadorAplicacion />)).not.toThrow();
  });

  it("se suscribe a cambios externos del estado persistido mientras está montado", () => {
    // Arrange
    const { unmount } = render(<InicializadorAplicacion />);
    const proyectoEscritoDesdeOtraPestana = crearProyectoDePrueba({
      nombre: "Desde otra pestaña",
    });
    window.localStorage.setItem(
      "time-tracker:estado",
      JSON.stringify({
        version: 1,
        proyectos: [proyectoEscritoDesdeOtraPestana],
        tareas: [],
        registrosDeTiempo: [],
        temporizadorActivo: null,
      }),
    );

    // Act
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "time-tracker:estado",
        newValue: "irrelevante",
      }),
    );

    // Assert
    expect(useAppStore.getState().proyectos).toEqual([
      proyectoEscritoDesdeOtraPestana,
    ]);

    unmount();
  });

  it("se desuscribe al desmontarse: deja de reaccionar a cambios externos", () => {
    // Arrange
    const { unmount } = render(<InicializadorAplicacion />);
    unmount();
    const proyectoTrasDesmontaje = crearProyectoDePrueba({
      nombre: "Tras desmontaje",
    });

    // Act
    window.localStorage.setItem(
      "time-tracker:estado",
      JSON.stringify({
        version: 1,
        proyectos: [proyectoTrasDesmontaje],
        tareas: [],
        registrosDeTiempo: [],
        temporizadorActivo: null,
      }),
    );
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "time-tracker:estado",
        newValue: "irrelevante",
      }),
    );

    // Assert: el store no se actualizó porque ya se había desuscrito.
    expect(useAppStore.getState().proyectos).toEqual([]);
  });
});
