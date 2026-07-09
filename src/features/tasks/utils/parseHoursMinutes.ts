const HOURS_MINUTES_PATTERN = /^(\d{1,3}):([0-5]?\d)$/;

/** Parsea un string `"HH:MM"` a milisegundos, o `null` si el formato es inválido. */
export function parseHoursMinutes(value: string): number | null {
  const match = HOURS_MINUTES_PATTERN.exec(value.trim());
  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return (hours * 60 + minutes) * 60_000;
}
