import { formatHoursMinutesSeconds } from "@/shared/format-duration";
import type { Project, Task, TimeEntry } from "@/shared/store/entities";
import { formatShortSpanishDate } from "../format-date";

interface HistoryRow {
  entry: TimeEntry;
  taskName: string;
  projectName: string;
}

interface HistoryTableProps {
  timeEntries: TimeEntry[];
  tasks: Task[];
  projects: Project[];
}

/** Tabla e historial de Registros de Tiempo, con resumen (fiel a Figma, nodo 1:1787/1:1853). */
export function HistoryTable({
  timeEntries,
  tasks,
  projects,
}: HistoryTableProps) {
  const rows: HistoryRow[] = timeEntries
    .map((entry) => {
      const task = tasks.find((candidate) => candidate.id === entry.taskId);
      const project = task
        ? projects.find((candidate) => candidate.id === task.projectId)
        : undefined;
      return {
        entry,
        taskName: task?.name ?? "",
        projectName: project?.name ?? "",
      };
    })
    .sort((a, b) => b.entry.date.localeCompare(a.entry.date));

  const totalSeconds = timeEntries.reduce(
    (total, entry) => total + entry.durationSeconds,
    0,
  );
  const distinctProjectCount = new Set(
    rows.map((row) => row.projectName).filter(Boolean),
  ).size;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-outline-variant bg-white shadow-sm">
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full text-left">
          <thead className="sticky top-0 z-[1]">
            <tr className="border-b border-outline-variant bg-surface-container-low">
              <th className="px-6 py-4 font-mono text-xs tracking-wider text-on-surface-variant uppercase">
                Fecha
              </th>
              <th className="px-6 py-4 font-mono text-xs tracking-wider text-on-surface-variant uppercase">
                Proyecto
              </th>
              <th className="px-6 py-4 font-mono text-xs tracking-wider text-on-surface-variant uppercase">
                Tarea
              </th>
              <th className="px-6 py-4 text-right font-mono text-xs tracking-wider text-on-surface-variant uppercase">
                Duración
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-6 text-sm text-on-surface-variant"
                >
                  No hay Registros de Tiempo en este periodo.
                </td>
              </tr>
            ) : (
              rows.map(({ entry, taskName, projectName }, index) => (
                <tr
                  key={entry.id}
                  className={
                    index % 2 === 1 ? "bg-surface-container-low" : undefined
                  }
                >
                  <td className="px-6 py-4 text-base text-on-surface">
                    {formatShortSpanishDate(entry.date)}
                  </td>
                  <td className="px-6 py-4 text-base font-bold text-primary">
                    {projectName}
                  </td>
                  <td className="px-6 py-4 text-base text-on-surface-variant">
                    {taskName}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-sm text-secondary">
                    {formatHoursMinutesSeconds(entry.durationSeconds)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex shrink-0 items-center justify-between border-t border-outline-variant bg-surface-container-low px-6 py-6">
        <div className="flex items-center gap-6">
          <div>
            <p className="font-mono text-xs tracking-wider text-outline uppercase">
              Registros encontrados
            </p>
            <p className="text-base font-bold text-primary">
              {rows.length} registros
            </p>
          </div>
          <div className="h-8 w-px bg-outline-variant" />
          <div>
            <p className="font-mono text-xs tracking-wider text-outline uppercase">
              Proyecto
            </p>
            <p className="text-base font-bold text-primary">
              {distinctProjectCount} proyectos
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-primary px-6 py-3 text-white shadow-md">
          <span className="font-mono text-xs uppercase opacity-70">
            Total de horas
          </span>
          <span className="text-2xl">
            {formatHoursMinutesSeconds(totalSeconds)}
          </span>
        </div>
      </div>
    </div>
  );
}
