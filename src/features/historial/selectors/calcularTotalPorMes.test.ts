import { describe, expect, it } from "vitest";
import { crearRegistroDeTiempo } from "@/shared/testing/objectMother";
import { calcularTotalPorMes } from "./calcularTotalPorMes";
import { obtenerTotal } from "./calcularTotalPorTarea";

describe("calcularTotalPorMes", () => {
  it("TC-010: suma exacta de duraciones por mes en meses distintos", () => {
    // Arrange
    const registros = [
      crearRegistroDeTiempo({
        horaInicio: "2026-05-10T09:00:00",
        duracion: 90,
      }),
      crearRegistroDeTiempo({
        horaInicio: "2026-05-12T09:00:00",
        duracion: 45,
      }),
      crearRegistroDeTiempo({
        horaInicio: "2026-06-01T09:00:00",
        duracion: 120,
      }),
    ];

    // Act
    const totales = calcularTotalPorMes(registros);

    // Assert
    expect(obtenerTotal(totales, "2026-05")).toBe(135);
    expect(obtenerTotal(totales, "2026-06")).toBe(120);
  });

  it("TC-011: un Registro con fecha inválida no corrompe los totales de meses válidos", () => {
    // Arrange
    const registros = [
      crearRegistroDeTiempo({
        horaInicio: "2026-06-01T09:00:00",
        duracion: 120,
      }),
      crearRegistroDeTiempo({ horaInicio: "2026-13-45", duracion: 30 }),
    ];

    // Act
    const totales = calcularTotalPorMes(registros);

    // Assert
    expect(obtenerTotal(totales, "2026-06")).toBe(120);
    expect(totales.size).toBe(1);
  });

  it("TC-012: un Registro que cruza la medianoche de fin de mes se atribuye íntegro al mes de inicio", () => {
    // Arrange
    const registros = [
      crearRegistroDeTiempo({
        horaInicio: "2026-07-31T23:00:00",
        horaFin: "2026-08-01T01:00:00",
        origen: "temporizador",
        duracion: 120,
      }),
    ];

    // Act
    const totales = calcularTotalPorMes(registros);

    // Assert
    expect(obtenerTotal(totales, "2026-07")).toBe(120);
    expect(obtenerTotal(totales, "2026-08")).toBe(0);
  });
});
