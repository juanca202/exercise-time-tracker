import { describe, expect, it } from "vitest";
import { formatDate } from "./format-date";

describe("formatDate", () => {
  it("formatea un timestamp como AAAA-MM-DD con ceros a la izquierda", () => {
    // Arrange
    const timestamp = new Date(2026, 0, 8, 10, 30).getTime();

    // Act
    const result = formatDate(timestamp);

    // Assert
    expect(result).toBe("2026-01-08");
  });
});
