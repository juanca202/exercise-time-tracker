import { describe, expect, it } from "vitest";
import { calcularPorcentajeMeta } from "./calcular-porcentaje-meta";

describe("calcularPorcentajeMeta", () => {
  it("calcula el porcentaje por debajo de la meta", () => {
    // Arrange
    const totalSemanalHoras = 20; // Meta Semanal = 40h

    // Act
    const porcentaje = calcularPorcentajeMeta(totalSemanalHoras);

    // Assert
    expect(porcentaje).toBe(50);
  });

  it("calcula el porcentaje por encima del 100% sin truncar", () => {
    // Arrange
    const totalSemanalHoras = 44; // Meta Semanal = 40h

    // Act
    const porcentaje = calcularPorcentajeMeta(totalSemanalHoras);

    // Assert
    expect(porcentaje).toBe(110);
  });

  it("calcula 100% cuando el Total Semanal iguala la Meta Semanal", () => {
    expect(calcularPorcentajeMeta(40)).toBe(100);
  });

  it("calcula 0% cuando el Total Semanal es cero", () => {
    expect(calcularPorcentajeMeta(0)).toBe(0);
  });
});
