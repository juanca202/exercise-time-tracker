"use client";

import { useId, useState } from "react";
import { crearRegistroManual } from "../lib/acciones-registro-manual";

export interface TareaOpcion {
  id: string;
  nombre: string;
}

export interface RegistroManualFormProps {
  tareas: TareaOpcion[];
  onRegistroCreado?: () => void;
}

/**
 * Formulario de ingreso manual de tiempo (Tarea, Fecha, Duración en minutos),
 * como alternativa al temporizador (AC-013). La Duración se valida tanto en
 * la UI (deshabilita el envío) como en la acción del store (defensa en
 * profundidad, AC-014).
 */
export function RegistroManualForm({
  tareas,
  onRegistroCreado,
}: RegistroManualFormProps) {
  const [tareaId, setTareaId] = useState("");
  const [fecha, setFecha] = useState("");
  const [duracionMinutos, setDuracionMinutos] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  const idTarea = useId();
  const idFecha = useId();
  const idDuracion = useId();
  const idError = useId();

  const duracionNumerica = Number(duracionMinutos);
  const formularioIncompleto =
    !tareaId ||
    !fecha ||
    !duracionMinutos ||
    !Number.isFinite(duracionNumerica);
  const envioDeshabilitado = formularioIncompleto || duracionNumerica <= 0;

  function manejarEnvio(evento: React.FormEvent<HTMLFormElement>): void {
    evento.preventDefault();
    if (envioDeshabilitado) {
      setError("La Duración debe ser mayor que cero.");
      return;
    }

    const resultado = crearRegistroManual({
      tareaId,
      fecha,
      duracionMinutos: duracionNumerica,
    });

    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }

    setError(undefined);
    setTareaId("");
    setFecha("");
    setDuracionMinutos("");
    onRegistroCreado?.();
  }

  return (
    <form
      onSubmit={manejarEnvio}
      noValidate
      className="flex flex-col gap-4 rounded-lg border border-outline-variant bg-surface-container-lowest p-4"
    >
      <h2 className="font-sans text-lg font-semibold text-on-surface">
        Registrar tiempo manual
      </h2>

      <div className="flex flex-col gap-1">
        <label
          htmlFor={idTarea}
          className="text-sm font-medium text-on-surface"
        >
          Tarea
        </label>
        <select
          id={idTarea}
          value={tareaId}
          onChange={(evento) => setTareaId(evento.target.value)}
          className="rounded border border-outline-variant bg-surface-container-lowest px-3 py-2 text-on-surface"
        >
          <option value="" disabled>
            Selecciona una Tarea
          </option>
          {tareas.map((tarea) => (
            <option key={tarea.id} value={tarea.id}>
              {tarea.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor={idFecha}
          className="text-sm font-medium text-on-surface"
        >
          Fecha
        </label>
        <input
          id={idFecha}
          type="date"
          value={fecha}
          onChange={(evento) => setFecha(evento.target.value)}
          className="rounded border border-outline-variant bg-surface-container-lowest px-3 py-2 text-on-surface"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor={idDuracion}
          className="text-sm font-medium text-on-surface"
        >
          Duración (minutos)
        </label>
        <input
          id={idDuracion}
          type="number"
          min={1}
          step={1}
          value={duracionMinutos}
          onChange={(evento) => setDuracionMinutos(evento.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? idError : undefined}
          className="rounded border border-outline-variant bg-surface-container-lowest px-3 py-2 text-on-surface"
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
        className="self-start rounded bg-primary px-4 py-2 text-sm font-medium text-on-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        Registrar tiempo
      </button>
    </form>
  );
}
