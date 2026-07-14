import { describe, expect, it } from "vitest";
import { obtenerColorAcentoTarea } from "./color-acento-tarea";

describe("obtenerColorAcentoTarea", () => {
  it("es determinístico: el mismo id siempre devuelve el mismo color", () => {
    const color1 = obtenerColorAcentoTarea("tarea-123");
    const color2 = obtenerColorAcentoTarea("tarea-123");

    expect(color1).toBe(color2);
  });

  it("devuelve siempre una clase Tailwind de fondo no vacía", () => {
    expect(obtenerColorAcentoTarea("tarea-abc")).toMatch(/^bg-/);
    expect(obtenerColorAcentoTarea("")).toMatch(/^bg-/);
  });

  it("varía entre distintos ids (no siempre el mismo color)", () => {
    const ids = ["tarea-1", "tarea-2", "tarea-3", "tarea-4", "tarea-5"];
    const colores = new Set(ids.map(obtenerColorAcentoTarea));

    expect(colores.size).toBeGreaterThan(1);
  });
});
