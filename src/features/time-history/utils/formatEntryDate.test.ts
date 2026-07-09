import { describe, expect, it } from "vitest";
import { formatEntryDate } from "./formatEntryDate";

describe("formatEntryDate", () => {
  it('formatea una fecha ISO como "26 jul. 2026"', () => {
    expect(formatEntryDate(new Date(2026, 6, 26).toISOString())).toBe(
      "26 jul. 2026",
    );
  });
});
