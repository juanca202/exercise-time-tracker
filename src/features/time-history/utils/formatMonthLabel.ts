const MONTHS_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

/** Formatea un periodo `{ year, month }` (mes 0-indexado) como `"Julio 2026"`. */
export function formatMonthLabel(year: number, month: number): string {
  return `${MONTHS_ES[month]} ${year}`;
}
