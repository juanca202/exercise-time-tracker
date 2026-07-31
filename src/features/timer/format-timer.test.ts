import { describe, expect, it } from "vitest";
import { formatElapsedTime, formatStartTime } from "./format-timer";

describe("formatElapsedTime", () => {
  it("formatea segundos como HH:MM:SS", () => {
    expect(formatElapsedTime(3730)).toBe("01:02:10");
  });

  it("rellena con ceros los valores de un solo dígito", () => {
    expect(formatElapsedTime(5)).toBe("00:00:05");
  });
});

describe("formatStartTime", () => {
  it("formatea una hora de la mañana como AM", () => {
    const date = new Date();
    date.setHours(9, 15, 0, 0);

    expect(formatStartTime(date.toISOString())).toBe("09:15 AM");
  });

  it("formatea el mediodía como 12:00 PM", () => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);

    expect(formatStartTime(date.toISOString())).toBe("12:00 PM");
  });

  it("formatea la medianoche como 12:00 AM", () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    expect(formatStartTime(date.toISOString())).toBe("12:00 AM");
  });
});
