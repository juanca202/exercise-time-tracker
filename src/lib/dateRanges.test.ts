import { describe, expect, it } from "vitest";
import {
  endOfMonth,
  endOfWeek,
  isWithinRange,
  startOfMonth,
  startOfWeek,
} from "./dateRanges";

describe("dateRanges", () => {
  it("startOfWeek retorna el lunes de la semana (dado un miércoles)", () => {
    const wednesday = new Date(2026, 6, 8); // 2026-07-08 es miércoles
    expect(startOfWeek(wednesday)).toEqual(new Date(2026, 6, 6));
  });

  it("startOfWeek retorna el lunes anterior cuando la fecha es domingo", () => {
    const sunday = new Date(2026, 6, 12);
    expect(startOfWeek(sunday)).toEqual(new Date(2026, 6, 6));
  });

  it("endOfWeek retorna el lunes siguiente (límite exclusivo)", () => {
    const wednesday = new Date(2026, 6, 8);
    expect(endOfWeek(wednesday)).toEqual(new Date(2026, 6, 13));
  });

  it("startOfMonth y endOfMonth delimitan el mes calendario", () => {
    const midMonth = new Date(2026, 6, 15);
    expect(startOfMonth(midMonth)).toEqual(new Date(2026, 6, 1));
    expect(endOfMonth(midMonth)).toEqual(new Date(2026, 7, 1));
  });

  it("isWithinRange incluye el límite inferior y excluye el superior", () => {
    const start = new Date(2026, 6, 6);
    const end = new Date(2026, 6, 13);
    expect(isWithinRange(start.toISOString(), start, end)).toBe(true);
    expect(isWithinRange(end.toISOString(), start, end)).toBe(false);
    expect(isWithinRange(new Date(2026, 6, 8).toISOString(), start, end)).toBe(
      true,
    );
  });
});
