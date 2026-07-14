"use client";

import { useMemo } from "react";
import type { Proyecto, RegistroDeTiempo, Tarea } from "@/shared/domain/types";
import {
  useHasHydrated,
  useTimeTrackerStore,
} from "@/shared/store/useTimeTrackerStore";
import { calcularTotalPorMes } from "../selectors/calcularTotalPorMes";
import { calcularTotalPorProyecto } from "../selectors/calcularTotalPorProyecto";
import { calcularTotalPorTarea } from "../selectors/calcularTotalPorTarea";
import { esRegistroValido } from "../utils/validarRegistro";

/** Una fila del historial ya resuelta con los nombres de Tarea y Proyecto. */
export interface FilaHistorial {
  registro: RegistroDeTiempo;
  tarea: Tarea;
  proyecto: Proyecto | undefined;
}

export interface HistorialRegistros {
  /** `false` mientras el store aún no confirmó la hidratación del cliente. */
  hasHydrated: boolean;
  /** `true` cuando el storage persistido no pudo parsearse (JSON inválido). */
  parseError: boolean;
  /** Filas listas para tabular: solo Registros con forma válida (AC-001). */
  filas: FilaHistorial[];
  tareas: Tarea[];
  proyectos: Proyecto[];
  totalesPorTarea: Map<string, number>;
  totalesPorProyecto: Map<string, number>;
  totalesPorMes: Map<string, number>;
}

/**
 * Lee el historial completo de Registros de Tiempo del store raíz
 * compartido y deriva el listado y los totales por Tarea, Proyecto y mes.
 *
 * No introduce estado propio ni copia el store (ADR-004/ADR-005): consume
 * el arreglo de Registros de Tiempo tal cual lo expone el store y aplica
 * sus propias reglas defensivas de presentación/agregación.
 *
 * Los tres selectores de agregación se memoizan sobre la identidad de los
 * arreglos del store (AC-005/6.1): solo se recalculan cuando cambian, no en
 * cada render de la pantalla.
 */
export function useHistorialRegistros(): HistorialRegistros {
  const { hasHydrated, parseError } = useHasHydrated();
  const registros = useTimeTrackerStore((state) => state.registrosDeTiempo);
  const tareas = useTimeTrackerStore((state) => state.tareas);
  const proyectos = useTimeTrackerStore((state) => state.proyectos);

  const tareasPorId = useMemo(
    () => new Map(tareas.map((tarea) => [tarea.id, tarea])),
    [tareas],
  );
  const proyectosPorId = useMemo(
    () => new Map(proyectos.map((proyecto) => [proyecto.id, proyecto])),
    [proyectos],
  );

  const filas = useMemo<FilaHistorial[]>(
    () =>
      registros
        .filter((registro) => esRegistroValido(registro, tareasPorId))
        .map((registro) => {
          const tarea = tareasPorId.get(registro.tareaId) as Tarea;
          return {
            registro,
            tarea,
            proyecto: proyectosPorId.get(tarea.proyectoId),
          };
        }),
    [registros, tareasPorId, proyectosPorId],
  );

  const totalesPorTarea = useMemo(
    () => calcularTotalPorTarea(registros),
    [registros],
  );
  const totalesPorProyecto = useMemo(
    () => calcularTotalPorProyecto(registros, tareas, proyectos),
    [registros, tareas, proyectos],
  );
  const totalesPorMes = useMemo(
    () => calcularTotalPorMes(registros),
    [registros],
  );

  return {
    hasHydrated,
    parseError,
    filas,
    tareas,
    proyectos,
    totalesPorTarea,
    totalesPorProyecto,
    totalesPorMes,
  };
}
