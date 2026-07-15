import { describe, expect, it } from "vitest";
import { formatearTiempoRegistrado } from "./formatear-tiempo-registrado";

describe("formatearTiempoRegistrado", () => {
  it("formatea minutos como HH:MM con padding de ceros", () => {
    expect(formatearTiempoRegistrado(8 * 60 + 5)).toBe("08:05");
  });

  it("formatea totales de más de 24 horas sin truncar las horas", () => {
    expect(formatearTiempoRegistrado(42 * 60 + 15)).toBe("42:15");
  });

  it("formatea 0 minutos como '00:00'", () => {
    expect(formatearTiempoRegistrado(0)).toBe("00:00");
  });

  it("redondea minutos fraccionarios al minuto entero más cercano", () => {
    expect(formatearTiempoRegistrado(90.6)).toBe("01:31");
  });

  it("normaliza valores negativos a '00:00'", () => {
    expect(formatearTiempoRegistrado(-5)).toBe("00:00");
  });

  it("normaliza valores no numéricos o no finitos a '00:00'", () => {
    expect(formatearTiempoRegistrado(Number.NaN)).toBe("00:00");
    expect(formatearTiempoRegistrado(Number.POSITIVE_INFINITY)).toBe("00:00");
  });
});
