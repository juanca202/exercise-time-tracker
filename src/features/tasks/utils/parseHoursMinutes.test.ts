import { describe, expect, it } from "vitest";
import { parseHoursMinutes } from "./parseHoursMinutes";

describe("parseHoursMinutes", () => {
  it("parsea 'HH:MM' a milisegundos", () => {
    expect(parseHoursMinutes("02:30")).toBe((2 * 60 + 30) * 60_000);
  });

  it("acepta minutos de un solo dígito", () => {
    expect(parseHoursMinutes("1:5")).toBe((1 * 60 + 5) * 60_000);
  });

  it("retorna null para un formato inválido", () => {
    expect(parseHoursMinutes("abc")).toBeNull();
    expect(parseHoursMinutes("02-30")).toBeNull();
    expect(parseHoursMinutes("")).toBeNull();
  });

  it("retorna null cuando los minutos no son válidos (>59)", () => {
    expect(parseHoursMinutes("01:75")).toBeNull();
  });
});
