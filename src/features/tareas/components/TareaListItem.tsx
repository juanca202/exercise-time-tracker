"use client";

import type { Tarea } from "@/shared/domain";

export interface TareaListItemProps {
  tarea: Tarea;
  nombreProyecto: string;
  /** `true` cuando el temporizador activo de la aplicación corresponde a esta Tarea. */
  enEjecucion: boolean;
  onIniciarTemporizador: (tareaId: string) => void;
  onDetenerTemporizador: () => void;
  onEditar: (tarea: Tarea) => void;
}

/**
 * Fila del listado "Tareas Recientes": muestra el Nombre y Proyecto de la
 * Tarea, el control de temporizador (▷ para iniciar / ■ para detener) y el
 * estado activo/inactivo (AC-011), además de la acción de editar (AC-004).
 */
export function TareaListItem({
  tarea,
  nombreProyecto,
  enEjecucion,
  onIniciarTemporizador,
  onDetenerTemporizador,
  onEditar,
}: TareaListItemProps) {
  return (
    <li
      data-en-ejecucion={enEjecucion}
      className="flex items-center justify-between gap-4 rounded-md border border-outline-variant bg-surface-container-lowest px-4 py-3 shadow-sm data-[en-ejecucion=true]:border-l-2 data-[en-ejecucion=true]:border-l-secondary"
    >
      <div className="flex flex-col">
        <span className="font-sans text-base font-medium text-on-surface">
          {tarea.nombre}
        </span>
        <span className="font-mono text-xs tracking-wide text-on-surface-variant uppercase">
          {nombreProyecto}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {enEjecucion && (
          <span className="rounded-full bg-secondary-container px-2 py-0.5 text-xs font-medium text-on-secondary-container">
            En Ejecución
          </span>
        )}

        <button
          type="button"
          onClick={() => onEditar(tarea)}
          aria-label={`Editar ${tarea.nombre}`}
          className="text-sm font-medium text-on-surface-variant hover:text-on-surface"
        >
          Editar
        </button>

        {enEjecucion ? (
          <button
            type="button"
            onClick={() => onDetenerTemporizador()}
            aria-label={`Detener temporizador de ${tarea.nombre}`}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-error text-on-error"
          >
            ■
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onIniciarTemporizador(tarea.id)}
            aria-label={`Iniciar temporizador de ${tarea.nombre}`}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary"
          >
            ▷
          </button>
        )}
      </div>
    </li>
  );
}
