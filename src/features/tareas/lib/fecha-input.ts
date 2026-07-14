/**
 * Convierte el valor de un `<input type="date">` (`YYYY-MM-DD`) a una fecha
 * ISO 8601 anclada al mediodía en hora local.
 *
 * No se usa `new Date("YYYY-MM-DD")` directamente porque ese formato se
 * interpreta como medianoche UTC: en zonas horarias con offset negativo
 * (p. ej. América), el día calendario local resultante retrocedería un día,
 * lo que rompería el cálculo del rango Lunes-Viernes (BR-05).
 */
export function fechaInputALocalIso(valorInputFecha: string): string {
  const [anio, mes, dia] = valorInputFecha.split("-").map(Number);
  return new Date(anio, mes - 1, dia, 12, 0, 0, 0).toISOString();
}
