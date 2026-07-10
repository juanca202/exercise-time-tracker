import { describe, expect, it } from "vitest";
import { formatDuration } from "./format-duration";

describe("formatDuration", () => {
  it("formatea 3h 30m a partir de 12600 segundos", () => {
    // Arrange
    const totalSeconds = 2 * 3600 + 1.5 * 3600;

    // Act
    const result = formatDuration(totalSeconds);

    // Assert
    expect(result).toBe("3h 30m");
  });

  it("formatea 0h 00m cuando no hay segundos", () => {
    // Arrange
    const totalSeconds = 0;

    // Act
    const result = formatDuration(totalSeconds);

    // Assert
    expect(result).toBe("0h 00m");
  });

  it("redondea hacia abajo los segundos que no completan un minuto", () => {
    // Arrange
    const totalSeconds = 89;

    // Act
    const result = formatDuration(totalSeconds);

    // Assert
    expect(result).toBe("0h 01m");
  });
});
