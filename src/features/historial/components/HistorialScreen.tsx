"use client";

import { Progress } from "@base-ui/react/progress";
import { TopAppBar } from "@/shared/ui";
import { useHistorialRegistros } from "../hooks/useHistorialRegistros";
import { EstadoVacioHistorial } from "./EstadoVacioHistorial";
import { ResumenGeneralHistorial } from "./ResumenGeneralHistorial";
import { TablaHistorial } from "./TablaHistorial";
import { TotalesPorMes } from "./TotalesPorMes";
import { TotalesPorProyecto } from "./TotalesPorProyecto";
import { TotalesPorTarea } from "./TotalesPorTarea";

/**
 * Pantalla "Historial de registros" (US-003): listado completo y de solo
 * lectura de todos los Registros de Tiempo persistidos, junto con los
 * totales de tiempo acumulado por Tarea, por Proyecto y por mes.
 *
 * Reconciliada con el frame Figma "Historial de registros": mismo
 * `TopAppBar` compartido que Tareas/Proyectos (aquí sin acción, ver su
 * comentario), tarjetas de insight para el total por Proyecto, tabla
 * zebra-striped para el listado completo y una barra de resumen inferior.
 * El mock de Figma no modela exactamente los tres desgloses que exige la
 * spec real (Tarea/Proyecto/mes, cada uno con su propio AC): se adopta su
 * lenguaje visual (tarjeta ícono+label+valor, fila zebra, pill oscuro) para
 * los tres, en vez de recortar cualquiera de ellos para encajar en las "3
 * tarjetas fijas" del mock (ver `TotalesPorTarea`/`TotalesPorMes`).
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
    <div className="flex w-full flex-col">
      {/*
       * A diferencia de Tareas/Proyectos, Historial es de solo lectura: no
       * hay acción de creación que colocar en el TopAppBar. El mock de
       * Figma sugiere un ícono a la derecha (posible exportar/filtrar) sin
       * ningún AC que lo respalde hoy, así que se deja vacío en vez de
       * inventar una acción sin funcionalidad real.
       */}
      <TopAppBar>{null}</TopAppBar>

      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 p-10">
        <header className="flex flex-col gap-1">
          <h1 className="text-headline-lg text-primary">
            Historial de registros
          </h1>
          <p className="text-body-lg text-on-surface-variant">
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
            <div className="flex flex-col gap-3">
              <TablaHistorial filas={filas} />
              <ResumenGeneralHistorial
                filas={filas}
                cantidadProyectos={proyectos.length}
              />
            </div>
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
    </div>
  );
}
