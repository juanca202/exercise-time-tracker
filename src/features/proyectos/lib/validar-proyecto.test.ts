import { describe, expect, it } from "vitest";
import {
  MENSAJE_ERROR_NOMBRE_REQUERIDO,
  validarProyecto,
  type DatosFormularioProyecto,
} from "./validar-proyecto";

/** Object Mother: datos de formulario de Proyecto válidos por defecto. */
const unosDatosDeFormulario = (
  overrides: Partial<DatosFormularioProyecto> = {},
): DatosFormularioProyecto => ({
  nombre: "Proyecto de ejemplo",
  descripcion: "Descripción de ejemplo",
  ...overrides,
});

describe("validarProyecto", () => {
  // TC-001: Nombre y Descripción completos
  it("es válido cuando el Nombre y la Descripción están completos", () => {
    const resultado = validarProyecto(unosDatosDeFormulario());

    expect(resultado).toEqual({ valido: true, errores: {} });
  });

  // TC-002 / TC-009: solo Nombre, sin Descripción
  it("es válido cuando solo se completa el Nombre y la Descripción queda vacía", () => {
    const resultado = validarProyecto(
      unosDatosDeFormulario({ descripcion: "" }),
    );

    expect(resultado).toEqual({ valido: true, errores: {} });
  });

  // TC-003 / TC-011: Nombre vacío
  it("es inválido cuando el Nombre está vacío, con el error de campo requerido", () => {
    const resultado = validarProyecto(unosDatosDeFormulario({ nombre: "" }));

    expect(resultado).toEqual({
      valido: false,
      errores: { nombre: MENSAJE_ERROR_NOMBRE_REQUERIDO },
    });
  });

  // TC-004 / TC-012: Nombre solo espacios en blanco
  it("es inválido cuando el Nombre contiene únicamente espacios en blanco", () => {
    const resultado = validarProyecto(
      unosDatosDeFormulario({ nombre: "    " }),
    );

    expect(resultado.valido).toBe(false);
    expect(resultado.errores.nombre).toBe(MENSAJE_ERROR_NOMBRE_REQUERIDO);
  });

  // TC-010: edición que vacía la Descripción sin afectar la validez
  it("es válido cuando la Descripción se vacía por completo mientras el Nombre es válido", () => {
    const resultado = validarProyecto(
      unosDatosDeFormulario({ nombre: "Proyecto existente", descripcion: "" }),
    );

    expect(resultado).toEqual({ valido: true, errores: {} });
  });

  it("normaliza espacios al inicio/fin del Nombre antes de evaluarlo como no vacío", () => {
    const resultado = validarProyecto(
      unosDatosDeFormulario({ nombre: "   Proyecto con espacios   " }),
    );

    expect(resultado.valido).toBe(true);
  });
});
