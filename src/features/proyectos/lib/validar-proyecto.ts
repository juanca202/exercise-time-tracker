/** Mensaje de error mostrado cuando el campo Nombre no es válido. */
export const MENSAJE_ERROR_NOMBRE_REQUERIDO = "El nombre es obligatorio.";

/** Datos crudos del formulario de Proyecto (creación o edición). */
export interface DatosFormularioProyecto {
  nombre: string;
  descripcion: string;
}

/** Errores de validación de Proyecto, por campo. */
export interface ErroresValidacionProyecto {
  nombre?: string;
}

/** Resultado de validar los datos de un formulario de Proyecto. */
export interface ResultadoValidacionProyecto {
  valido: boolean;
  errores: ErroresValidacionProyecto;
}

/**
 * Valida los datos de un formulario de Proyecto (BR-01/BR-02): el Nombre es
 * obligatorio tras normalizar espacios (`trim`); la Descripción es siempre
 * opcional. Función pura, reutilizada por los flujos de creación y edición
 * del mismo modal.
 */
export function validarProyecto(
  datos: DatosFormularioProyecto,
): ResultadoValidacionProyecto {
  const nombreNormalizado = datos.nombre.trim();

  if (!nombreNormalizado) {
    return {
      valido: false,
      errores: { nombre: MENSAJE_ERROR_NOMBRE_REQUERIDO },
    };
  }

  return { valido: true, errores: {} };
}
