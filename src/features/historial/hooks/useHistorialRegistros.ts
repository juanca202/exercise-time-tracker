"use client";

import { useMemo } from "react";
import type { Proyecto, RegistroDeTiempo, Tarea } from "@/shared/domain";
import { useAppStore } from "@/shared/store";
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
 * compartido (`useAppStore`) y deriva el listado y los totales por Tarea,
 * Proyecto y mes.
 *
 * No introduce estado propio ni copia el store (ADR-004/ADR-005): consume
 * el arreglo de Registros de Tiempo tal cual lo expone el store y aplica
 * sus propias reglas defensivas de presentación/agregación. Un storage
 * corrupto (JSON inválido) se degrada, vía el adaptador de persistencia
 * compartido, al mismo estado vacío que un historial legítimamente sin
 * Registros (AC-001): no hay forma de distinguir ambos casos desde el store
 * raíz, y ambos se resuelven al mismo estado vacío controlado sin lanzar.
 *
 * Los tres selectores de agregación se memoizan sobre la identidad de los
 * arreglos del store (AC-005/6.1): solo se recalculan cuando cambian, no en
 * cada render de la pantalla.
 */
export function useHistorialRegistros(): HistorialRegistros {
  const hasHydrated = useAppStore((state) => state.haHidratado);
  const registros = useAppStore((state) => state.registrosDeTiempo);
  const tareas = useAppStore((state) => state.tareas);
  const proyectos = useAppStore((state) => state.proyectos);

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
    filas,
    tareas,
    proyectos,
    totalesPorTarea,
    totalesPorProyecto,
    totalesPorMes,
  };
}
