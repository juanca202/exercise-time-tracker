import type { FilaHistorial } from "../hooks/useHistorialRegistros";
import { formatearDuracion, formatearFecha } from "../utils/formatearDuracion";

/**
 * Listado/tabla del historial completo de Registros de Tiempo (AC-001, 2.1):
 * Tarea, Proyecto, fecha y duración de cada fila ya resuelta por
 * `useHistorialRegistros`. Pantalla de solo lectura: no ofrece crear,
 * editar ni eliminar Registros (fuera de alcance, ver proposal.md).
 *
 * Requiere `filas` no vacío: la decisión de mostrar el estado vacío
 * (`EstadoVacioHistorial`) es responsabilidad exclusiva de `HistorialScreen`
 * (única llamadora), para no duplicar esa decisión en dos componentes.
 *
 * Es una tabla semántica plana sin ordenamiento/selección interactivos, por
 * lo que no requiere un primitivo de Base UI (ADR-003 cubre componentes
 * *interactivos*: overlays, formularios, navegación); hasta 1000 filas se
 * renderizan sin virtualización, según el presupuesto de rendimiento
 * confirmado en design.md (AC-005).
 */
export function TablaHistorial({ filas }: { filas: FilaHistorial[] }) {
  return (
    <div className="overflow-x-auto rounded-precision-lg border border-outline-variant bg-surface-container-lowest">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-outline-variant bg-surface-container-low">
            <th
              scope="col"
              className="px-4 py-3 font-semibold text-on-surface-variant"
            >
              Tarea
            </th>
            <th
              scope="col"
              className="px-4 py-3 font-semibold text-on-surface-variant"
            >
              Proyecto
            </th>
            <th
              scope="col"
              className="px-4 py-3 font-semibold text-on-surface-variant"
            >
              Fecha
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right font-semibold text-on-surface-variant"
            >
              Duración
            </th>
          </tr>
        </thead>
        <tbody>
          {filas.map(({ registro, tarea, proyecto }) => (
            <tr
              key={registro.id}
              className="border-b border-outline-variant last:border-b-0 hover:bg-surface-container-low"
            >
              <td className="px-4 py-2.5 text-on-surface">{tarea.nombre}</td>
              <td className="px-4 py-2.5 text-on-surface-variant">
                {proyecto?.nombre ?? "—"}
              </td>
              <td className="px-4 py-2.5 font-mono text-xs text-on-surface-variant">
                {formatearFecha(registro.fecha)}
              </td>
              <td className="px-4 py-2.5 text-right font-mono text-xs font-medium text-on-surface">
                {formatearDuracion(registro.duracionMinutos)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
