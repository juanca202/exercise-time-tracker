import { describe, expect, it } from "vitest";
import { formatMonthLabel } from "./formatMonthLabel";

describe("formatMonthLabel", () => {
  it('formatea year/month (0-indexado) como "Julio 2026"', () => {
    expect(formatMonthLabel(2026, 6)).toBe("Julio 2026");
  });
});
