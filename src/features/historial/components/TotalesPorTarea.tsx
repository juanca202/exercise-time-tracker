import type { Tarea } from "@/shared/domain";
import { formatearDuracion } from "../utils/formatearDuracion";
import { obtenerTotal } from "../selectors/calcularTotalPorTarea";

/**
 * Total de tiempo acumulado por Tarea (AC-002, 3.3).
 *
 * El prototipo Figma no le da una tarjeta visual propia (ver Observaciones
 * de US-003 y "Open Questions" de design.md), por lo que se integra como
 * una lista compacta de solo lectura en vez de stat cards, evitando
 * duplicar el tratamiento visual de los totales por Proyecto. En su lugar
 * adopta el mismo lenguaje visual de fila zebra-striped y duración
 * monoespaciada en `secondary` que la tabla principal del historial, para
 * que los tres desgloses (Proyecto, Tarea, mes) se lean como un mismo
 * sistema. Una Tarea sin Registros asociados igualmente aparece con total
 * 0.
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
        className="text-sm font-bold tracking-wide text-primary uppercase"
      >
        Total por Tarea
      </h2>
      <ul className="flex flex-col divide-y divide-outline-variant overflow-hidden rounded-precision-lg border border-outline-variant bg-surface-container-lowest">
        {tareas.map((tarea, indice) => (
          <li
            key={tarea.id}
            className={`flex items-center justify-between gap-4 px-4 py-2.5 text-sm ${
              indice % 2 === 1 ? "bg-surface-container-low" : ""
            }`}
          >
            <span className="truncate text-on-surface-variant">
              {tarea.nombre}
            </span>
            <span className="shrink-0 font-mono text-xs font-semibold tracking-wide text-secondary">
              {formatearDuracion(obtenerTotal(totalesPorTarea, tarea.id))}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
