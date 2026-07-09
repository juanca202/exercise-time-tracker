import { describe, expect, it } from "vitest";
import { formatHms } from "./formatHms";

describe("formatHms", () => {
  it("formatea 0ms como 00:00:00", () => {
    expect(formatHms(0)).toBe("00:00:00");
  });

  it("formatea horas, minutos y segundos con cero a la izquierda", () => {
    const durationMs = ((1 * 60 + 2) * 60 + 10) * 1000; // 01:02:10

    expect(formatHms(durationMs)).toBe("01:02:10");
  });
});
