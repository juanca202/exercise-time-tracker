import { describe, expect, it } from "vitest";
import { colorFromString } from "./colorFromString";

describe("colorFromString", () => {
  it("retorna siempre el mismo color para el mismo string", () => {
    expect(colorFromString("Rediseño Web")).toBe(
      colorFromString("Rediseño Web"),
    );
  });

  it("retorna un color en formato hexadecimal", () => {
    expect(colorFromString("Auditoría Anual")).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("puede distinguir strings distintos con colores distintos", () => {
    const colors = new Set(
      ["Alfa", "Beta", "Gamma", "Delta", "Epsilon", "Zeta"].map(
        colorFromString,
      ),
    );

    expect(colors.size).toBeGreaterThan(1);
  });
});
