import { describe, expect, it } from "vitest";
import {
  crearProyectoDePrueba,
  crearRegistroDeTiempoDePrueba,
  crearTareaDePrueba,
  crearTemporizadorActivoDePrueba,
} from "./object-mother";

describe("tipos de dominio compartidos", () => {
  it("Proyecto expone todos los campos exigidos por el dominio", () => {
    // Arrange
    const sobrescrituras = {
      nombre: "Refactor API",
      descripcion: "Reducir deuda técnica",
    };

    // Act
    const proyecto = crearProyectoDePrueba(sobrescrituras);

    // Assert
    expect(proyecto).toMatchObject({
      id: expect.any(String),
      nombre: "Refactor API",
      descripcion: "Reducir deuda técnica",
      creadoEn: expect.any(String),
    });
  });

  it("Proyecto permite omitir la descripción opcional", () => {
    // Arrange
    const proyecto = crearProyectoDePrueba({ descripcion: undefined });

    // Act & Assert
    expect(proyecto.descripcion).toBeUndefined();
    expect(proyecto.nombre).toEqual(expect.any(String));
  });

  it("Tarea exige una relación obligatoria con su Proyecto", () => {
    // Arrange
    const proyecto = crearProyectoDePrueba();

    // Act
    const tarea = crearTareaDePrueba({
      proyectoId: proyecto.id,
      nombre: "Diseñar wireframes",
    });

    // Assert
    expect(tarea.proyectoId).toBe(proyecto.id);
    expect(tarea).toMatchObject({
      id: expect.any(String),
      nombre: "Diseñar wireframes",
      creadoEn: expect.any(String),
    });
  });

  it("RegistroDeTiempo exige una relación obligatoria con su Tarea", () => {
    // Arrange
    const tarea = crearTareaDePrueba();

    // Act
    const registro = crearRegistroDeTiempoDePrueba({
      tareaId: tarea.id,
      duracionMinutos: 45,
    });

    // Assert
    expect(registro.tareaId).toBe(tarea.id);
    expect(registro).toMatchObject({
      id: expect.any(String),
      fecha: expect.any(String),
      duracionMinutos: 45,
      origen: expect.stringMatching(/^(temporizador|manual)$/),
      creadoEn: expect.any(String),
    });
  });

  it("TemporizadorActivo referencia la Tarea sobre la que corre", () => {
    // Arrange
    const tarea = crearTareaDePrueba();

    // Act
    const temporizadorActivo = crearTemporizadorActivoDePrueba({
      tareaId: tarea.id,
    });

    // Assert
    expect(temporizadorActivo).toMatchObject({
      tareaId: tarea.id,
      horaInicio: expect.any(String),
    });
  });
});
