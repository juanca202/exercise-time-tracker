import { describe, expect, it } from "vitest";
import {
  formatearHMS,
  formatearHoraAmPm,
  formatearHorasYMinutos,
} from "./formatear-tiempo";

describe("formatearHorasYMinutos", () => {
  it("formatea una duración con horas y minutos", () => {
    expect(formatearHorasYMinutos(1965)).toBe("32h 45m"); // 32h45m = 1965min
  });

  it("formatea cero minutos", () => {
    expect(formatearHorasYMinutos(0)).toBe("0h 0m");
  });

  it("redondea minutos fraccionarios antes de formatear", () => {
    expect(formatearHorasYMinutos(90.6)).toBe("1h 31m");
  });

  it("normaliza valores inválidos o negativos a '0h 0m'", () => {
    expect(formatearHorasYMinutos(Number.NaN)).toBe("0h 0m");
    expect(formatearHorasYMinutos(-10)).toBe("0h 0m");
  });
});

describe("formatearHMS", () => {
  it("formatea segundos como HH:MM:SS con ceros a la izquierda", () => {
    expect(formatearHMS(3730)).toBe("01:02:10");
  });

  it("formatea cero segundos", () => {
    expect(formatearHMS(0)).toBe("00:00:00");
  });

  it("trunca fracciones de segundo", () => {
    expect(formatearHMS(61.9)).toBe("00:01:01");
  });

  it("normaliza valores inválidos o negativos a '00:00:00'", () => {
    expect(formatearHMS(Number.NaN)).toBe("00:00:00");
    expect(formatearHMS(-5)).toBe("00:00:00");
  });
});

describe("formatearHoraAmPm", () => {
  it("formatea una hora de la mañana con sufijo AM", () => {
    const fecha = new Date(2026, 6, 13, 9, 15).toISOString();
    expect(formatearHoraAmPm(fecha)).toBe("09:15 AM");
  });

  it("formatea una hora de la tarde con sufijo PM", () => {
    const fecha = new Date(2026, 6, 13, 14, 5).toISOString();
    expect(formatearHoraAmPm(fecha)).toBe("02:05 PM");
  });

  it("formatea el mediodía como 12:00 PM", () => {
    const fecha = new Date(2026, 6, 13, 12, 0).toISOString();
    expect(formatearHoraAmPm(fecha)).toBe("12:00 PM");
  });

  it("formatea la medianoche como 12:00 AM", () => {
    const fecha = new Date(2026, 6, 13, 0, 0).toISOString();
    expect(formatearHoraAmPm(fecha)).toBe("12:00 AM");
  });

  it("devuelve undefined ante una fecha no parseable", () => {
    expect(formatearHoraAmPm("no-es-una-fecha")).toBeUndefined();
  });
});
