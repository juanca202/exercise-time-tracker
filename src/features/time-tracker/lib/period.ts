export type Period = { year: number; month: number }; // month: 1-12

const MONTH_LABELS = [
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

export function getCurrentPeriod(now: Date): Period {
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export function formatPeriodLabel(period: Period): string {
  const monthName = MONTH_LABELS[period.month - 1];
  const capitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  return `${capitalized} ${period.year}`;
}

export function shiftPeriod(period: Period, delta: number): Period {
  const zeroBasedMonth = period.month - 1 + delta;
  const year = period.year + Math.floor(zeroBasedMonth / 12);
  const month = (((zeroBasedMonth % 12) + 12) % 12) + 1;
  return { year, month };
}

export function isDateInPeriod(dateStr: string, period: Period): boolean {
  const [year, month] = dateStr.split("-").map(Number);
  return year === period.year && month === period.month;
}
