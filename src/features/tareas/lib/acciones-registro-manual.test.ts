import { beforeEach, describe, expect, it } from "vitest";
import { useRaizStore } from "@/shared/store";
import { crearRegistroManual } from "./acciones-registro-manual";

function resetearStore(): void {
  useRaizStore.setState({
    haHidratado: true,
    proyectos: [],
    tareas: [
      { id: "tarea-a", proyectoId: "proyecto-1", nombre: "Diseñar wireframes" },
    ],
    registrosDeTiempo: [],
    temporizadorActivo: null,
  });
}

describe("crearRegistroManual", () => {
  beforeEach(resetearStore);

  it("crea el Registro de Tiempo manual con una Duración válida", () => {
    // Act
    const resultado = crearRegistroManual({
      tareaId: "tarea-a",
      fecha: "2026-07-10T00:00:00.000Z",
      duracionMs: 90 * 60 * 1000,
    });

    // Assert
    expect(resultado.ok).toBe(true);
    expect(useRaizStore.getState().registrosDeTiempo).toHaveLength(1);
    expect(useRaizStore.getState().registrosDeTiempo[0]).toMatchObject({
      tareaId: "tarea-a",
      duracionMs: 90 * 60 * 1000,
      origen: "manual",
    });
  });

  it("rechaza una Duración igual a cero", () => {
    // Act
    const resultado = crearRegistroManual({
      tareaId: "tarea-a",
      fecha: "2026-07-10T00:00:00.000Z",
      duracionMs: 0,
    });

    // Assert
    expect(resultado.ok).toBe(false);
    expect(useRaizStore.getState().registrosDeTiempo).toHaveLength(0);
  });

  it("rechaza una Duración negativa", () => {
    // Act
    const resultado = crearRegistroManual({
      tareaId: "tarea-a",
      fecha: "2026-07-10T00:00:00.000Z",
      duracionMs: -30 * 60 * 1000,
    });

    // Assert
    expect(resultado.ok).toBe(false);
    expect(useRaizStore.getState().registrosDeTiempo).toHaveLength(0);
  });

  it("acepta el valor positivo mínimo de Duración (1 minuto)", () => {
    // Act
    const resultado = crearRegistroManual({
      tareaId: "tarea-a",
      fecha: "2026-07-10T00:00:00.000Z",
      duracionMs: 60 * 1000,
    });

    // Assert
    expect(resultado.ok).toBe(true);
    expect(useRaizStore.getState().registrosDeTiempo).toHaveLength(1);
  });

  it("rechaza el registro cuando la Tarea seleccionada no existe en el store", () => {
    // Act
    const resultado = crearRegistroManual({
      tareaId: "tarea-inexistente",
      fecha: "2026-07-10T00:00:00.000Z",
      duracionMs: 60 * 1000,
    });

    // Assert
    expect(resultado.ok).toBe(false);
    expect(useRaizStore.getState().registrosDeTiempo).toHaveLength(0);
  });

  it("persiste el Registro de Tiempo manual tras una recarga simulada de la aplicación", () => {
    // Arrange
    const resultado = crearRegistroManual({
      tareaId: "tarea-a",
      fecha: "2026-07-10T00:00:00.000Z",
      duracionMs: 90 * 60 * 1000,
    });
    expect(resultado.ok).toBe(true);

    // Act: simula una recarga de la app — reinicia el estado en memoria a su
    // valor inicial (sin tocar `localStorage`, que ya conserva lo persistido
    // por `crearRegistroManual`) y vuelve a hidratar desde el almacenamiento
    // local; `hidratar()` restaura Tareas y Registros desde ahí.
    useRaizStore.setState({
      haHidratado: false,
      proyectos: [],
      tareas: [],
      registrosDeTiempo: [],
      temporizadorActivo: null,
    });
    useRaizStore.getState().hidratar();

    // Assert: el Registro sigue presente tras la "recarga"
    expect(useRaizStore.getState().registrosDeTiempo).toHaveLength(1);
    expect(useRaizStore.getState().registrosDeTiempo[0]).toMatchObject({
      tareaId: "tarea-a",
      duracionMs: 90 * 60 * 1000,
      origen: "manual",
    });
  });
});
