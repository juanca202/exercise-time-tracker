"use client";

import { useAhoraEnVivo } from "../hooks/useAhoraEnVivo";
import { calcularSegundosTranscurridos } from "../lib/calcular-segundos-transcurridos";
import { formatearHMS, formatearHoraAmPm } from "../lib/formatear-tiempo";

export interface SesionActivaCardProps {
  /** Nombre de la Tarea con el temporizador en curso. `undefined` si no hay ninguna sesión activa. */
  nombreTarea?: string;
  /** Nombre del Proyecto de la Tarea en curso. */
  nombreProyecto?: string;
  /** Hora de inicio (ISO 8601) del temporizador en curso. */
  horaInicio?: string;
  onDetener: () => void;
}

/**
 * Tarjeta bento grande "Sesión Activa" (frame Figma "Tareas", columnas
 * 1-8): Proyecto y nombre de la Tarea en curso, hora de inicio, un contador
 * HH:MM:SS que avanza en vivo y el botón "Detener Sesión" (delega en
 * `onDetener`, ya conectado a `detenerTemporizador` por el llamador).
 *
 * Cuando no hay ningún temporizador activo (`horaInicio` es `undefined`),
 * Figma no cubre este estado porque su mock siempre tiene una sesión en
 * curso: se muestra en su lugar un estado vacío consistente con el sistema
 * de diseño, invitando a iniciar una Tarea desde "Tareas Recientes".
 */
export function SesionActivaCard({
  nombreTarea,
  nombreProyecto,
  horaInicio,
  onDetener,
}: SesionActivaCardProps) {
  const hayTemporizadorActivo = Boolean(horaInicio && nombreTarea);
  const ahora = useAhoraEnVivo(hayTemporizadorActivo);

  if (!hayTemporizadorActivo || !horaInicio) {
    return (
      <div className="col-span-12 flex flex-col items-center justify-center gap-1 rounded-precision-sm border border-outline-variant bg-surface-container-lowest p-9 text-center shadow-elevation-1 lg:col-span-8">
        <p className="text-body-lg text-on-surface-variant">
          No tienes ninguna sesión en curso.
        </p>
        <p className="text-sm text-on-surface-variant">
          Inicia una Tarea desde &quot;Tareas Recientes&quot;.
        </p>
      </div>
    );
  }

  const segundosTranscurridos = calcularSegundosTranscurridos(
    horaInicio,
    ahora,
  );
  const horaInicioFormateada = formatearHoraAmPm(horaInicio);

  return (
    <div className="col-span-12 flex flex-col items-center justify-center gap-1 rounded-precision-sm border border-outline-variant bg-surface-container-lowest p-9 text-center shadow-elevation-1 lg:col-span-8">
      <span className="font-mono text-xs font-medium tracking-wide text-secondary uppercase">
        {nombreProyecto}
      </span>
      <h2 className="text-headline-lg text-primary">{nombreTarea}</h2>
      {horaInicioFormateada && (
        <p className="pt-2 text-body-lg text-on-surface-variant">
          Iniciado a las {horaInicioFormateada}
        </p>
      )}
      <p className="pt-2 font-mono text-6xl font-medium tracking-tight text-primary">
        {formatearHMS(segundosTranscurridos)}
      </p>
      <button
        type="button"
        onClick={onDetener}
        className="mt-6 rounded-precision-sm bg-error-container px-8 py-3 text-base font-bold text-on-error-container"
      >
        Detener Sesión
      </button>
    </div>
  );
}
