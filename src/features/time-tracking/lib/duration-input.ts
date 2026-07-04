const DURATION_INPUT_PATTERN = /^(\d{1,3}):([0-5]\d)$/;

/**
 * Interpreta una Duración ingresada como texto `HH:MM` y la convierte a
 * segundos.
 *
 * @returns Los segundos totales, o `null` si el formato es inválido o la
 * duración resultante no es mayor que cero.
 */
export function parseDurationInput(value: string): number | null {
  const match = DURATION_INPUT_PATTERN.exec(value.trim());
  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const totalSeconds = hours * 3600 + minutes * 60;

  return totalSeconds > 0 ? totalSeconds : null;
}
