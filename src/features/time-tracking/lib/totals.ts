import type { Project, Task, TimeEntry } from "../types/domain";
import { isEntryInMonth } from "./period";

export interface EntityTotal {
  id: string;
  name: string;
  totalSeconds: number;
}

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

/**
 * Suma la duración de todos los {@link TimeEntry} de una Tarea.
 *
 * @returns El total en segundos; `0` si la Tarea no tiene Registros de Tiempo.
 */
export function taskTotalSeconds(
  taskId: string,
  timeEntries: TimeEntry[],
): number {
  return timeEntries
    .filter((entry) => entry.taskId === taskId)
    .reduce((total, entry) => total + entry.durationSeconds, 0);
}

/**
 * Suma la duración de los {@link TimeEntry} cuya fecha cae dentro del
 * mes/año indicado.
 *
 * @returns El total en segundos; `0` si ningún registro cae en ese periodo.
 */
export function monthTotalSeconds(
  timeEntries: TimeEntry[],
  year: number,
  month: number,
): number {
  return timeEntries
    .filter((entry) => isEntryInMonth(entry, year, month))
    .reduce((total, entry) => total + entry.durationSeconds, 0);
}

/**
 * Calcula el tiempo total acumulado por Tarea, ordenado de mayor a menor.
 */
export function totalsByTask(
  tasks: Task[],
  timeEntries: TimeEntry[],
): EntityTotal[] {
  return tasks
    .map((task) => ({
      id: task.id,
      name: task.name,
      totalSeconds: taskTotalSeconds(task.id, timeEntries),
    }))
    .sort((a, b) => b.totalSeconds - a.totalSeconds);
}

/**
 * Calcula el tiempo total acumulado por Proyecto (suma de sus Tareas),
 * ordenado de mayor a menor.
 */
export function totalsByProject(
  projects: Project[],
  tasks: Task[],
  timeEntries: TimeEntry[],
): EntityTotal[] {
  return projects
    .map((project) => ({
      id: project.id,
      name: project.name,
      totalSeconds: projectTotalSeconds(project.id, tasks, timeEntries),
    }))
    .sort((a, b) => b.totalSeconds - a.totalSeconds);
}
