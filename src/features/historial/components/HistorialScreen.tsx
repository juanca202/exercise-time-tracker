"use client";

import { Progress } from "@base-ui/react/progress";
import { Separator } from "@base-ui/react/separator";
import { useHistorialRegistros } from "../hooks/useHistorialRegistros";
import { EstadoVacioHistorial } from "./EstadoVacioHistorial";
import { TablaHistorial } from "./TablaHistorial";
import { TotalesPorMes } from "./TotalesPorMes";
import { TotalesPorProyecto } from "./TotalesPorProyecto";
import { TotalesPorTarea } from "./TotalesPorTarea";

/**
 * Pantalla "Historial de registros" (US-003): listado completo y de solo
 * lectura de todos los Registros de Tiempo persistidos, junto con los
 * totales de tiempo acumulado por Tarea, por Proyecto y por mes.
 *
 * Orquesta `useHistorialRegistros` y espera `hasHydrated` (patrón de
 * `fundamentos-infraestructura-compartida`) antes de renderizar datos, para
 * evitar hydration-mismatch de Next.js App Router.
 */
export function HistorialScreen() {
  const {
    hasHydrated,
    filas,
    tareas,
    proyectos,
    totalesPorTarea,
    totalesPorProyecto,
    totalesPorMes,
  } = useHistorialRegistros();

  return (
    <div className="flex flex-col gap-8 px-10 py-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-on-surface">
          Historial de registros
        </h1>
        <p className="text-sm text-on-surface-variant">
          Todos los Registros de Tiempo guardados en este dispositivo, con los
          totales acumulados por Tarea, Proyecto y mes.
        </p>
      </header>

      {!hasHydrated ? (
        <Progress.Root value={null} className="flex flex-col gap-2">
          <Progress.Label className="text-sm text-on-surface-variant">
            Cargando historial…
          </Progress.Label>
          <Progress.Track className="h-1.5 w-full max-w-xs overflow-hidden rounded-precision-sm bg-surface-container-high">
            <Progress.Indicator className="h-full w-1/3 animate-pulse rounded-precision-sm bg-primary" />
          </Progress.Track>
        </Progress.Root>
      ) : filas.length === 0 ? (
        <EstadoVacioHistorial />
      ) : (
        <>
          <TotalesPorProyecto
            proyectos={proyectos}
            totalesPorProyecto={totalesPorProyecto}
          />
          <Separator className="h-px bg-outline-variant" />
          <TablaHistorial filas={filas} />
          <Separator className="h-px bg-outline-variant" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <TotalesPorTarea
              tareas={tareas}
              totalesPorTarea={totalesPorTarea}
            />
            <TotalesPorMes totalesPorMes={totalesPorMes} />
          </div>
        </>
      )}
    </div>
  );
}
