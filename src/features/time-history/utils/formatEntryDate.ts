const MONTHS_ABBR_ES = [
  "ene.",
  "feb.",
  "mar.",
  "abr.",
  "may.",
  "jun.",
  "jul.",
  "ago.",
  "sep.",
  "oct.",
  "nov.",
  "dic.",
];

/** Formatea una fecha ISO como `"26 jul. 2026"`. */
export function formatEntryDate(iso: string): string {
  const date = new Date(iso);
  return `${date.getDate()} ${MONTHS_ABBR_ES[date.getMonth()]} ${date.getFullYear()}`;
}
