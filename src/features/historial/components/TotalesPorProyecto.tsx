import type { Proyecto } from "@/shared/domain";
import { obtenerTotal } from "../selectors/calcularTotalPorTarea";
import { TarjetaTotalProyecto } from "./TarjetaTotalProyecto";

/**
 * Grilla de stat cards con el total de tiempo acumulado por Proyecto
 * (AC-003, 4.5). Un Proyecto sin Tareas con Registros de Tiempo se muestra
 * igual, resuelto a 0 vía {@link obtenerTotal}.
 */
export function TotalesPorProyecto({
  proyectos,
  totalesPorProyecto,
}: {
  proyectos: Proyecto[];
  totalesPorProyecto: Map<string, number>;
}) {
  if (proyectos.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="totales-por-proyecto-titulo"
      className="flex flex-col gap-3"
    >
      <h2
        id="totales-por-proyecto-titulo"
        className="text-sm font-semibold tracking-wide text-on-surface-variant uppercase"
      >
        Total por Proyecto
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {proyectos.map((proyecto) => (
          <TarjetaTotalProyecto
            key={proyecto.id}
            nombre={proyecto.nombre}
            totalMinutos={obtenerTotal(totalesPorProyecto, proyecto.id)}
          />
        ))}
      </div>
    </section>
  );
}
