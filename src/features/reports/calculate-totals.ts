import type { Task, TimeEntry } from "@/shared/store/entities";

/** Total de tiempo acumulado (segundos) de una Tarea, sumando sus Registros de Tiempo. */
export function totalSecondsForTask(
  timeEntries: TimeEntry[],
  taskId: string,
): number {
  return timeEntries
    .filter((entry) => entry.taskId === taskId)
    .reduce((total, entry) => total + entry.durationSeconds, 0);
}

/** Total de tiempo acumulado (segundos) de un Proyecto, como suma de los totales de sus Tareas. */
export function totalSecondsForProject(
  timeEntries: TimeEntry[],
  tasks: Task[],
  projectId: string,
): number {
  return tasks
    .filter((task) => task.projectId === projectId)
    .reduce(
      (total, task) => total + totalSecondsForTask(timeEntries, task.id),
      0,
    );
}

/** Total de tiempo acumulado (segundos) en un mes (`month`: 1-12). */
export function totalSecondsForMonth(
  timeEntries: TimeEntry[],
  year: number,
  month: number,
): number {
  const prefix = `${year}-${month.toString().padStart(2, "0")}`;
  return timeEntries
    .filter((entry) => entry.date.startsWith(prefix))
    .reduce((total, entry) => total + entry.durationSeconds, 0);
}

/** Lunes (00:00) de la semana ISO que contiene `date`. */
export function startOfIsoWeek(date: Date): Date {
  const startOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const day = startOfDay.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  startOfDay.setDate(startOfDay.getDate() + diffToMonday);
  return startOfDay;
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Total de tiempo acumulado (segundos) en la semana ISO (lunes-domingo) que contiene `referenceDate`. */
export function totalSecondsForWeek(
  timeEntries: TimeEntry[],
  referenceDate: Date,
): number {
  const monday = startOfIsoWeek(referenceDate);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const mondayIso = toIsoDate(monday);
  const sundayIso = toIsoDate(sunday);

  return timeEntries
    .filter((entry) => entry.date >= mondayIso && entry.date <= sundayIso)
    .reduce((total, entry) => total + entry.durationSeconds, 0);
}
