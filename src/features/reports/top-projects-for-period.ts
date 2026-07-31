import type { Project, Task, TimeEntry } from "@/shared/store/entities";
import { totalSecondsForProject } from "./calculate-totals";

export interface ProjectPeriodTotal {
  project: Project;
  totalSeconds: number;
}

/**
 * Devuelve los proyectos con más tiempo en el conjunto de Registros dado
 * (p. ej. ya filtrados por mes), ordenados de mayor a menor, hasta `limit`.
 */
export function topProjectsForPeriod(
  timeEntries: TimeEntry[],
  tasks: Task[],
  projects: Project[],
  limit = 3,
): ProjectPeriodTotal[] {
  return projects
    .map((project) => ({
      project,
      totalSeconds: totalSecondsForProject(timeEntries, tasks, project.id),
    }))
    .filter((item) => item.totalSeconds > 0)
    .toSorted((a, b) => b.totalSeconds - a.totalSeconds)
    .slice(0, limit);
}
