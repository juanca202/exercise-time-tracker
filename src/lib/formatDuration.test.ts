import { describe, expect, it } from "vitest";
import { formatDuration } from "./formatDuration";

describe("formatDuration", () => {
  it("formatea 0ms como 0h 00m", () => {
    expect(formatDuration(0)).toBe("0h 00m");
  });

  it("formatea una duración con horas y minutos", () => {
    const threeHoursThirtyMinutes = (3 * 60 + 30) * 60_000;

    expect(formatDuration(threeHoursThirtyMinutes)).toBe("3h 30m");
  });

  it("rellena minutos de un solo dígito con cero a la izquierda", () => {
    const twoHoursFiveMinutes = (2 * 60 + 5) * 60_000;

    expect(formatDuration(twoHoursFiveMinutes)).toBe("2h 05m");
  });
});
