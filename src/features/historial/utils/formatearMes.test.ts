import { describe, expect, it } from "vitest";
import { formatearMes } from "./formatearMes";

describe("formatearMes", () => {
  it("formatea una clave de mes válida a español", () => {
    expect(formatearMes("2026-07")).toBe("Julio 2026");
    expect(formatearMes("2026-01")).toBe("Enero 2026");
    expect(formatearMes("2026-12")).toBe("Diciembre 2026");
  });

  it("devuelve la clave original si no tiene el formato YYYY-MM", () => {
    expect(formatearMes("no-es-un-mes")).toBe("no-es-un-mes");
  });

  it("devuelve la clave original si el número de mes está fuera de rango", () => {
    expect(formatearMes("2026-13")).toBe("2026-13");
  });
});
