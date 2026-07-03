import type { Task, TimeEntry } from "../types/domain";

/**
 * Formatea segundos como horas y minutos redondeados hacia abajo
 * (p. ej. `13h 00m`), usado en tarjetas de resumen de tiempo total.
 */
export function formatHoursAndMinutes(seconds: number): string {
  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
}

/**
 * Suma la duración de todos los {@link TimeEntry} pertenecientes a las
 * Tareas de un Proyecto.
 *
 * @returns El total en segundos; `0` si el Proyecto no tiene Tareas o
 * ninguna tiene Registros de Tiempo.
 */
export function projectTotalSeconds(
  projectId: string,
  tasks: Task[],
  timeEntries: TimeEntry[],
): number {
  const taskIds = new Set(
    tasks.filter((task) => task.projectId === projectId).map((task) => task.id),
  );

  return timeEntries
    .filter((entry) => taskIds.has(entry.taskId))
    .reduce((total, entry) => total + entry.durationSeconds, 0);
}
