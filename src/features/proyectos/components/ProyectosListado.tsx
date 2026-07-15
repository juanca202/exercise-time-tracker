"use client";

import { useState } from "react";
import { calcularTotalPorProyecto } from "@/features/historial/selectors/calcularTotalPorProyecto";
import type { Proyecto } from "@/shared/domain";
import { useAppStore } from "@/shared/store";
import { TopAppBar } from "@/shared/ui";
import { obtenerColorAcentoProyecto } from "../lib/color-acento-proyecto";
import { formatearTiempoRegistrado } from "../lib/formatear-tiempo-registrado";
import { ProyectoFormModal } from "./ProyectoFormModal";

/**
 * Pantalla de la sección Proyectos (frame Figma "Proyectos"): `TopAppBar`
 * compartido con la acción "Nuevo Proyecto", cuadrícula de tarjetas de
 * Proyecto (nombre, descripción, acento de color y "Tiempo Registrado"
 * acumulado) y una tarjeta "ghost" final para crear un Proyecto, en modo de
 * solo lectura sobre el store compartido (sin estado duplicado ni
 * side-effects de persistencia propios). "Nuevo Proyecto" (TopAppBar) y
 * "Crear Nuevo Proyecto" (tarjeta ghost) son dos disparadores del mismo
 * `ProyectoFormModal` (AC-004); "Editar" por tarjeta abre el mismo modal
 * precargado (AC-005).
 */
export function ProyectosListado() {
  const haHidratado = useAppStore((estado) => estado.haHidratado);
  const proyectos = useAppStore((estado) => estado.proyectos);
  const tareas = useAppStore((estado) => estado.tareas);
  const registrosDeTiempo = useAppStore((estado) => estado.registrosDeTiempo);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [proyectoEnEdicion, setProyectoEnEdicion] = useState<Proyecto | null>(
    null,
  );

  const abrirModalCreacion = () => {
    setProyectoEnEdicion(null);
    setModalAbierto(true);
  };

  const abrirModalEdicion = (proyecto: Proyecto) => {
    setProyectoEnEdicion(proyecto);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  // Reutiliza el selector ya probado de Historial de registros (AC-003 de
  // `historial-de-registros`) en vez de reimplementar la agregación de
  // Registros de Tiempo por Proyecto.
  const totalesPorProyecto = calcularTotalPorProyecto(
    registrosDeTiempo,
    tareas,
    proyectos,
  );

  return (
    <div className="flex w-full flex-col">
      <TopAppBar>
        <button
          type="button"
          onClick={abrirModalCreacion}
          className="rounded-precision-sm bg-primary px-4 py-2 text-sm font-bold text-on-primary hover:bg-primary/90"
        >
          Nuevo Proyecto
        </button>
      </TopAppBar>

      {/*
       * `proyectos` refleja datos persistidos: hasta que `haHidratado` sea
       * `true` no se renderiza ni el estado vacío ni el listado, para evitar
       * un hydration-mismatch entre el render del servidor (siempre vacío) y
       * el primer render del cliente antes de rehidratar (AC-004 de
       * `fundamentos-infraestructura-compartida`).
       */}
      {haHidratado && (
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 p-10">
          <h1 className="text-headline-lg text-primary">Proyectos</h1>

          {proyectos.length === 0 ? (
            <p
              data-testid="proyectos-listado-vacio"
              className="text-body-lg text-on-surface-variant"
            >
              Aún no hay proyectos. Crea el primero con &quot;Nuevo
              Proyecto&quot;.
            </p>
          ) : null}

          <div className="flex flex-wrap items-start gap-6">
            {/*
             * `display: contents` mantiene la lista dentro del flujo del
             * flex-wrap del contenedor (para que la tarjeta ghost se
             * acomode junto a las tarjetas de Proyecto) sin que la tarjeta
             * ghost -que no es un Proyecto- cuente como `listitem`.
             */}
            <ul className="contents">
              {proyectos.map((proyecto) => {
                const tiempoRegistradoMinutos =
                  totalesPorProyecto.get(proyecto.id) ?? 0;

                return (
                  <li
                    key={proyecto.id}
                    className="relative flex w-[290px] flex-col gap-6 overflow-hidden border border-outline-variant bg-surface-container-lowest p-[25px]"
                  >
                    <div
                      aria-hidden="true"
                      className={`absolute inset-y-0 left-0 w-1.5 ${obtenerColorAcentoProyecto(proyecto.id)}`}
                    />

                    <div className="flex flex-col gap-1">
                      <h2 className="text-base font-bold text-primary">
                        {proyecto.nombre}
                      </h2>
                      {proyecto.descripcion ? (
                        <p className="line-clamp-3 text-body-md text-on-surface-variant">
                          {proyecto.descripcion}
                        </p>
                      ) : null}
                    </div>

                    {/*
                     * `mt-auto` ancla el bloque "Tiempo Registrado" y la
                     * acción "Editar" al pie de la tarjeta, alineados entre
                     * tarjetas con descripciones de distinto largo.
                     */}
                    <div className="mt-auto flex items-end justify-between gap-2">
                      <div className="flex flex-col gap-1">
                        <p className="font-mono text-xs font-medium tracking-wide text-on-surface-variant uppercase opacity-50">
                          Tiempo Registrado
                        </p>
                        <p className="font-mono text-xl text-primary">
                          {formatearTiempoRegistrado(tiempoRegistradoMinutos)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => abrirModalEdicion(proyecto)}
                        className="shrink-0 text-sm font-medium text-on-surface-variant hover:text-on-surface"
                      >
                        Editar
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              onClick={abrirModalCreacion}
              className="flex min-h-[250px] w-[290px] flex-col items-center justify-center gap-3 rounded border-2 border-dashed border-outline-variant text-on-surface-variant hover:border-primary/40 hover:text-on-surface"
            >
              <span
                aria-hidden="true"
                className="flex size-12 items-center justify-center rounded-full bg-surface-container-low text-2xl leading-none text-on-surface-variant"
              >
                +
              </span>
              <span className="text-base font-bold">Crear Nuevo Proyecto</span>
            </button>
          </div>
        </div>
      )}

      <ProyectoFormModal
        abierto={modalAbierto}
        onCerrar={cerrarModal}
        proyecto={proyectoEnEdicion}
      />
    </div>
  );
}
