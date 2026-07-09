import { useProjectsStore } from "@/features/projects";
import { useTasksStore } from "@/features/tasks";
import { endOfMonth, isWithinRange, startOfMonth } from "@/lib/dateRanges";
import type { TimeEntry } from "@/features/tasks";

/** Fila del historial: una Tarea con su tiempo acumulado y última actividad dentro del periodo. */
export interface TaskRow {
  taskId: string;
  taskName: string;
  projectName: string;
  totalMs: number;
  lastActivityIso: string;
}

/** Resumen del periodo seleccionado: registros encontrados, proyectos involucrados y total de horas. */
export interface MonthSummary {
  recordCount: number;
  projectCount: number;
  totalMs: number;
}

/** Registros de Tiempo cuya fecha (`endedAt`) cae dentro del mes calendario `year`/`month` (0-indexado). */
export function selectEntriesInMonth(year: number, month: number): TimeEntry[] {
  const reference = new Date(year, month, 1);
  const start = startOfMonth(reference);
  const end = endOfMonth(reference);

  return useTasksStore
    .getState()
    .timeEntries.filter((entry) => isWithinRange(entry.endedAt, start, end));
}

/**
 * Una fila por Tarea con actividad en el periodo, con su tiempo acumulado y última actividad,
 * ordenadas por última actividad descendente (decisión tomada tras revisión de fidelidad Figma:
 * agrupar por Tarea en vez de listar cada Registro de Tiempo individual — ver design.md).
 */
export function selectTaskRowsForMonth(year: number, month: number): TaskRow[] {
  const entries = selectEntriesInMonth(year, month);
  const { tasks } = useTasksStore.getState();
  const { projects } = useProjectsStore.getState();

  const byTask = new Map<
    string,
    { totalMs: number; lastActivityIso: string }
  >();
  for (const entry of entries) {
    const current = byTask.get(entry.taskId) ?? {
      totalMs: 0,
      lastActivityIso: entry.endedAt,
    };
    current.totalMs += entry.durationMs;
    if (entry.endedAt > current.lastActivityIso) {
      current.lastActivityIso = entry.endedAt;
    }
    byTask.set(entry.taskId, current);
  }

  const rows: TaskRow[] = [];
  for (const [taskId, aggregate] of byTask) {
    const task = tasks.find((candidate) => candidate.id === taskId);
    if (!task) {
      continue;
    }
    const project = projects.find(
      (candidate) => candidate.id === task.projectId,
    );
    rows.push({
      taskId,
      taskName: task.name,
      projectName: project?.name ?? "",
      totalMs: aggregate.totalMs,
      lastActivityIso: aggregate.lastActivityIso,
    });
  }

  return rows.sort((a, b) => (a.lastActivityIso < b.lastActivityIso ? 1 : -1));
}

/** Tiempo total acumulado de un Proyecto dentro del periodo (0 si no tiene Registros de Tiempo en él). */
export function selectProjectTotalInMonth(
  projectId: string,
  year: number,
  month: number,
): number {
  const entries = selectEntriesInMonth(year, month);
  const taskIds = new Set(
    useTasksStore
      .getState()
      .tasks.filter((task) => task.projectId === projectId)
      .map((task) => task.id),
  );

  return entries
    .filter((entry) => taskIds.has(entry.taskId))
    .reduce((sum, entry) => sum + entry.durationMs, 0);
}

/** Resumen del periodo: cantidad de Registros de Tiempo, Proyectos involucrados y total de horas. */
export function selectMonthSummary(year: number, month: number): MonthSummary {
  const entries = selectEntriesInMonth(year, month);
  const { tasks } = useTasksStore.getState();

  const projectIds = new Set<string>();
  let totalMs = 0;
  for (const entry of entries) {
    totalMs += entry.durationMs;
    const task = tasks.find((candidate) => candidate.id === entry.taskId);
    if (task) {
      projectIds.add(task.projectId);
    }
  }

  return {
    recordCount: entries.length,
    projectCount: projectIds.size,
    totalMs,
  };
}
