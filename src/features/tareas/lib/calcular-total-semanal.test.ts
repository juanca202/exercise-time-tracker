import { describe, expect, it } from "vitest";
import { crearRegistroDeTiempoDePrueba } from "@/shared/domain/object-mother";
import { calcularTotalSemanal } from "./calcular-total-semanal";

describe("calcularTotalSemanal", () => {
  it("suma Registros por temporizador y manuales dentro de la semana laboral en curso", () => {
    // Arrange: fecha actual Lunes 2026-07-13
    const fechaActual = new Date(2026, 6, 13, 8, 0);
    const registros = [
      crearRegistroDeTiempoDePrueba({
        fecha: "2026-07-13",
        duracionMinutos: 120,
        origen: "temporizador",
      }),
      crearRegistroDeTiempoDePrueba({
        fecha: "2026-07-14",
        duracionMinutos: 90,
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
      crearRegistroDeTiempoDePrueba({
        fecha: "2026-07-12",
        duracionMinutos: 120,
      }),
      crearRegistroDeTiempoDePrueba({
        fecha: "2026-07-13",
        duracionMinutos: 60,
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
      crearRegistroDeTiempoDePrueba({
        fecha: "2026-07-13",
        duracionMinutos: 180,
      }),
      crearRegistroDeTiempoDePrueba({
        fecha: "2026-07-18",
        duracionMinutos: 240,
      }),
      crearRegistroDeTiempoDePrueba({
        fecha: "2026-07-19",
        duracionMinutos: 120,
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
