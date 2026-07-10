import { describe, expect, it } from "vitest";
import { calculateDurationSeconds } from "./calculate-duration-seconds";

describe("calculateDurationSeconds", () => {
  it("calcula la duración en segundos completos entre dos timestamps", () => {
    // Arrange
    const startedAt = 1000;
    const endedAt = 1000 + 90 * 1000;

    // Act
    const result = calculateDurationSeconds(startedAt, endedAt);

    // Assert
    expect(result).toBe(90);
  });

  it("redondea hacia abajo los milisegundos que no completan un segundo", () => {
    // Arrange
    const startedAt = 0;
    const endedAt = 1999;

    // Act
    const result = calculateDurationSeconds(startedAt, endedAt);

    // Assert
    expect(result).toBe(1);
  });

  it("devuelve 0 cuando Hora Fin y Hora Inicio coinciden", () => {
    // Arrange & Act
    const result = calculateDurationSeconds(5000, 5000);

    // Assert
    expect(result).toBe(0);
  });
});
