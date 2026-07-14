import { describe, expect, it } from "vitest";
import { formatearTiempoRelativo } from "./formatear-tiempo-relativo";

describe("formatearTiempoRelativo", () => {
  const ahora = new Date(2026, 6, 13, 12, 0, 0);

  it("muestra 'Ahora mismo' para instantes de menos de un minuto", () => {
    const fecha = new Date(2026, 6, 13, 11, 59, 30).toISOString();
    expect(formatearTiempoRelativo(fecha, ahora)).toBe("Ahora mismo");
  });

  it("muestra minutos transcurridos por debajo de una hora", () => {
    const fecha = new Date(2026, 6, 13, 11, 45, 0).toISOString();
    expect(formatearTiempoRelativo(fecha, ahora)).toBe("hace 15m");
  });

  it("muestra horas transcurridas por debajo de un día", () => {
    const fecha = new Date(2026, 6, 13, 10, 0, 0).toISOString();
    expect(formatearTiempoRelativo(fecha, ahora)).toBe("hace 2h");
  });

  it("muestra 'Ayer' para exactamente un día transcurrido", () => {
    const fecha = new Date(2026, 6, 12, 12, 0, 0).toISOString();
    expect(formatearTiempoRelativo(fecha, ahora)).toBe("Ayer");
  });

  it("muestra días transcurridos por encima de un día", () => {
    const fecha = new Date(2026, 6, 10, 12, 0, 0).toISOString();
    expect(formatearTiempoRelativo(fecha, ahora)).toBe("hace 3d");
  });

  it("no devuelve un valor negativo cuando la fecha es futura", () => {
    const fecha = new Date(2026, 6, 13, 13, 0, 0).toISOString();
    expect(formatearTiempoRelativo(fecha, ahora)).toBe("Ahora mismo");
  });

  it("devuelve undefined ante una fecha no parseable", () => {
    expect(formatearTiempoRelativo("no-es-una-fecha", ahora)).toBeUndefined();
  });
});
