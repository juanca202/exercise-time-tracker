import { describe, expect, it } from "vitest";
import {
  crearRegistroDeTiempo,
  crearTarea,
} from "@/shared/testing/objectMother";
import { esRegistroValido } from "./validarRegistro";

describe("esRegistroValido", () => {
  const tareaDiseno = crearTarea({ id: "T-1", nombre: "Diseño UI" });
  const tareasPorId = new Map([[tareaDiseno.id, tareaDiseno]]);

  it("acepta un Registro con Tarea existente, duración y fecha válidas", () => {
    // Arrange
    const registro = crearRegistroDeTiempo({ tareaId: "T-1", duracion: 90 });

    // Act & Assert
    expect(esRegistroValido(registro, tareasPorId)).toBe(true);
  });

  it("rechaza un Registro cuya Tarea no existe (huérfano/dangling)", () => {
    // Arrange
    const registro = crearRegistroDeTiempo({
      tareaId: "T-inexistente",
      duracion: 90,
    });

    // Act & Assert
    expect(esRegistroValido(registro, tareasPorId)).toBe(false);
  });

  it("rechaza un Registro con duración de tipo no numérico", () => {
    // Arrange
    const registro = crearRegistroDeTiempo({
      tareaId: "T-1",
      duracion: "no-numerico" as unknown as number,
    });

    // Act & Assert
    expect(esRegistroValido(registro, tareasPorId)).toBe(false);
  });

  it("rechaza un Registro con duración negativa", () => {
    // Arrange
    const registro = crearRegistroDeTiempo({ tareaId: "T-1", duracion: -10 });

    // Act & Assert
    expect(esRegistroValido(registro, tareasPorId)).toBe(false);
  });

  it("rechaza un Registro con fecha de inicio no parseable", () => {
    // Arrange
    const registro = crearRegistroDeTiempo({
      tareaId: "T-1",
      horaInicio: "2026-13-45",
    });

    // Act & Assert
    expect(esRegistroValido(registro, tareasPorId)).toBe(false);
  });
});
