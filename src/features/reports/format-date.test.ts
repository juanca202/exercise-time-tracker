import { describe, expect, it } from "vitest";
import { formatMonthLabel, formatShortSpanishDate } from "./format-date";

describe("formatShortSpanishDate", () => {
  it('formatea una fecha ISO como "D mmm. YYYY"', () => {
    expect(formatShortSpanishDate("2026-10-26")).toBe("26 oct. 2026");
  });

  it("formatea correctamente el primer día del año", () => {
    expect(formatShortSpanishDate("2026-01-01")).toBe("1 ene. 2026");
  });
});

describe("formatMonthLabel", () => {
  it('formatea un año y mes como "Mes YYYY"', () => {
    expect(formatMonthLabel(2026, 10)).toBe("Octubre 2026");
  });

  it("capitaliza el mes de enero", () => {
    expect(formatMonthLabel(2026, 1)).toBe("Enero 2026");
  });
});
