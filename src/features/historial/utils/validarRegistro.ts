import type { RegistroDeTiempo, Tarea } from "@/shared/domain";

/**
 * Determina si un Registro de Tiempo tiene forma válida para mostrarse en el
 * listado del historial: `tareaId` referenciando una Tarea existente,
 * `duracionMinutos` numérica/finita/positiva y `fecha` parseable.
 *
 * Es defensiva ante lo que el store expone en memoria (AC-001): un Registro
 * con cualquiera de estos campos inválidos se filtra puntualmente, sin
 * lanzar una excepción ni interrumpir el render del resto del historial.
 */
export function esRegistroValido(
  registro: RegistroDeTiempo,
  tareasPorId: Map<string, Tarea>,
): boolean {
  if (!registro) {
    return false;
  }
  if (
    typeof registro.tareaId !== "string" ||
    !tareasPorId.has(registro.tareaId)
  ) {
    return false;
  }
  if (
    typeof registro.duracionMinutos !== "number" ||
    !Number.isFinite(registro.duracionMinutos) ||
    registro.duracionMinutos <= 0
  ) {
    return false;
  }
  if (typeof registro.fecha !== "string") {
    return false;
  }
  return !Number.isNaN(new Date(registro.fecha).getTime());
}
