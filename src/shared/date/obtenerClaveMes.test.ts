import { describe, expect, it } from "vitest";
import { obtenerClaveMes } from "./obtenerClaveMes";

describe("obtenerClaveMes", () => {
  it("devuelve la clave YYYY-MM de una fecha a mitad de mes", () => {
    // Arrange
    const fecha = new Date(2026, 5, 15); // 2026-06-15 (mes 5 = junio, 0-indexado)

    // Act
    const clave = obtenerClaveMes(fecha);

    // Assert
    expect(clave).toBe("2026-06");
  });

  it("rellena con cero el mes de un solo dígito", () => {
    // Arrange
    const fecha = new Date(2026, 0, 1); // 2026-01-01

    // Act
    const clave = obtenerClaveMes(fecha);

    // Assert
    expect(clave).toBe("2026-01");
  });

  it("atribuye el último instante de un mes a ese mismo mes (sin cruzar al siguiente)", () => {
    // Arrange
    const fecha = new Date(2026, 6, 31, 23, 0, 0); // 2026-07-31 23:00

    // Act
    const clave = obtenerClaveMes(fecha);

    // Assert
    expect(clave).toBe("2026-07");
  });
});
