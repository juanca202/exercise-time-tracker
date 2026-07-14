import { describe, expect, it } from "vitest";
import { calcularSegundosTranscurridos } from "./calcular-segundos-transcurridos";

describe("calcularSegundosTranscurridos", () => {
  it("calcula los segundos transcurridos entre el inicio y ahora", () => {
    const inicio = new Date(2026, 6, 13, 9, 0, 0).toISOString();
    const ahoraMs = new Date(2026, 6, 13, 9, 1, 5).getTime();

    expect(calcularSegundosTranscurridos(inicio, ahoraMs)).toBe(65);
  });

  it("trunca fracciones de segundo", () => {
    const inicio = new Date(2026, 6, 13, 9, 0, 0, 0).toISOString();
    const ahoraMs = new Date(2026, 6, 13, 9, 0, 0, 999).getTime();

    expect(calcularSegundosTranscurridos(inicio, ahoraMs)).toBe(0);
  });

  it("nunca devuelve un valor negativo cuando ahoraMs es anterior al inicio", () => {
    const inicio = new Date(2026, 6, 13, 9, 0, 0).toISOString();
    const ahoraMs = new Date(2026, 6, 13, 8, 0, 0).getTime();

    expect(calcularSegundosTranscurridos(inicio, ahoraMs)).toBe(0);
  });
});
