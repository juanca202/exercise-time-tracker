const MONTH_ABBREVIATIONS = [
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

/** Formatea una fecha ISO (`YYYY-MM-DD`) como "26 oct. 2026". */
export function formatShortSpanishDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const dayNumber = Number(day);
  const monthName = MONTH_ABBREVIATIONS[month - 1];
  return `${dayNumber} ${monthName}. ${year}`;
}

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

/** Formatea un año y mes (1-12) como "Octubre 2026". */
export function formatMonthLabel(year: number, month: number): string {
  const monthName = MONTH_NAMES[month - 1];
  return `${monthName.charAt(0).toUpperCase()}${monthName.slice(1)} ${year}`;
}
