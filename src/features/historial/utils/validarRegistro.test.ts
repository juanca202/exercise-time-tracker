import { describe, expect, it } from "vitest";
import {
  crearRegistroDeTiempoDePrueba,
  crearTareaDePrueba,
} from "@/shared/domain/object-mother";
import { esRegistroValido } from "./validarRegistro";

describe("esRegistroValido", () => {
  const tareaDiseno = crearTareaDePrueba({ id: "T-1", nombre: "Diseño UI" });
  const tareasPorId = new Map([[tareaDiseno.id, tareaDiseno]]);

  it("acepta un Registro con Tarea existente, duración y fecha válidas", () => {
    // Arrange
    const registro = crearRegistroDeTiempoDePrueba({
      tareaId: "T-1",
      duracionMinutos: 90,
    });

    // Act & Assert
    expect(esRegistroValido(registro, tareasPorId)).toBe(true);
  });

  it("rechaza un Registro cuya Tarea no existe (huérfano/dangling)", () => {
    // Arrange
    const registro = crearRegistroDeTiempoDePrueba({
      tareaId: "T-inexistente",
      duracionMinutos: 90,
    });

    // Act & Assert
    expect(esRegistroValido(registro, tareasPorId)).toBe(false);
  });

  it("rechaza un Registro con duración de tipo no numérico", () => {
    // Arrange
    const registro = crearRegistroDeTiempoDePrueba({
      tareaId: "T-1",
      duracionMinutos: "no-numerico" as unknown as number,
    });

    // Act & Assert
    expect(esRegistroValido(registro, tareasPorId)).toBe(false);
  });

  it("rechaza un Registro con duración negativa", () => {
    // Arrange
    const registro = crearRegistroDeTiempoDePrueba({
      tareaId: "T-1",
      duracionMinutos: -10,
    });

    // Act & Assert
    expect(esRegistroValido(registro, tareasPorId)).toBe(false);
  });

  it("rechaza un Registro con fecha no parseable", () => {
    // Arrange
    const registro = crearRegistroDeTiempoDePrueba({
      tareaId: "T-1",
      fecha: "2026-13-45",
    });

    // Act & Assert
    expect(esRegistroValido(registro, tareasPorId)).toBe(false);
  });
});
