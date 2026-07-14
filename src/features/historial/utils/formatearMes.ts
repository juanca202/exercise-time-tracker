const MESES_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
] as const;

/**
 * Formatea una clave de mes `"YYYY-MM"` (la que produce `obtenerClaveMes`)
 * como etiqueta legible en español, p. ej. `"2026-07"` → `"Julio 2026"`.
 * Devuelve la clave original sin formatear si no tiene el formato esperado
 * (defensivo, no lanza).
 */
export function formatearMes(claveMes: string): string {
  const coincidencia = /^(\d{4})-(\d{2})$/.exec(claveMes);
  if (!coincidencia) {
    return claveMes;
  }

  const anio = coincidencia[1];
  const indiceMes = Number(coincidencia[2]) - 1;
  const nombreMes = MESES_ES[indiceMes];
  if (!nombreMes) {
    return claveMes;
  }

  return `${nombreMes.charAt(0).toUpperCase()}${nombreMes.slice(1)} ${anio}`;
}
