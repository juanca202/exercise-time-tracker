import { describe, expect, it } from "vitest";
import { formatRelativeTime } from "./format-relative-time";

describe("formatRelativeTime", () => {
  const now = new Date(2026, 6, 10, 12, 0, 0).getTime();

  it("formatea minutos recientes como 'hace Nm'", () => {
    expect(formatRelativeTime(now - 5 * 60_000, now)).toBe("hace 5m");
  });

  it("formatea horas recientes como 'hace Nh'", () => {
    expect(formatRelativeTime(now - 2 * 60 * 60_000, now)).toBe("hace 2h");
  });

  it("formatea el día anterior como 'Ayer'", () => {
    expect(formatRelativeTime(now - 30 * 60 * 60_000, now)).toBe("Ayer");
  });

  it("cae de vuelta a la fecha corta más allá de ayer", () => {
    const timestamp = new Date(2026, 5, 20).getTime();
    expect(formatRelativeTime(timestamp, now)).toBe("20 jun. 2026");
  });
});
