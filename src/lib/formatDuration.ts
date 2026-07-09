const MS_PER_MINUTE = 60_000;
const MINUTES_PER_HOUR = 60;

/** Formatea una duración en milisegundos como `"Hh MMm"` (p. ej. `0` → `"0h 00m"`). */
export function formatDuration(durationMs: number): string {
  const totalMinutes = Math.floor(durationMs / MS_PER_MINUTE);
  const hours = Math.floor(totalMinutes / MINUTES_PER_HOUR);
  const minutes = totalMinutes % MINUTES_PER_HOUR;
  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}
