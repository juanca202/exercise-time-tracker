export interface Period {
  year: number;
  /** 0-11, como `Date.getMonth()`. */
  month: number;
}

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

export function getCurrentPeriod(): Period {
  const now = new Date();

  return { year: now.getFullYear(), month: now.getMonth() };
}

export function getPreviousPeriod(period: Period): Period {
  return period.month === 0
    ? { year: period.year - 1, month: 11 }
    : { year: period.year, month: period.month - 1 };
}

export function getNextPeriod(period: Period): Period {
  return period.month === 11
    ? { year: period.year + 1, month: 0 }
    : { year: period.year, month: period.month + 1 };
}

export function formatPeriodLabel(period: Period): string {
  return `${MONTH_LABELS[period.month]} ${period.year}`;
}

export function isTimestampInPeriod(
  timestampMs: number,
  period: Period,
): boolean {
  const date = new Date(timestampMs);

  return date.getFullYear() === period.year && date.getMonth() === period.month;
}
