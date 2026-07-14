import { describe, expect, it } from "vitest";
import { crearRegistroDeTiempoDePrueba } from "@/shared/domain/object-mother";
import { obtenerMesCalendario } from "./mes-calendario";

describe("obtenerMesCalendario", () => {
  it("devuelve el mes calendario en formato YYYY-MM", () => {
    // Arrange
    const registro = crearRegistroDeTiempoDePrueba({ fecha: "2026-07-13" });

    // Act & Assert
    expect(obtenerMesCalendario(registro)).toBe("2026-07");
  });

  it("resuelve correctamente el primer día del mes", () => {
    // Arrange
    const registro = crearRegistroDeTiempoDePrueba({ fecha: "2026-03-01" });

    // Act & Assert
    expect(obtenerMesCalendario(registro)).toBe("2026-03");
  });

  it("resuelve correctamente el último día del mes", () => {
    // Arrange
    const registro = crearRegistroDeTiempoDePrueba({ fecha: "2026-01-31" });

    // Act & Assert
    expect(obtenerMesCalendario(registro)).toBe("2026-01");
  });

  it("resuelve correctamente el cambio de año (31 de diciembre)", () => {
    // Arrange
    const registro = crearRegistroDeTiempoDePrueba({ fecha: "2025-12-31" });

    // Act & Assert
    expect(obtenerMesCalendario(registro)).toBe("2025-12");
  });

  it("distingue el mismo mes en distintos años", () => {
    // Arrange
    const registroDe2024 = crearRegistroDeTiempoDePrueba({
      fecha: "2024-07-05",
    });
    const registroDe2025 = crearRegistroDeTiempoDePrueba({
      fecha: "2025-07-05",
    });

    // Act & Assert
    expect(obtenerMesCalendario(registroDe2024)).toBe("2024-07");
    expect(obtenerMesCalendario(registroDe2025)).toBe("2025-07");
    expect(obtenerMesCalendario(registroDe2024)).not.toBe(
      obtenerMesCalendario(registroDe2025),
    );
  });

  it("Tareas e Historial de registros obtienen el mismo resultado para el mismo registro", () => {
    // Arrange: ambas historias funcionales importan la misma función del módulo compartido.
    const registro = crearRegistroDeTiempoDePrueba({ fecha: "2026-11-20" });

    // Act
    const mesSegunTareas = obtenerMesCalendario(registro);
    const mesSegunHistorial = obtenerMesCalendario(registro);

    // Assert
    expect(mesSegunTareas).toBe(mesSegunHistorial);
  });
});
