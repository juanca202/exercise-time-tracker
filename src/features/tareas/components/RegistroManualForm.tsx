"use client";

import { useId, useState } from "react";
import { crearRegistroManual } from "../lib/acciones-registro-manual";
import { parsearDuracionHHMM } from "../lib/parsear-duracion-hhmm";

export interface TareaOpcion {
  id: string;
  nombre: string;
  /** Nombre del Proyecto al que pertenece la Tarea, para el selector combinado "Proyecto / Tarea". */
  nombreProyecto: string;
}

export interface RegistroManualFormProps {
  tareas: TareaOpcion[];
  onRegistroCreado?: () => void;
}

/**
 * Tarjeta bento "Entrada Manual" (frame Figma "Tareas", columnas 9-12):
 * ingreso manual de tiempo (Fecha, selector combinado "Proyecto / Tarea",
 * Duración) como alternativa al temporizador (AC-013).
 *
 * El selector combina Proyecto y Tarea en una sola opción
 * ("{Proyecto} / {Tarea}") porque el store no modela una selección de
 * Proyecto independiente en este formulario: el valor enviado sigue siendo
 * únicamente `tareaId`, igual que antes.
 *
 * La Duración se ingresa en formato `HH:MM` (fiel a Figma) y se convierte a
 * minutos con `parsearDuracionHHMM` antes de validarla: `validar-duracion.ts`
 * y la acción `crearRegistroManual` (defensa en profundidad, AC-014) siguen
 * operando exclusivamente en minutos, sin cambios.
 */
export function RegistroManualForm({
  tareas,
  onRegistroCreado,
}: RegistroManualFormProps) {
  const [tareaId, setTareaId] = useState("");
  const [fecha, setFecha] = useState("");
  const [duracionTexto, setDuracionTexto] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  const idTarea = useId();
  const idFecha = useId();
  const idDuracion = useId();
  const idError = useId();

  const duracionMinutos = parsearDuracionHHMM(duracionTexto);
  const formularioIncompleto =
    !tareaId || !fecha || !duracionTexto || duracionMinutos === null;
  const envioDeshabilitado =
    formularioIncompleto || (duracionMinutos ?? 0) <= 0;

  function manejarEnvio(evento: React.FormEvent<HTMLFormElement>): void {
    evento.preventDefault();

    if (duracionMinutos === null) {
      setError("Ingresa la Duración en formato HH:MM (ej. 02:30).");
      return;
    }
    if (envioDeshabilitado) {
      setError("La Duración debe ser mayor que cero.");
      return;
    }

    const resultado = crearRegistroManual({
      tareaId,
      fecha,
      duracionMinutos,
    });

    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }

    setError(undefined);
    setTareaId("");
    setFecha("");
    setDuracionTexto("");
    onRegistroCreado?.();
  }

  return (
    <div className="col-span-12 flex flex-col gap-6 rounded-precision-sm border border-outline-variant bg-surface-container-lowest p-6 shadow-elevation-1 lg:col-span-4">
      <h3 className="text-headline-md text-primary">Entrada Manual</h3>

      <form onSubmit={manejarEnvio} noValidate className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label
            htmlFor={idFecha}
            className="font-mono text-xs font-medium tracking-wide text-on-surface-variant uppercase"
          >
            Fecha
          </label>
          <input
            id={idFecha}
            type="date"
            value={fecha}
            onChange={(evento) => setFecha(evento.target.value)}
            className="rounded border border-outline-variant bg-surface-container-lowest px-3 py-3 text-sm text-on-surface"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor={idTarea}
            className="font-mono text-xs font-medium tracking-wide text-on-surface-variant uppercase"
          >
            Proyecto / Tarea
          </label>
          <select
            id={idTarea}
            value={tareaId}
            onChange={(evento) => setTareaId(evento.target.value)}
            className="rounded border border-outline-variant bg-surface-container-lowest px-3 py-3 text-sm text-on-surface"
          >
            <option value="" disabled>
              Selecciona una Tarea
            </option>
            {tareas.map((tarea) => (
              <option key={tarea.id} value={tarea.id}>
                {tarea.nombreProyecto} / {tarea.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor={idDuracion}
            className="font-mono text-xs font-medium tracking-wide text-on-surface-variant uppercase"
          >
            Duración
          </label>
          <input
            id={idDuracion}
            type="text"
            inputMode="numeric"
            placeholder="02:30 (HH:MM)"
            value={duracionTexto}
            onChange={(evento) => setDuracionTexto(evento.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? idError : undefined}
            className="rounded border border-outline-variant bg-surface-container-lowest px-3 py-3 text-sm text-on-surface"
          />
          {error && (
            <p id={idError} role="alert" className="text-sm text-error">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={envioDeshabilitado}
          className="rounded-precision-md bg-primary py-4 text-sm font-bold text-on-primary shadow-elevation-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Guardar Registro
        </button>
      </form>
    </div>
  );
}
