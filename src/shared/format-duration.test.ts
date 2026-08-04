import { describe, expect, it } from "vitest";
import {
  formatHoursMinutesColon,
  formatHoursMinutesSeconds,
  formatHoursMinutesWords,
} from "./format-duration";

describe("formatHoursMinutesSeconds", () => {
  it("formatea segundos como HH:MM:SS", () => {
    expect(formatHoursMinutesSeconds(3730)).toBe("01:02:10");
  });

  it("rellena con ceros los valores de un solo dígito", () => {
    expect(formatHoursMinutesSeconds(5)).toBe("00:00:05");
  });
});

describe("formatHoursMinutesColon", () => {
  it("formatea segundos como HH:MM", () => {
    expect(formatHoursMinutesColon(3600 * 42 + 60 * 15)).toBe("42:15");
  });

  it("devuelve 00:00 para cero segundos", () => {
    expect(formatHoursMinutesColon(0)).toBe("00:00");
  });
});

describe("formatHoursMinutesWords", () => {
  it('formatea segundos como "Xh Ym"', () => {
    expect(formatHoursMinutesWords(3600 * 32 + 60 * 45)).toBe("32h 45m");
  });

  it("rellena horas y minutos a dos dígitos cuando hacen falta", () => {
    expect(formatHoursMinutesWords(3600 * 9 + 60 * 30)).toBe("09h 30m");
  });

  it("rellena los minutos con cero pero no trunca horas de tres dígitos", () => {
    expect(formatHoursMinutesWords(3600 * 128 + 60 * 5)).toBe("128h 05m");
  });
});
