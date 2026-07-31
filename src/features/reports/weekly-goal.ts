/** Meta semanal fija: 8 horas × 5 días laborables (ver US-004, RS-001). */
export const WEEKLY_GOAL_HOURS = 40;

/**
 * Porcentaje de avance hacia la meta semanal, capado en 100 aunque el
 * Total semanal supere las `WEEKLY_GOAL_HOURS` horas.
 */
export function calculateWeeklyGoalPercentage(
  totalSecondsThisWeek: number,
): number {
  const goalSeconds = WEEKLY_GOAL_HOURS * 3600;
  const percentage = (totalSecondsThisWeek / goalSeconds) * 100;
  return Math.min(100, Math.round(percentage));
}
