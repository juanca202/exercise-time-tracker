"use client";

import type { Tarea } from "@/shared/domain";
import { useAhoraEnVivo } from "../hooks/useAhoraEnVivo";
import { calcularSegundosTranscurridos } from "../lib/calcular-segundos-transcurridos";
import { obtenerColorAcentoTarea } from "../lib/color-acento-tarea";
import { formatearHMS } from "../lib/formatear-tiempo";
import { formatearTiempoRelativo } from "../lib/formatear-tiempo-relativo";

export interface TareaListItemProps {
  tarea: Tarea;
  nombreProyecto: string;
  /** `true` cuando el temporizador activo de la aplicación corresponde a esta Tarea. */
  enEjecucion: boolean;
  onIniciarTemporizador: (tareaId: string) => void;
  onDetenerTemporizador: () => void;
  onEditar: (tarea: Tarea) => void;
  /**
   * Duración acumulada (minutos) de los Registros de Tiempo ya persistidos
   * de esta Tarea, sin incluir la sesión en curso. Por defecto `0`.
   */
  duracionAcumuladaMinutos?: number;
  /**
   * Hora de inicio (ISO 8601) del temporizador en curso. Solo se usa
   * mientras `enEjecucion` es `true`, para sumar en vivo el tiempo
   * transcurrido de la sesión actual a la Duración acumulada mostrada.
   */
  horaInicioTemporizador?: string;
  /**
   * `creadoEn` (ISO 8601) del Registro de Tiempo más reciente de esta
   * Tarea, usado para el texto de recencia ("hace Xh"/"Ayer"). `undefined`
   * si la Tarea todavía no tiene ningún Registro.
   */
  ultimaActividadEn?: string;
}

/**
 * Fila del listado "Tareas Recientes" (frame Figma "Tareas"): ícono de
 * acento, Nombre y Proyecto de la Tarea, Duración acumulada (en vivo
 * mientras está en ejecución) con su recencia, y el control de temporizador
 * (▷ para iniciar / ■ para detener) con el estado activo/inactivo
 * (AC-011), además de la acción de editar (AC-004).
 */
export function TareaListItem({
  tarea,
  nombreProyecto,
  enEjecucion,
  onIniciarTemporizador,
  onDetenerTemporizador,
  onEditar,
  duracionAcumuladaMinutos = 0,
  horaInicioTemporizador,
  ultimaActividadEn,
}: TareaListItemProps) {
  const enVivo = enEjecucion && Boolean(horaInicioTemporizador);
  const ahora = useAhoraEnVivo(enVivo);

  const segundosEnCurso =
    enVivo && horaInicioTemporizador
      ? calcularSegundosTranscurridos(horaInicioTemporizador, ahora)
      : 0;
  const segundosTotales = duracionAcumuladaMinutos * 60 + segundosEnCurso;
  const tiempoRelativo = ultimaActividadEn
    ? formatearTiempoRelativo(ultimaActividadEn)
    : undefined;

  return (
    <li
      data-en-ejecucion={enEjecucion}
      className="flex items-center justify-between gap-4 border-t border-outline-variant p-6 first:border-t-0"
    >
      <div className="flex min-w-0 items-center gap-4">
        <div
          aria-hidden="true"
          className={`flex size-10 shrink-0 items-center justify-center rounded-precision-sm text-sm font-bold text-on-primary ${obtenerColorAcentoTarea(tarea.id)}`}
        >
          {tarea.nombre.charAt(0).toUpperCase()}
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-base font-bold text-primary">
            {tarea.nombre}
          </span>
          <span className="truncate text-sm text-on-surface-variant">
            {nombreProyecto}
          </span>
        </div>
        {enEjecucion && (
          <span className="shrink-0 rounded-full bg-secondary-container px-2 py-0.5 text-xs font-medium text-on-secondary-container">
            En Ejecución
          </span>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-6">
        <div className="text-right">
          <p className="font-mono text-xs tracking-wide text-primary">
            {formatearHMS(segundosTotales)}
          </p>
          {tiempoRelativo && (
            <p className="text-xs text-on-surface-variant">{tiempoRelativo}</p>
          )}
        </div>

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
            className="flex h-10 w-10 items-center justify-center rounded-full bg-error text-on-error"
          >
            ■
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onIniciarTemporizador(tarea.id)}
            aria-label={`Iniciar temporizador de ${tarea.nombre}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary"
          >
            ▷
          </button>
        )}
      </div>
    </li>
  );
}
