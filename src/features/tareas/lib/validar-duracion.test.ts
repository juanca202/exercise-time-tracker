import { describe, expect, it } from "vitest";
import { validarDuracion } from "./validar-duracion";

describe("validarDuracion", () => {
  it("acepta una Duración positiva", () => {
    // Arrange
    const duracionMs = 60_000;

    // Act
    const resultado = validarDuracion(duracionMs);

    // Assert
    expect(resultado).toBe(true);
  });

  it("rechaza una Duración igual a cero", () => {
    // Arrange
    const duracionMs = 0;

    // Act
    const resultado = validarDuracion(duracionMs);

    // Assert
    expect(resultado).toBe(false);
  });

  it("rechaza una Duración negativa", () => {
    // Arrange
    const duracionMs = -1;

    // Act
    const resultado = validarDuracion(duracionMs);

    // Assert
    expect(resultado).toBe(false);
  });

  it("acepta el valor positivo mínimo (1 milisegundo)", () => {
    // Arrange
    const duracionMs = 1;

    // Act
    const resultado = validarDuracion(duracionMs);

    // Assert
    expect(resultado).toBe(true);
  });
});
