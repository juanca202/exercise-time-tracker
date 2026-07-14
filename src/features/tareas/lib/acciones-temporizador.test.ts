import { beforeEach, describe, expect, it } from "vitest";
import { useAppStore } from "@/shared/store";
import { crearTareaDePrueba } from "@/shared/domain/object-mother";
import {
  detenerTemporizador,
  iniciarTemporizador,
} from "./acciones-temporizador";

const tareaA = crearTareaDePrueba({
  id: "tarea-a",
  proyectoId: "proyecto-1",
  nombre: "Diseñar wireframes",
});
const tareaB = crearTareaDePrueba({
  id: "tarea-b",
  proyectoId: "proyecto-1",
  nombre: "Revisar backlog",
});

function resetearStore(): void {
  window.localStorage.clear();
  useAppStore.setState({
    haHidratado: true,
    proyectos: [],
    tareas: [tareaA, tareaB],
    registrosDeTiempo: [],
    temporizadorActivo: null,
  });
}

describe("iniciarTemporizador", () => {
  beforeEach(resetearStore);

  it("inicia el temporizador de una Tarea cuando no hay ninguno activo", () => {
    // Arrange
    const horaInicio = new Date(2026, 6, 13, 9, 0, 0);

    // Act
    iniciarTemporizador("tarea-a", horaInicio);

    // Assert
    expect(useAppStore.getState().temporizadorActivo).toEqual({
      tareaId: "tarea-a",
      horaInicio: horaInicio.toISOString(),
    });
    expect(useAppStore.getState().registrosDeTiempo).toHaveLength(0);
  });

  it("detiene automáticamente el temporizador anterior y persiste su Registro al iniciar uno nuevo en otra Tarea", () => {
    // Arrange
    const horaInicioA = new Date(2026, 6, 13, 9, 0, 0);
    const horaInicioB = new Date(2026, 6, 13, 9, 25, 0);
    iniciarTemporizador("tarea-a", horaInicioA);

    // Act
    iniciarTemporizador("tarea-b", horaInicioB);

    // Assert: el temporizador activo pasa a ser el de la Tarea B
    expect(useAppStore.getState().temporizadorActivo).toEqual({
      tareaId: "tarea-b",
      horaInicio: horaInicioB.toISOString(),
    });

    // Assert: se persistió el Registro de la Tarea A con Duración > 0
    const registros = useAppStore.getState().registrosDeTiempo;
    expect(registros).toHaveLength(1);
    expect(registros[0]).toMatchObject({
      tareaId: "tarea-a",
      duracionMinutos: 25,
      origen: "temporizador",
    });
  });

  it("es un no-op si se inicia el temporizador de la misma Tarea que ya está activa", () => {
    // Arrange
    const horaInicio = new Date(2026, 6, 13, 9, 0, 0);
    iniciarTemporizador("tarea-a", horaInicio);

    // Act
    iniciarTemporizador("tarea-a", new Date(2026, 6, 13, 9, 5, 0));

    // Assert: la hora de inicio original no cambia y no se generan Registros
    expect(useAppStore.getState().temporizadorActivo?.horaInicio).toBe(
      horaInicio.toISOString(),
    );
    expect(useAppStore.getState().registrosDeTiempo).toHaveLength(0);
  });
});

describe("detenerTemporizador", () => {
  beforeEach(resetearStore);

  it("calcula la Duración y persiste el Registro al detener el temporizador activo", () => {
    // Arrange
    const horaInicio = new Date(2026, 6, 13, 9, 0, 0);
    const horaFin = new Date(2026, 6, 13, 9, 25, 0);
    iniciarTemporizador("tarea-a", horaInicio);

    // Act
    detenerTemporizador(horaFin);

    // Assert
    expect(useAppStore.getState().temporizadorActivo).toBeNull();
    const registros = useAppStore.getState().registrosDeTiempo;
    expect(registros).toHaveLength(1);
    expect(registros[0]).toMatchObject({
      tareaId: "tarea-a",
      fecha: "2026-07-13",
      duracionMinutos: 25,
      origen: "temporizador",
    });
  });

  it("no persiste ningún Registro cuando la Duración calculada es igual a cero", () => {
    // Arrange: Hora Fin coincide exactamente con Hora Inicio
    const horaInicio = new Date(2026, 6, 13, 9, 0, 0);
    iniciarTemporizador("tarea-a", horaInicio);

    // Act
    detenerTemporizador(horaInicio);

    // Assert
    expect(useAppStore.getState().temporizadorActivo).toBeNull();
    expect(useAppStore.getState().registrosDeTiempo).toHaveLength(0);
  });

  it("es un no-op cuando no hay ningún temporizador activo", () => {
    // Act
    detenerTemporizador(new Date(2026, 6, 13, 9, 0, 0));

    // Assert
    expect(useAppStore.getState().temporizadorActivo).toBeNull();
    expect(useAppStore.getState().registrosDeTiempo).toHaveLength(0);
  });
});
