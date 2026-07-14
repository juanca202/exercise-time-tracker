import { describe, expect, it } from "vitest";
import { formatearDuracion, formatearFecha } from "./formatearDuracion";

describe("formatearDuracion", () => {
  it("formatea minutos puros por debajo de una hora", () => {
    expect(formatearDuracion(45)).toBe("45 min");
  });

  it("formatea horas exactas sin minutos", () => {
    expect(formatearDuracion(120)).toBe("2h");
  });

  it("formatea horas con minutos restantes", () => {
    expect(formatearDuracion(135)).toBe("2h 15m");
  });

  it("normaliza valores inválidos a 0 min sin lanzar", () => {
    expect(formatearDuracion(-30)).toBe("0 min");
    expect(formatearDuracion(NaN)).toBe("0 min");
  });
});

describe("formatearFecha", () => {
  it("formatea una fecha ISO válida", () => {
    expect(formatearFecha("2026-05-10T00:00:00")).toBe("10/05/2026");
  });

  it("devuelve el valor original si la fecha no es parseable", () => {
    expect(formatearFecha("2026-13-45")).toBe("2026-13-45");
  });
});
