/**
 * Duración con precisión de segundos entre dos timestamps (ms), consistente
 * con el escenario límite de "duración mínima válida = 1 segundo" para el
 * temporizador (ver design de `task-time-tracking`).
 */
export function calculateDurationSeconds(
  startedAtMs: number,
  endedAtMs: number,
): number {
  return Math.floor((endedAtMs - startedAtMs) / 1000);
}
