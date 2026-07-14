import type { Tarea } from "@/shared/domain";
import { formatearDuracion } from "../utils/formatearDuracion";
import { obtenerTotal } from "../selectors/calcularTotalPorTarea";

/**
 * Total de tiempo acumulado por Tarea (AC-002, 3.3).
 *
 * El prototipo Figma no le da una tarjeta visual propia (ver Observaciones
 * de US-003 y "Open Questions" de design.md), por lo que se integra como
 * una lista compacta de solo lectura en vez de stat cards, evitando
 * duplicar el tratamiento visual de los totales por Proyecto. Una Tarea sin
 * Registros asociados igualmente aparece con total 0.
 */
export function TotalesPorTarea({
  tareas,
  totalesPorTarea,
}: {
  tareas: Tarea[];
  totalesPorTarea: Map<string, number>;
}) {
  if (tareas.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="totales-por-tarea-titulo"
      className="flex flex-col gap-3"
    >
      <h2
        id="totales-por-tarea-titulo"
        className="text-sm font-semibold tracking-wide text-on-surface-variant uppercase"
      >
        Total por Tarea
      </h2>
      <ul className="flex flex-col divide-y divide-outline-variant rounded-precision-lg border border-outline-variant bg-surface-container-lowest">
        {tareas.map((tarea) => (
          <li
            key={tarea.id}
            className="flex items-center justify-between gap-4 px-4 py-2.5 text-sm"
          >
            <span className="truncate text-on-surface">{tarea.nombre}</span>
            <span className="shrink-0 font-mono text-xs font-medium text-on-surface-variant">
              {formatearDuracion(obtenerTotal(totalesPorTarea, tarea.id))}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
