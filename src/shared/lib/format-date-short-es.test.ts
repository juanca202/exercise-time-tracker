import { describe, expect, it } from "vitest";
import { formatDateShortEs } from "./format-date-short-es";

describe("formatDateShortEs", () => {
  it('formatea una fecha como "D mmm. AAAA"', () => {
    const timestamp = new Date(2023, 9, 26).getTime();

    expect(formatDateShortEs(timestamp)).toBe("26 oct. 2023");
  });
});
