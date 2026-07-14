"use client";

import Link from "next/link";
import type { Tarea } from "@/shared/domain";
import { TareaListItem } from "./TareaListItem";

export interface TareaRecienteVista {
  tarea: Tarea;
  nombreProyecto: string;
  enEjecucion: boolean;
  duracionAcumuladaMinutos: number;
  horaInicioTemporizador?: string;
  ultimaActividadEn?: string;
}

export interface TareasRecientesCardProps {
  tareas: TareaRecienteVista[];
  onIniciarTemporizador: (tareaId: string) => void;
  onDetenerTemporizador: () => void;
  onEditar: (tarea: Tarea) => void;
}

/**
 * Tarjeta bento de ancho completo "Tareas Recientes" (frame Figma
 * "Tareas"): encabezado con el título y el enlace "Ver Historial" hacia
 * `/historial`, seguido del listado de Tareas con su control de
 * temporizador (delegado por completo a `TareaListItem`, sin duplicar su
 * lógica).
 */
export function TareasRecientesCard({
  tareas,
  onIniciarTemporizador,
  onDetenerTemporizador,
  onEditar,
}: TareasRecientesCardProps) {
  return (
    <div className="col-span-12 flex flex-col overflow-clip rounded-precision-sm border border-outline-variant bg-surface-container-lowest shadow-elevation-1">
      <div className="flex items-center justify-between border-b border-outline-variant bg-surface px-6 py-6">
        <h3 className="text-base font-bold text-primary">Tareas Recientes</h3>
        <Link href="/historial" className="text-sm font-bold text-primary">
          Ver Historial
        </Link>
      </div>

      {tareas.length === 0 ? (
        <p className="p-6 text-sm text-on-surface-variant">
          Todavía no hay Tareas. Crea la primera con &quot;Nueva Tarea&quot;.
        </p>
      ) : (
        <ul>
          {tareas.map((vista) => (
            <TareaListItem
              key={vista.tarea.id}
              tarea={vista.tarea}
              nombreProyecto={vista.nombreProyecto}
              enEjecucion={vista.enEjecucion}
              duracionAcumuladaMinutos={vista.duracionAcumuladaMinutos}
              horaInicioTemporizador={vista.horaInicioTemporizador}
              ultimaActividadEn={vista.ultimaActividadEn}
              onIniciarTemporizador={onIniciarTemporizador}
              onDetenerTemporizador={onDetenerTemporizador}
              onEditar={onEditar}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
