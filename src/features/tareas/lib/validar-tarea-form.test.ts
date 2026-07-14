import { describe, expect, it } from "vitest";
import { validarNombreTarea, validarTareaForm } from "./validar-tarea-form";

describe("validarTareaForm", () => {
  it("es válido cuando Proyecto y Nombre están presentes", () => {
    // Arrange
    const input = { proyectoId: "proyecto-1", nombre: "Diseñar wireframes" };

    // Act
    const resultado = validarTareaForm(input);

    // Assert
    expect(resultado.valido).toBe(true);
    expect(resultado.errores).toEqual({});
  });

  it("rechaza cuando no hay Proyecto seleccionado", () => {
    // Arrange
    const input = { proyectoId: "", nombre: "Diseñar wireframes" };

    // Act
    const resultado = validarTareaForm(input);

    // Assert
    expect(resultado.valido).toBe(false);
    expect(resultado.errores.proyectoId).toBeDefined();
  });

  it("rechaza cuando el Nombre está vacío", () => {
    // Arrange
    const input = { proyectoId: "proyecto-1", nombre: "" };

    // Act
    const resultado = validarTareaForm(input);

    // Assert
    expect(resultado.valido).toBe(false);
    expect(resultado.errores.nombre).toBeDefined();
  });

  it("rechaza cuando el Nombre contiene únicamente espacios en blanco", () => {
    // Arrange
    const input = { proyectoId: "proyecto-1", nombre: "   " };

    // Act
    const resultado = validarTareaForm(input);

    // Assert
    expect(resultado.valido).toBe(false);
    expect(resultado.errores.nombre).toBeDefined();
  });
});

describe("validarNombreTarea", () => {
  it("no devuelve error para un Nombre no vacío", () => {
    expect(validarNombreTarea("Revisar backlog")).toBeUndefined();
  });

  it("devuelve un error para un Nombre vacío", () => {
    expect(validarNombreTarea("")).toBeDefined();
  });
});
