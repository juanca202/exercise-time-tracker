import type { TimeEntry } from "../types/domain";

const MONTH_NAMES = [
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
];

/** Devuelve `true` si la fecha del Registro de Tiempo cae en el mes/año indicado. */
export function isEntryInMonth(
  entry: TimeEntry,
  year: number,
  month: number,
): boolean {
  const [entryYear, entryMonth] = entry.date.split("-").map(Number);
  return entryYear === year && entryMonth === month;
}

/** Formatea un mes/año como etiqueta legible en español (p. ej. `Octubre 2023`). */
export function formatMonthLabel(year: number, month: number): string {
  const name = MONTH_NAMES[month - 1];
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${year}`;
}

/** Suma (o resta) meses a un año/mes, ajustando el año en los bordes. */
export function addMonths(
  year: number,
  month: number,
  delta: number,
): { year: number; month: number } {
  const zeroBasedTotal = year * 12 + (month - 1) + delta;
  return {
    year: Math.floor(zeroBasedTotal / 12),
    month: (((zeroBasedTotal % 12) + 12) % 12) + 1,
  };
}
