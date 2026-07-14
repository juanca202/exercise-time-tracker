import { describe, expect, it } from "vitest";
import {
  crearProyecto,
  crearRegistroDeTiempo,
  crearTarea,
} from "@/shared/testing/objectMother";
import { obtenerTotal } from "./calcularTotalPorTarea";
import { calcularTotalPorProyecto } from "./calcularTotalPorProyecto";

describe("calcularTotalPorProyecto", () => {
  it("TC-007: suma los totales de todas las Tareas de un Proyecto", () => {
    // Arrange
    const proyectoAlfa = crearProyecto({ id: "P-1", nombre: "Alfa" });
    const tareaDiseno = crearTarea({
      id: "T-1",
      nombre: "Diseño UI",
      proyectoId: "P-1",
    });
    const tareaTesting = crearTarea({
      id: "T-2",
      nombre: "Testing",
      proyectoId: "P-1",
    });
    const registros = [
      crearRegistroDeTiempo({ tareaId: "T-1", duracion: 90 }),
      crearRegistroDeTiempo({ tareaId: "T-1", duracion: 45 }),
      crearRegistroDeTiempo({ tareaId: "T-2", duracion: 60 }),
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
    const proyectoBeta = crearProyecto({ id: "P-2", nombre: "Beta" });
    const tareaBackend = crearTarea({
      id: "T-backend",
      nombre: "Backend API",
      proyectoId: "P-2",
    });
    const tareaHuerfana = crearTarea({
      id: "T-huerfana",
      nombre: "Huérfana",
      proyectoId: "P-999", // Proyecto inexistente
    });
    const registros = [
      crearRegistroDeTiempo({ tareaId: "T-backend", duracion: 120 }),
      crearRegistroDeTiempo({ tareaId: "T-huerfana", duracion: 40 }),
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
    const proyectoSinRegistros = crearProyecto({ id: "P-3", nombre: "Gamma" });

    // Act
    const totales = calcularTotalPorProyecto([], [], [proyectoSinRegistros]);

    // Assert
    expect(obtenerTotal(totales, "P-3")).toBe(0);
  });
});
