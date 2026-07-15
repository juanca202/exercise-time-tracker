import type { Proyecto } from "@/shared/domain";
import { obtenerTotal } from "../selectors/calcularTotalPorTarea";
import { TarjetaTotalProyecto } from "./TarjetaTotalProyecto";

/**
 * Grilla de stat cards ("insight cards", frame Figma "Historial de
 * registros") con el total de tiempo acumulado por Proyecto (AC-003, 4.5).
 * Un Proyecto sin Tareas con Registros de Tiempo se muestra igual, resuelto
 * a 0 vía {@link obtenerTotal}.
 *
 * El Proyecto con más tiempo acumulado recibe la tarjeta "destacada" del
 * mock de Figma (borde izquierdo grueso en `secondary`); en caso de empate
 * se destaca el primero en el orden recibido, de forma determinística.
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

  const idProyectoConMasTiempo = proyectos.reduce<{
    id: string | null;
    totalMinutos: number;
  }>(
    (acumulado, proyecto) => {
      const totalMinutos = obtenerTotal(totalesPorProyecto, proyecto.id);
      return totalMinutos > acumulado.totalMinutos
        ? { id: proyecto.id, totalMinutos }
        : acumulado;
    },
    { id: null, totalMinutos: 0 },
  ).id;

  return (
    <section
      aria-labelledby="totales-por-proyecto-titulo"
      className="flex flex-col gap-3"
    >
      <h2
        id="totales-por-proyecto-titulo"
        className="text-sm font-bold tracking-wide text-primary uppercase"
      >
        Total por Proyecto
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {proyectos.map((proyecto) => (
          <TarjetaTotalProyecto
            key={proyecto.id}
            nombre={proyecto.nombre}
            totalMinutos={obtenerTotal(totalesPorProyecto, proyecto.id)}
            destacado={proyecto.id === idProyectoConMasTiempo}
          />
        ))}
      </div>
    </section>
  );
}
