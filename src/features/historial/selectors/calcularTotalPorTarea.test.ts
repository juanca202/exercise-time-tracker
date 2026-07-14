import { describe, expect, it } from "vitest";
import { crearRegistroDeTiempoDePrueba } from "@/shared/domain/object-mother";
import { calcularTotalPorTarea, obtenerTotal } from "./calcularTotalPorTarea";

describe("calcularTotalPorTarea", () => {
  it("TC-004: suma exacta de duraciones por Tarea, de forma independiente entre Tareas", () => {
    // Arrange
    const registros = [
      crearRegistroDeTiempoDePrueba({ tareaId: "T-1", duracionMinutos: 90 }),
      crearRegistroDeTiempoDePrueba({ tareaId: "T-1", duracionMinutos: 45 }),
      crearRegistroDeTiempoDePrueba({ tareaId: "T-2", duracionMinutos: 120 }),
    ];

    // Act
    const totales = calcularTotalPorTarea(registros);

    // Assert
    expect(obtenerTotal(totales, "T-1")).toBe(135);
    expect(obtenerTotal(totales, "T-2")).toBe(120);
  });

  it("TC-005: un Registro con duración inválida no corrompe el total de la Tarea", () => {
    // Arrange
    const registros = [
      crearRegistroDeTiempoDePrueba({ tareaId: "T-1", duracionMinutos: 60 }),
      crearRegistroDeTiempoDePrueba({ tareaId: "T-1", duracionMinutos: -30 }),
      crearRegistroDeTiempoDePrueba({
        tareaId: "T-1",
        duracionMinutos: "abc" as unknown as number,
      }),
    ];

    // Act
    const totales = calcularTotalPorTarea(registros);

    // Assert
    expect(obtenerTotal(totales, "T-1")).toBe(60);
    expect(Number.isNaN(obtenerTotal(totales, "T-1"))).toBe(false);
  });

  it("TC-006: una Tarea sin Registros asociados resuelve a 0, no undefined/NaN", () => {
    // Arrange
    const registros = [
      crearRegistroDeTiempoDePrueba({ tareaId: "T-1", duracionMinutos: 60 }),
    ];

    // Act
    const totales = calcularTotalPorTarea(registros);

    // Assert
    expect(obtenerTotal(totales, "T-sin-registros")).toBe(0);
  });

  it("no lanza excepciones ante un arreglo vacío", () => {
    // Arrange & Act
    const totales = calcularTotalPorTarea([]);

    // Assert
    expect(totales.size).toBe(0);
  });
});
