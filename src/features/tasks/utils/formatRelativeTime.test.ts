import { describe, expect, it } from "vitest";
import { formatRelativeTime } from "./formatRelativeTime";

describe("formatRelativeTime", () => {
  const now = new Date(2026, 6, 8, 15, 0, 0);

  it('formatea menos de un minuto como "Hace instantes"', () => {
    const iso = new Date(2026, 6, 8, 14, 59, 45).toISOString();

    expect(formatRelativeTime(iso, now)).toBe("Hace instantes");
  });

  it("formatea minutos dentro de la misma hora", () => {
    const iso = new Date(2026, 6, 8, 14, 45, 0).toISOString();

    expect(formatRelativeTime(iso, now)).toBe("Hace 15m");
  });

  it("formatea horas dentro del mismo día calendario", () => {
    const iso = new Date(2026, 6, 8, 9, 0, 0).toISOString();

    expect(formatRelativeTime(iso, now)).toBe("Hace 6h");
  });

  it('formatea el día calendario anterior como "Ayer"', () => {
    const iso = new Date(2026, 6, 7, 20, 0, 0).toISOString();

    expect(formatRelativeTime(iso, now)).toBe("Ayer");
  });

  it("formatea más de un día calendario de diferencia como 'Hace N días'", () => {
    const iso = new Date(2026, 6, 5, 10, 0, 0).toISOString();

    expect(formatRelativeTime(iso, now)).toBe("Hace 3 días");
  });
});
