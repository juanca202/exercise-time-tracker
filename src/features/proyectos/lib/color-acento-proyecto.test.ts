import { describe, expect, it } from "vitest";
import { obtenerColorAcentoProyecto } from "./color-acento-proyecto";

describe("obtenerColorAcentoProyecto", () => {
  it("devuelve siempre la misma clase para el mismo id (determinístico)", () => {
    const primeraLlamada = obtenerColorAcentoProyecto("proyecto-1");
    const segundaLlamada = obtenerColorAcentoProyecto("proyecto-1");

    expect(segundaLlamada).toBe(primeraLlamada);
  });

  it("devuelve una clase Tailwind de fondo no vacía", () => {
    expect(obtenerColorAcentoProyecto("proyecto-1")).toMatch(/^bg-/);
  });

  it("puede devolver colores distintos para ids distintos", () => {
    const colores = new Set(
      ["proyecto-1", "proyecto-2", "proyecto-3", "proyecto-4"].map(
        obtenerColorAcentoProyecto,
      ),
    );

    expect(colores.size).toBeGreaterThan(1);
  });
});
