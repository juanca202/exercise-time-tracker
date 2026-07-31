import { describe, expect, it } from "vitest";
import { colorFromString, isLightColor } from "./color-from-string";

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

describe("colorFromString", () => {
  it("devuelve el mismo color para el mismo string", () => {
    expect(colorFromString("Wireframing")).toBe(colorFromString("Wireframing"));
  });

  it("devuelve colores distintos para strings distintos", () => {
    expect(colorFromString("Wireframing")).not.toBe(
      colorFromString("Documentación de Producto"),
    );
  });

  it("reparte colores distintos entre varios nombres", () => {
    const names = [
      "Wireframing",
      "Documentación",
      "Nexus App",
      "Quantum",
      "Auditoría",
      "Portal Cliente",
      "OpenUI",
      "Brand Redesign",
    ];
    const colors = new Set(names.map((name) => colorFromString(name)));
    expect(colors.size).toBe(names.length);
  });

  it("devuelve un color CSS hex válido", () => {
    expect(colorFromString("Proyecto OpenUI")).toMatch(HEX_COLOR);
    expect(colorFromString("")).toMatch(HEX_COLOR);
  });

  it("genera colores con luminancia apta para icono claro (no demasiado claros)", () => {
    const samples = [
      "A",
      "B",
      "Tarea larga de ejemplo",
      "Proyecto X",
      "zzz",
    ].map((name) => colorFromString(name));

    for (const color of samples) {
      expect(isLightColor(color)).toBe(false);
    }
  });
});
