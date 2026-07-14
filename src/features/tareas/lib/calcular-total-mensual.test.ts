import { describe, expect, it } from "vitest";
import { crearRegistroDeTiempoDePrueba } from "@/shared/domain/object-mother";
import { calcularTotalMensual } from "./calcular-total-mensual";

describe("calcularTotalMensual", () => {
  it("suma Registros por temporizador y manuales dentro del mes calendario de la fecha", () => {
    // Arrange: fecha actual 2026-07-13
    const fechaActual = new Date(2026, 6, 13, 8, 0);
    const registros = [
      crearRegistroDeTiempoDePrueba({
        fecha: "2026-07-01",
        duracionMinutos: 120,
        origen: "temporizador",
      }),
      crearRegistroDeTiempoDePrueba({
        fecha: "2026-07-31",
        duracionMinutos: 90,
        origen: "manual",
      }),
    ];

    // Act
    const totalHoras = calcularTotalMensual(registros, fechaActual);

    // Assert
    expect(totalHoras).toBeCloseTo(3.5);
  });

  it("excluye Registros de otros meses calendario", () => {
    // Arrange
    const fechaActual = new Date(2026, 6, 13, 8, 0);
    const registros = [
      crearRegistroDeTiempoDePrueba({
        fecha: "2026-06-30",
        duracionMinutos: 60,
      }),
      crearRegistroDeTiempoDePrueba({
        fecha: "2026-08-01",
        duracionMinutos: 60,
      }),
      crearRegistroDeTiempoDePrueba({
        fecha: "2026-07-15",
        duracionMinutos: 60,
      }),
    ];

    // Act
    const totalHoras = calcularTotalMensual(registros, fechaActual);

    // Assert
    expect(totalHoras).toBe(1);
  });

  it("devuelve 0 cuando no hay Registros en el mes", () => {
    // Act & Assert
    expect(calcularTotalMensual([], new Date(2026, 6, 13))).toBe(0);
  });

  it("distingue el mismo mes calendario en distintos años", () => {
    // Arrange
    const fechaActual = new Date(2026, 6, 13);
    const registros = [
      crearRegistroDeTiempoDePrueba({
        fecha: "2025-07-13",
        duracionMinutos: 120,
      }),
    ];

    // Act & Assert
    expect(calcularTotalMensual(registros, fechaActual)).toBe(0);
  });
});
