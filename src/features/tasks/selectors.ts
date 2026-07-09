import {
  endOfMonth,
  endOfWeek,
  isWithinRange,
  startOfMonth,
  startOfWeek,
} from "@/lib/dateRanges";
import { useTasksStore } from "./store/tasksStore";

/** Meta semanal fija: 8 horas por día hábil (lunes a viernes) = 40h. No es configurable ni se persiste. */
export const WEEKLY_GOAL_MS = 8 * 5 * 60 * 60 * 1000;

/** Tiempo total acumulado de una Tarea, en milisegundos (0 si no tiene Registros de Tiempo). */
export function selectTaskTotalTime(taskId: string): number {
  return useTasksStore
    .getState()
    .timeEntries.filter((entry) => entry.taskId === taskId)
    .reduce((sum, entry) => sum + entry.durationMs, 0);
}

/** Fecha ISO del `endedAt` más reciente entre los Registros de Tiempo de una Tarea, o `null` si no tiene ninguno. */
export function selectTaskLastActivity(taskId: string): string | null {
  const entries = useTasksStore
    .getState()
    .timeEntries.filter((entry) => entry.taskId === taskId);
  if (entries.length === 0) {
    return null;
  }
  return entries.reduce(
    (latest, entry) => (entry.endedAt > latest ? entry.endedAt : latest),
    entries[0].endedAt,
  );
}

function sumEntriesInRange(start: Date, end: Date): number {
  return useTasksStore
    .getState()
    .timeEntries.filter((entry) => isWithinRange(entry.endedAt, start, end))
    .reduce((sum, entry) => sum + entry.durationMs, 0);
}

/** Suma de Registros de Tiempo dentro de la semana calendario (lunes a domingo) que contiene `now`. */
export function selectWeeklyTotal(now: Date = new Date()): number {
  return sumEntriesInRange(startOfWeek(now), endOfWeek(now));
}

/** Suma de Registros de Tiempo dentro del mes calendario que contiene `now`. */
export function selectMonthlyTotal(now: Date = new Date()): number {
  return sumEntriesInRange(startOfMonth(now), endOfMonth(now));
}

/** Progreso (0-100) del total semanal respecto a la meta semanal fija de 40h. */
export function selectWeeklyGoalProgress(now: Date = new Date()): number {
  return Math.min(
    100,
    Math.round((selectWeeklyTotal(now) / WEEKLY_GOAL_MS) * 100),
  );
}
