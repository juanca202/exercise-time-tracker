import type { FilaHistorial } from "../hooks/useHistorialRegistros";
import { formatearDuracion, formatearFecha } from "../utils/formatearDuracion";

const CABECERAS = [
  { etiqueta: "Fecha", alineacion: "text-left" },
  { etiqueta: "Proyecto", alineacion: "text-left" },
  { etiqueta: "Tarea", alineacion: "text-left" },
  { etiqueta: "Duración", alineacion: "text-right" },
] as const;

/**
 * Listado/tabla del historial completo de Registros de Tiempo (AC-001, 2.1):
 * fecha, Proyecto, Tarea y duración de cada fila ya resuelta por
 * `useHistorialRegistros`, en el orden de columnas del frame Figma
 * "Historial de registros" (FECHA/PROYECTO/TAREA/DURACIÓN) y con filas
 * zebra-striped. Pantalla de solo lectura: no ofrece crear, editar ni
 * eliminar Registros (fuera de alcance, ver proposal.md).
 *
 * Requiere `filas` no vacío: la decisión de mostrar el estado vacío
 * (`EstadoVacioHistorial`) es responsabilidad exclusiva de `HistorialScreen`
 * (única llamadora), para no duplicar esa decisión en dos componentes.
 *
 * Es una tabla semántica plana sin ordenamiento/selección interactivos, por
 * lo que no requiere un primitivo de Base UI (ADR-003 cubre componentes
 * *interactivos*: overlays, formularios, navegación); hasta 1000 filas se
 * renderizan sin virtualización, según el presupuesto de rendimiento
 * confirmado en design.md (AC-005). El zebra-stripe usa clases `odd:`/`even:`
 * puramente en CSS (sin estado ni cálculo por fila en JS) para no introducir
 * costo adicional de render sobre ese volumen.
 */
export function TablaHistorial({ filas }: { filas: FilaHistorial[] }) {
  return (
    <div className="overflow-x-auto rounded-precision-lg border border-outline-variant bg-surface-container-lowest">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-outline-variant bg-surface-container-low">
            {CABECERAS.map(({ etiqueta, alineacion }) => (
              <th
                key={etiqueta}
                scope="col"
                className={`px-6 py-4 font-mono text-xs font-medium tracking-wide text-on-surface-variant uppercase ${alineacion}`}
              >
                {etiqueta}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map(({ registro, tarea, proyecto }) => (
            <tr
              key={registro.id}
              className="border-t border-outline-variant/30 first:border-t-0 odd:bg-surface-container-lowest even:bg-surface-container-low"
            >
              <td className="px-6 py-3.5 text-on-surface">
                {formatearFecha(registro.fecha)}
              </td>
              <td className="px-6 py-3.5 font-bold text-primary">
                {proyecto?.nombre ?? "—"}
              </td>
              <td className="px-6 py-3.5 text-on-surface-variant">
                {tarea.nombre}
              </td>
              <td className="px-6 py-3.5 text-right font-mono text-xs font-semibold tracking-wide text-secondary">
                {formatearDuracion(registro.duracionMinutos)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
