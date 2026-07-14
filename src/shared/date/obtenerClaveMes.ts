/**
 * Calcula la clave de mes calendario (`"YYYY-MM"`) de una fecha, en hora local.
 *
 * Único punto de cálculo del mes calendario de un Registro de Tiempo,
 * consumido tanto por `historial-de-registros` (totales por mes) como por
 * `gestion-tareas-temporizador` (agrupación/filtro por mes), sin que ninguna
 * de las dos features reimplemente esta lógica (ver design.md de
 * `fundamentos-infraestructura-compartida`).
 *
 * @param fecha - Fecha ya parseada (`Date`) válida.
 * @returns Clave de mes con formato `"YYYY-MM"`, p. ej. `"2026-07"`.
 */
export function obtenerClaveMes(fecha: Date): string {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  return `${anio}-${mes}`;
}
