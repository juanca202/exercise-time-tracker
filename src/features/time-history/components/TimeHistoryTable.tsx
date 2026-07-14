import { formatHms } from "@/lib/formatHms";
import type { TaskRow } from "../selectors";
import { formatEntryDate } from "../utils/formatEntryDate";

/** Tabla del historial: una fila por Tarea con actividad en el periodo (AC-002/005). */
export function TimeHistoryTable({ rows }: { rows: TaskRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="p-6 text-on-surface-variant">
        No hay Registros de Tiempo en este periodo.
      </p>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-outline-variant bg-surface-container-low">
          <th className="px-6 py-4 text-left font-mono text-xs tracking-wider text-on-surface-variant uppercase">
            Fecha
          </th>
          <th className="px-6 py-4 text-left font-mono text-xs tracking-wider text-on-surface-variant uppercase">
            Proyecto
          </th>
          <th className="px-6 py-4 text-left font-mono text-xs tracking-wider text-on-surface-variant uppercase">
            Tarea
          </th>
          <th className="px-6 py-4 text-right font-mono text-xs tracking-wider text-on-surface-variant uppercase">
            Duración
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr
            key={row.taskId}
            className={`border-t border-outline-variant/30 ${index % 2 === 1 ? "bg-surface-container-low" : ""}`}
          >
            <td className="px-6 py-4 text-on-surface">
              {formatEntryDate(row.lastActivityIso)}
            </td>
            <td className="px-6 py-4 font-bold text-primary">
              {row.projectName}
            </td>
            <td className="px-6 py-4 text-on-surface-variant">
              {row.taskName}
            </td>
            <td className="px-6 py-4 text-right font-mono text-secondary">
              {formatHms(row.totalMs)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
