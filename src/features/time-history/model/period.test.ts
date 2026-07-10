import { describe, expect, it } from "vitest";
import {
  formatPeriodLabel,
  getCurrentPeriod,
  getNextPeriod,
  getPreviousPeriod,
  isTimestampInPeriod,
} from "./period";

describe("period", () => {
  it("getCurrentPeriod devuelve el año y mes calendario actual", () => {
    // Arrange
    const now = new Date();

    // Act
    const period = getCurrentPeriod();

    // Assert
    expect(period).toEqual({ year: now.getFullYear(), month: now.getMonth() });
  });

  it("getPreviousPeriod retrocede un mes dentro del mismo año", () => {
    // Act
    const result = getPreviousPeriod({ year: 2026, month: 6 });

    // Assert
    expect(result).toEqual({ year: 2026, month: 5 });
  });

  it("getPreviousPeriod retrocede de enero a diciembre del año anterior", () => {
    // Act
    const result = getPreviousPeriod({ year: 2026, month: 0 });

    // Assert
    expect(result).toEqual({ year: 2025, month: 11 });
  });

  it("getNextPeriod avanza un mes dentro del mismo año", () => {
    // Act
    const result = getNextPeriod({ year: 2026, month: 5 });

    // Assert
    expect(result).toEqual({ year: 2026, month: 6 });
  });

  it("getNextPeriod avanza de diciembre a enero del año siguiente", () => {
    // Act
    const result = getNextPeriod({ year: 2026, month: 11 });

    // Assert
    expect(result).toEqual({ year: 2027, month: 0 });
  });

  it("formatPeriodLabel formatea el periodo como 'mes año'", () => {
    // Act
    const result = formatPeriodLabel({ year: 2026, month: 6 });

    // Assert
    expect(result).toBe("julio 2026");
  });

  it("isTimestampInPeriod verifica si un timestamp cae dentro del periodo", () => {
    // Arrange
    const timestamp = new Date(2026, 6, 8).getTime();

    // Act & Assert
    expect(isTimestampInPeriod(timestamp, { year: 2026, month: 6 })).toBe(true);
    expect(isTimestampInPeriod(timestamp, { year: 2026, month: 5 })).toBe(
      false,
    );
  });
});
