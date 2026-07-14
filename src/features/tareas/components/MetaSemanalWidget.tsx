"use client";

import type { RegistroDeTiempo } from "@/shared/domain";
import { META_SEMANAL_HORAS } from "../lib/constantes";
import { calcularTotalSemanal } from "../lib/calcular-total-semanal";
import { calcularPorcentajeMeta } from "../lib/calcular-porcentaje-meta";

export interface MetaSemanalWidgetProps {
  /** Registros de Tiempo (temporizador y manuales) desde los que se deriva el Total Semanal. */
  registros: RegistroDeTiempo[];
  /** Fecha "actual" usada para determinar la semana laboral en curso. Por defecto, ahora. */
  fecha?: Date;
}

function formatearHoras(horas: number): string {
  return `${horas.toFixed(1)}h`;
}

/**
 * Widget "Meta semanal": muestra la Meta Semanal fija (40h, sin control de
 * edición, AC-017), el Total Semanal acumulado de Lunes a Viernes (AC-018) y
 * el porcentaje alcanzado sin techo visual en 100% (AC-019). Se recalcula en
 * tiempo real porque recibe `registros` ya reactivo desde el store raíz.
 */
export function MetaSemanalWidget({
  registros,
  fecha = new Date(),
}: MetaSemanalWidgetProps) {
  const totalSemanalHoras = calcularTotalSemanal(registros, fecha);
  const porcentaje = calcularPorcentajeMeta(totalSemanalHoras);
  const anchoBarra = Math.min(porcentaje, 100);

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-outline-variant bg-surface-container-lowest p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-xs tracking-wide text-on-surface-variant uppercase">
          Total Semanal
        </span>
        <span className="font-sans text-3xl font-bold text-on-surface">
          {formatearHoras(totalSemanalHoras)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 sm:max-w-xs">
        <div className="flex items-center justify-between text-sm text-on-surface-variant">
          <span>Meta semanal</span>
          <span className="font-mono">
            {formatearHoras(META_SEMANAL_HORAS)} · {porcentaje}%
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={porcentaje}
          aria-valuemin={0}
          aria-valuemax={Math.max(100, porcentaje)}
          aria-label="Porcentaje de la Meta Semanal alcanzado"
          className="h-2 w-full overflow-hidden rounded-full bg-surface-container"
        >
          <div
            className="h-full rounded-full bg-secondary-container transition-[width]"
            style={{ width: `${anchoBarra}%` }}
          />
        </div>
      </div>
    </div>
  );
}
