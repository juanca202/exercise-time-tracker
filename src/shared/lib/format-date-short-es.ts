const MONTH_ABBREVIATIONS_ES = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

/**
 * Formatea un timestamp (ms) como "D mmm. AAAA" en español (p. ej.
 * "26 oct. 2023"), el formato de fecha usado en la tabla del Historial del
 * prototipo de Figma. Se calcula manualmente (sin `Intl`) para no depender
 * de los datos de localización del entorno de ejecución.
 */
export function formatDateShortEs(timestampMs: number): string {
  const date = new Date(timestampMs);

  return `${date.getDate()} ${MONTH_ABBREVIATIONS_ES[date.getMonth()]}. ${date.getFullYear()}`;
}
