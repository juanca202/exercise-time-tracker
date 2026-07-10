import type { Project } from "@/features/project-management";
import type { Task, TimeEntry } from "@/features/task-time-tracking";
import { formatDateShortEs } from "@/shared/lib/format-date-short-es";

export interface HistoryEntry {
  id: string;
  date: string;
  projectName: string;
  taskName: string;
  durationSeconds: number;
}

export interface TaskTotal {
  taskId: string;
  taskName: string;
  totalSeconds: number;
}

export interface ProjectTotal {
  projectId: string;
  projectName: string;
  totalSeconds: number;
}

export interface PeriodSummary {
  recordCount: number;
  projectCount: number;
  totalSeconds: number;
}

export interface TimeHistoryAggregation {
  entries: HistoryEntry[];
  totalsByTask: TaskTotal[];
  totalsByProject: ProjectTotal[];
  monthTotalSeconds: number;
  summary: PeriodSummary;
}

/**
 * Agrega, en una única pasada sobre los Registros de Tiempo ya filtrados por
 * periodo, los totales por Tarea, por Proyecto y del mes, más el resumen del
 * periodo (registros, proyectos involucrados vía `Set`, total de horas) — ver
 * design de `time-history`. Los totales por Tarea/Proyecto incluyen las que
 * no tienen actividad en el periodo (total 0), mientras que el resumen solo
 * cuenta Proyectos con al menos un Registro en el periodo.
 */
export function aggregateTimeHistory({
  entriesInPeriod,
  tasks,
  projects,
}: {
  entriesInPeriod: TimeEntry[];
  tasks: Task[];
  projects: Project[];
}): TimeHistoryAggregation {
  const taskById = new Map(tasks.map((task) => [task.id, task]));
  const projectById = new Map(projects.map((project) => [project.id, project]));

  const secondsByTask = new Map<string, number>();
  const secondsByProject = new Map<string, number>();
  const involvedProjectIds = new Set<string>();
  const entries: HistoryEntry[] = [];
  let monthTotalSeconds = 0;

  const sortedEntries = [...entriesInPeriod].sort(
    (a, b) => b.startedAt - a.startedAt,
  );

  for (const entry of sortedEntries) {
    const task = taskById.get(entry.taskId);
    const project = task ? projectById.get(task.projectId) : undefined;

    monthTotalSeconds += entry.durationSeconds;
    secondsByTask.set(
      entry.taskId,
      (secondsByTask.get(entry.taskId) ?? 0) + entry.durationSeconds,
    );

    if (task) {
      secondsByProject.set(
        task.projectId,
        (secondsByProject.get(task.projectId) ?? 0) + entry.durationSeconds,
      );
      involvedProjectIds.add(task.projectId);
    }

    entries.push({
      id: entry.id,
      date: formatDateShortEs(entry.startedAt),
      projectName: project?.name ?? "",
      taskName: task?.name ?? "",
      durationSeconds: entry.durationSeconds,
    });
  }

  const totalsByTask: TaskTotal[] = tasks.map((task) => ({
    taskId: task.id,
    taskName: task.name,
    totalSeconds: secondsByTask.get(task.id) ?? 0,
  }));

  const totalsByProject: ProjectTotal[] = projects.map((project) => ({
    projectId: project.id,
    projectName: project.name,
    totalSeconds: secondsByProject.get(project.id) ?? 0,
  }));

  return {
    entries,
    totalsByTask,
    totalsByProject,
    monthTotalSeconds,
    summary: {
      recordCount: entriesInPeriod.length,
      projectCount: involvedProjectIds.size,
      totalSeconds: monthTotalSeconds,
    },
  };
}
