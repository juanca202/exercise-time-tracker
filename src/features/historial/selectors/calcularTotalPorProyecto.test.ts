import { describe, expect, it } from "vitest";
import {
  crearProyectoDePrueba,
  crearRegistroDeTiempoDePrueba,
  crearTareaDePrueba,
} from "@/shared/domain/object-mother";
import { obtenerTotal } from "./calcularTotalPorTarea";
import { calcularTotalPorProyecto } from "./calcularTotalPorProyecto";

describe("calcularTotalPorProyecto", () => {
  it("TC-007: suma los totales de todas las Tareas de un Proyecto", () => {
    // Arrange
    const proyectoAlfa = crearProyectoDePrueba({ id: "P-1", nombre: "Alfa" });
    const tareaDiseno = crearTareaDePrueba({
      id: "T-1",
      nombre: "Diseño UI",
      proyectoId: "P-1",
    });
    const tareaTesting = crearTareaDePrueba({
      id: "T-2",
      nombre: "Testing",
      proyectoId: "P-1",
    });
    const registros = [
      crearRegistroDeTiempoDePrueba({ tareaId: "T-1", duracionMinutos: 90 }),
      crearRegistroDeTiempoDePrueba({ tareaId: "T-1", duracionMinutos: 45 }),
      crearRegistroDeTiempoDePrueba({ tareaId: "T-2", duracionMinutos: 60 }),
    ];

    // Act
    const totales = calcularTotalPorProyecto(
      registros,
      [tareaDiseno, tareaTesting],
      [proyectoAlfa],
    );

    // Assert
    expect(obtenerTotal(totales, "P-1")).toBe(195);
  });

  it("TC-008: una Tarea huérfana no corrompe el total de un Proyecto válido", () => {
    // Arrange
    const proyectoBeta = crearProyectoDePrueba({ id: "P-2", nombre: "Beta" });
    const tareaBackend = crearTareaDePrueba({
      id: "T-backend",
      nombre: "Backend API",
      proyectoId: "P-2",
    });
    const tareaHuerfana = crearTareaDePrueba({
      id: "T-huerfana",
      nombre: "Huérfana",
      proyectoId: "P-999", // Proyecto inexistente
    });
    const registros = [
      crearRegistroDeTiempoDePrueba({
        tareaId: "T-backend",
        duracionMinutos: 120,
      }),
      crearRegistroDeTiempoDePrueba({
        tareaId: "T-huerfana",
        duracionMinutos: 40,
      }),
    ];

    // Act
    const totales = calcularTotalPorProyecto(
      registros,
      [tareaBackend, tareaHuerfana],
      [proyectoBeta],
    );

    // Assert
    expect(obtenerTotal(totales, "P-2")).toBe(120);
    expect(totales.has("P-999")).toBe(false);
  });

  it("TC-009: un Proyecto sin Tareas con Registros resuelve a 0", () => {
    // Arrange
    const proyectoSinRegistros = crearProyectoDePrueba({
      id: "P-3",
      nombre: "Gamma",
    });

    // Act
    const totales = calcularTotalPorProyecto([], [], [proyectoSinRegistros]);

    // Assert
    expect(obtenerTotal(totales, "P-3")).toBe(0);
  });
});
