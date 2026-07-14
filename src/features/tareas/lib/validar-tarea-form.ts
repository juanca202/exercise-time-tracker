/** Errores de validación del formulario de Tarea, uno por campo. */
export interface ErroresTareaForm {
  proyectoId?: string;
  nombre?: string;
}

/** Resultado de validar el formulario de Tarea (creación o edición). */
export interface ValidacionTareaForm {
  valido: boolean;
  errores: ErroresTareaForm;
}

/**
 * Valida que el Nombre de una Tarea no esté vacío (tras `trim`).
 * Compartida entre creación y edición (solo el Nombre es editable, BR-01).
 */
export function validarNombreTarea(nombre: string): string | undefined {
  return nombre.trim().length > 0 ? undefined : "El Nombre es obligatorio.";
}

/**
 * Valida el formulario completo de creación de Tarea: Proyecto obligatorio y
 * Nombre no vacío (AC-001, AC-002).
 */
export function validarTareaForm(input: {
  proyectoId: string;
  nombre: string;
}): ValidacionTareaForm {
  const errores: ErroresTareaForm = {};

  if (!input.proyectoId) {
    errores.proyectoId = "El Proyecto es obligatorio.";
  }

  const errorNombre = validarNombreTarea(input.nombre);
  if (errorNombre) {
    errores.nombre = errorNombre;
  }

  return { valido: Object.keys(errores).length === 0, errores };
}
