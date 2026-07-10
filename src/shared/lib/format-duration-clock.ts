/**
 * Formatea una duración en segundos como "H:MM:SS" (horas sin acotar a 24,
 * minutos y segundos siempre a 2 dígitos), el formato de reloj usado en el
 * prototipo de Figma para filas de tabla, el temporizador en vivo y el total
 * de horas destacado.
 */
export function formatDurationClock(totalSeconds: number): string {
  const safeSeconds = Math.max(totalSeconds, 0);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = Math.floor(safeSeconds % 60);

  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
