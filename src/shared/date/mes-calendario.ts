import type { RegistroDeTiempo } from "@/shared/domain";

/**
 * Calcula el mes calendario de un Registro de Tiempo a partir de su campo
 * `fecha` (ISO 8601, `YYYY-MM-DD`), devolviendo un formato único y estable
 * (`YYYY-MM`). Tareas e Historial de registros DEBEN importar esta misma
 * función en lugar de reimplementar el cálculo o depender entre sí (AC-006):
 * para el mismo registro, ambas obtienen siempre el mismo resultado.
 *
 * @param registro - Registro de Tiempo cuyo mes calendario se desea calcular.
 * @returns El mes calendario en formato `YYYY-MM`.
 */
export function obtenerMesCalendario(registro: RegistroDeTiempo): string {
  return registro.fecha.slice(0, 7);
}
