import { describe, expect, it } from "vitest";
import { calcularTotalSemanal } from "./calcular-total-semanal";
import { fechaLocalIso, unRegistroDeTiempo } from "../testing/object-mother";

describe("calcularTotalSemanal", () => {
  it("suma Registros por temporizador y manuales dentro de la semana laboral en curso", () => {
    // Arrange: fecha actual Lunes 2026-07-13
    const fechaActual = new Date(2026, 6, 13, 8, 0);
    const registros = [
      unRegistroDeTiempo({
        fecha: fechaLocalIso(2026, 6, 13, 9),
        duracionMs: 2 * 60 * 60 * 1000,
        origen: "temporizador",
      }),
      unRegistroDeTiempo({
        fecha: fechaLocalIso(2026, 6, 14, 10),
        duracionMs: 1.5 * 60 * 60 * 1000,
        origen: "manual",
      }),
    ];

    // Act
    const totalHoras = calcularTotalSemanal(registros, fechaActual);

    // Assert
    expect(totalHoras).toBeCloseTo(3.5);
  });

  it("excluye un Registro de la semana calendario anterior", () => {
    // Arrange: fecha actual Lunes 2026-07-13; Registro del Domingo 2026-07-12 (semana anterior)
    const fechaActual = new Date(2026, 6, 13, 8, 0);
    const registros = [
      unRegistroDeTiempo({
        fecha: fechaLocalIso(2026, 6, 12, 10),
        duracionMs: 2 * 60 * 60 * 1000,
      }),
      unRegistroDeTiempo({
        fecha: fechaLocalIso(2026, 6, 13, 10),
        duracionMs: 1 * 60 * 60 * 1000,
      }),
    ];

    // Act
    const totalHoras = calcularTotalSemanal(registros, fechaActual);

    // Assert
    expect(totalHoras).toBeCloseTo(1);
  });

  it("excluye Registros de Sábado y Domingo dentro del rango calendario de la semana actual", () => {
    // Arrange: fecha actual Lunes 2026-07-13; Sábado 2026-07-18 y Domingo 2026-07-19
    const fechaActual = new Date(2026, 6, 13, 8, 0);
    const registros = [
      unRegistroDeTiempo({
        fecha: fechaLocalIso(2026, 6, 13, 9),
        duracionMs: 3 * 60 * 60 * 1000,
      }),
      unRegistroDeTiempo({
        fecha: fechaLocalIso(2026, 6, 18, 9),
        duracionMs: 4 * 60 * 60 * 1000,
      }),
      unRegistroDeTiempo({
        fecha: fechaLocalIso(2026, 6, 19, 9),
        duracionMs: 2 * 60 * 60 * 1000,
      }),
    ];

    // Act
    const totalHoras = calcularTotalSemanal(registros, fechaActual);

    // Assert
    expect(totalHoras).toBeCloseTo(3);
  });

  it("devuelve cero cuando no hay Registros dentro del rango", () => {
    // Arrange
    const fechaActual = new Date(2026, 6, 13, 8, 0);

    // Act
    const totalHoras = calcularTotalSemanal([], fechaActual);

    // Assert
    expect(totalHoras).toBe(0);
  });
});
