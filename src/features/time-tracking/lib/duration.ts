/** Formatea segundos como `HH:MM:SS`, con ceros a la izquierda. */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const pad = (value: number) => value.toString().padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
}

/**
 * Formatea una marca de tiempo ISO como tiempo relativo legible en español
 * (p. ej. `hace 2h`, `Ayer`), tomando como referencia el instante actual.
 */
export function formatRelativeTime(isoDate: string): string {
  const elapsedMinutes = Math.floor(
    (Date.now() - new Date(isoDate).getTime()) / 60_000,
  );

  if (elapsedMinutes < 1) {
    return "Justo ahora";
  }
  if (elapsedMinutes < 60) {
    return `hace ${elapsedMinutes}min`;
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) {
    return `hace ${elapsedHours}h`;
  }

  const elapsedDays = Math.floor(elapsedHours / 24);
  return elapsedDays === 1 ? "Ayer" : `hace ${elapsedDays} días`;
}
