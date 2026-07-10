/**
 * Formatea una duración en segundos como texto "Xh YYm" (p. ej. `3h 30m`,
 * `0h 00m`), consistente con el prototipo de alta fidelidad y los casos de
 * prueba de Proyectos e Historial.
 */
export function formatDuration(totalSeconds: number): string {
  const totalMinutes = Math.floor(Math.max(totalSeconds, 0) / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
}
