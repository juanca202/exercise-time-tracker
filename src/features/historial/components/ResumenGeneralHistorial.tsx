import type { FilaHistorial } from "../hooks/useHistorialRegistros";
import { formatearDuracion } from "../utils/formatearDuracion";

/**
 * Barra de resumen inferior de la tabla de Historial (lenguaje visual del
 * frame Figma "Historial de registros": conteo de registros + segundo
 * desglose + total general destacado en un pill de superficie inversa).
 *
 * A diferencia del mock de Figma (que combina "registros encontrados" con
 * un conteo de Proyectos), aquí se muestra el conteo de Proyectos
 * representados junto al de Registros: es información que hoy no está
 * expuesta en ningún otro lugar de la pantalla (las tarjetas de
 * `TotalesPorProyecto` muestran el total de tiempo por Proyecto, no cuántos
 * Proyectos hay), por lo que no duplica nada existente.
 *
 * El total general tampoco lo expone ningún selector de agregación
 * existente (`calcularTotalPorTarea`/`Proyecto`/`Mes` agregan por clave, no
 * un total absoluto): se deriva aquí sumando `duracionMinutos` sobre
 * `filas`, ya filtradas/validadas por `useHistorialRegistros` (AC-001), sin
 * reimplementar ningún selector.
 */
export function ResumenGeneralHistorial({
  filas,
  cantidadProyectos,
}: {
  filas: FilaHistorial[];
  cantidadProyectos: number;
}) {
  const totalGeneralMinutos = filas.reduce(
    (acumulado, fila) => acumulado + fila.registro.duracionMinutos,
    0,
  );

  return (
    <div className="flex flex-col items-start justify-between gap-4 rounded-precision-lg border border-outline-variant bg-surface-container-low px-6 py-4 sm:flex-row sm:items-center">
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex flex-col gap-0.5">
          <p className="font-mono text-xs font-medium tracking-wide text-on-surface-variant uppercase">
            Registros encontrados
          </p>
          <p className="text-sm font-bold text-primary">
            {filas.length} {filas.length === 1 ? "registro" : "registros"}
          </p>
        </div>
        <div
          aria-hidden="true"
          className="hidden h-8 w-px bg-outline-variant sm:block"
        />
        <div className="flex flex-col gap-0.5">
          <p className="font-mono text-xs font-medium tracking-wide text-on-surface-variant uppercase">
            Proyectos
          </p>
          <p className="text-sm font-bold text-primary">
            {cantidadProyectos}{" "}
            {cantidadProyectos === 1 ? "proyecto" : "proyectos"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-precision-sm bg-inverse-surface px-5 py-2.5">
        <p className="font-mono text-xs tracking-wide text-on-primary/70 uppercase">
          Total de horas
        </p>
        <p className="font-mono text-lg font-semibold text-on-primary">
          {formatearDuracion(totalGeneralMinutos)}
        </p>
      </div>
    </div>
  );
}
