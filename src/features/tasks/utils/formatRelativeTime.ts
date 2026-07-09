const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

function startOfCalendarDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Formatea la recencia de una fecha ISO como "Hace Xm/Xh", "Ayer" o "Hace N días". */
export function formatRelativeTime(
  iso: string,
  now: Date = new Date(),
): string {
  const date = new Date(iso);
  const diffMs = now.getTime() - date.getTime();
  const dayDiff = Math.round(
    (startOfCalendarDay(now).getTime() - startOfCalendarDay(date).getTime()) /
      DAY_MS,
  );

  if (dayDiff <= 0) {
    if (diffMs < MINUTE_MS) {
      return "Hace instantes";
    }
    if (diffMs < HOUR_MS) {
      return `Hace ${Math.floor(diffMs / MINUTE_MS)}m`;
    }
    return `Hace ${Math.floor(diffMs / HOUR_MS)}h`;
  }

  if (dayDiff === 1) {
    return "Ayer";
  }

  return `Hace ${dayDiff} días`;
}
