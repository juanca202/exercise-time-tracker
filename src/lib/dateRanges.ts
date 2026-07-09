const DAY_MS = 24 * 60 * 60 * 1000;

function startOfCalendarDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Lunes 00:00 de la semana calendario que contiene `date`. */
export function startOfWeek(date: Date): Date {
  const day = startOfCalendarDay(date);
  const weekday = day.getDay(); // 0=domingo ... 6=sábado
  const diffToMonday = weekday === 0 ? -6 : 1 - weekday;
  day.setDate(day.getDate() + diffToMonday);
  return day;
}

/** Límite superior (exclusivo) de la semana calendario que contiene `date`: el lunes siguiente. */
export function endOfWeek(date: Date): Date {
  const start = startOfWeek(date);
  return new Date(start.getTime() + 7 * DAY_MS);
}

/** Día 1 00:00 del mes calendario que contiene `date`. */
export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/** Límite superior (exclusivo) del mes calendario que contiene `date`: el día 1 del mes siguiente. */
export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

/** `true` si la fecha ISO cae dentro de `[start, end)`. */
export function isWithinRange(iso: string, start: Date, end: Date): boolean {
  const time = new Date(iso).getTime();
  return time >= start.getTime() && time < end.getTime();
}
