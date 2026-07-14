"use client";

import type { RegistroDeTiempo } from "@/shared/domain";
import { calcularTotalSemanal } from "../lib/calcular-total-semanal";
import { calcularTotalMensual } from "../lib/calcular-total-mensual";
import { calcularPorcentajeMeta } from "../lib/calcular-porcentaje-meta";
import { formatearHorasYMinutos } from "../lib/formatear-tiempo";

export interface ResumenTareasProps {
  /** Registros de Tiempo (temporizador y manuales) desde los que se derivan los totales. */
  registros: RegistroDeTiempo[];
  /** Fecha "actual" usada para determinar la semana y el mes en curso. Por defecto, ahora. */
  fecha?: Date;
}

function TarjetaStat({
  etiqueta,
  minutos,
}: {
  etiqueta: string;
  minutos: number;
}) {
  return (
    <div className="flex min-w-40 flex-col gap-1 rounded-precision-sm border border-outline-variant bg-surface-container-lowest px-5 py-4 shadow-sm">
      <span className="font-mono text-xs font-medium tracking-wide text-on-surface-variant uppercase">
        {etiqueta}
      </span>
      <span className="text-2xl font-bold text-primary">
        {formatearHorasYMinutos(minutos)}
      </span>
    </div>
  );
}

/**
 * Sección "Welcome Summary" del frame Figma "Tareas": título "Tareas",
 * subtítulo con el porcentaje alcanzado de la Meta Semanal (AC-019) y las
 * tarjetas de stat "Total Semanal" (AC-018) y "Total Mensual".
 *
 * La Meta Semanal en sí es un valor fijo de 40h no configurable (AC-017,
 * BR-05): no hay ningún control de edición en esta sección ni en ninguna
 * otra parte de la pantalla. El Total Mensual reutiliza
 * `obtenerMesCalendario` (`@/shared/date`), el mismo cálculo de mes
 * calendario que ya usa Historial de registros, vía `calcularTotalMensual`.
 */
export function ResumenTareas({
  registros,
  fecha = new Date(),
}: ResumenTareasProps) {
  const totalSemanalHoras = calcularTotalSemanal(registros, fecha);
  const totalMensualHoras = calcularTotalMensual(registros, fecha);
  const porcentaje = calcularPorcentajeMeta(totalSemanalHoras);

  return (
    <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
      <div className="flex flex-col gap-1">
        <h1 className="text-headline-lg text-primary">Tareas</h1>
        <p className="text-body-lg text-on-surface-variant">
          Has alcanzado el{" "}
          <span className="font-bold text-secondary">
            {Math.round(porcentaje)}%
          </span>{" "}
          de tu meta semanal.
        </p>
      </div>

      <div className="flex gap-4">
        <TarjetaStat
          etiqueta="Total Semanal"
          minutos={totalSemanalHoras * 60}
        />
        <TarjetaStat
          etiqueta="Total Mensual"
          minutos={totalMensualHoras * 60}
        />
      </div>
    </div>
  );
}
