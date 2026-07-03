import { describe, expect, it } from "vitest";
import {
  formatPeriodLabel,
  getCurrentPeriod,
  isDateInPeriod,
  shiftPeriod,
} from "./period";

describe("getCurrentPeriod", () => {
  it("returns the year and 1-based month of the given date", () => {
    expect(getCurrentPeriod(new Date("2026-10-15T00:00:00.000Z"))).toEqual({
      year: 2026,
      month: 10,
    });
  });
});

describe("formatPeriodLabel", () => {
  it("formats the period as 'Mes Año' in Spanish, capitalized", () => {
    expect(formatPeriodLabel({ year: 2026, month: 10 })).toBe("Octubre 2026");
  });

  it("formats January correctly", () => {
    expect(formatPeriodLabel({ year: 2027, month: 1 })).toBe("Enero 2027");
  });
});

describe("shiftPeriod", () => {
  it("moves forward within the same year", () => {
    expect(shiftPeriod({ year: 2026, month: 10 }, 1)).toEqual({
      year: 2026,
      month: 11,
    });
  });

  it("moves backward within the same year", () => {
    expect(shiftPeriod({ year: 2026, month: 10 }, -1)).toEqual({
      year: 2026,
      month: 9,
    });
  });

  it("rolls over into the next year", () => {
    expect(shiftPeriod({ year: 2026, month: 12 }, 1)).toEqual({
      year: 2027,
      month: 1,
    });
  });

  it("rolls back into the previous year", () => {
    expect(shiftPeriod({ year: 2026, month: 1 }, -1)).toEqual({
      year: 2025,
      month: 12,
    });
  });
});

describe("isDateInPeriod", () => {
  it("returns true when the date falls within the period", () => {
    expect(isDateInPeriod("2026-10-15", { year: 2026, month: 10 })).toBe(true);
  });

  it("returns false when the month differs", () => {
    expect(isDateInPeriod("2026-11-15", { year: 2026, month: 10 })).toBe(false);
  });

  it("returns false when the year differs", () => {
    expect(isDateInPeriod("2025-10-15", { year: 2026, month: 10 })).toBe(false);
  });
});
