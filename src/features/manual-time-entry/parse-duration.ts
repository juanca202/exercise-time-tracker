const DURATION_PATTERN = /^(\d{1,3}):([0-5]\d)$/;

/** Convierte una Duración en formato `HH:MM` a segundos. Devuelve `null` si el formato es inválido. */
export function parseDurationInput(value: string): number | null {
  const match = DURATION_PATTERN.exec(value.trim());
  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return hours * 3600 + minutes * 60;
}
