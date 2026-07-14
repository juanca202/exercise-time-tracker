import type { Tarea } from "@/shared/domain";
import { generarId, useAppStore } from "@/shared/store";
import {
  validarNombreTarea,
  validarTareaForm,
  type ErroresTareaForm,
} from "./validar-tarea-form";

export type ResultadoCrearTarea =
  | { ok: true; tarea: Tarea }
  | { ok: false; errores: ErroresTareaForm };

export type ResultadoEditarTarea =
  | { ok: true }
  | { ok: false; errores: ErroresTareaForm };

/**
 * Crea una Tarea validando que tenga un Proyecto asociado y un Nombre no
 * vacío (AC-001, AC-002), persistiendo la asociación al Proyecto (AC-003) a
 * través del store raíz compartido.
 *
 * Además de la validación de formulario, verifica que `proyectoId`
 * corresponda a un Proyecto **existente** en el store (BR-01: la Tarea debe
 * asociarse a un Proyecto existente), como defensa en profundidad más allá
 * de lo que ya garantiza el `<select>` de la UI.
 */
export function crearTarea(input: {
  proyectoId: string;
  nombre: string;
}): ResultadoCrearTarea {
  const validacion = validarTareaForm(input);
  if (!validacion.valido) {
    return { ok: false, errores: validacion.errores };
  }

  const store = useAppStore.getState();
  const proyectoExiste = store.proyectos.some(
    (proyecto) => proyecto.id === input.proyectoId,
  );
  if (!proyectoExiste) {
    return {
      ok: false,
      errores: { proyectoId: "El Proyecto seleccionado no existe." },
    };
  }

  const tarea: Tarea = {
    id: generarId(),
    proyectoId: input.proyectoId,
    nombre: input.nombre.trim(),
    creadoEn: new Date().toISOString(),
  };
  store.crearTarea(tarea);
  return { ok: true, tarea };
}

/**
 * Edita el Nombre de una Tarea existente (único campo editable, BR-01),
 * validando que el nuevo Nombre no quede vacío (AC-004).
 */
export function editarTarea(
  tareaId: string,
  input: { nombre: string },
): ResultadoEditarTarea {
  const errorNombre = validarNombreTarea(input.nombre);
  if (errorNombre) {
    return { ok: false, errores: { nombre: errorNombre } };
  }

  useAppStore
    .getState()
    .actualizarTarea(tareaId, { nombre: input.nombre.trim() });
  return { ok: true };
}
