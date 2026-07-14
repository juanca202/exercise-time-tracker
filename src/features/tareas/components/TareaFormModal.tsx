"use client";

import { useId, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import type { Tarea } from "@/shared/domain";
import { crearTarea, editarTarea } from "../lib/acciones-tareas";
import type { ErroresTareaForm } from "../lib/validar-tarea-form";

export type ModoTareaFormModal = "crear" | "editar";

export interface ProyectoOpcion {
  id: string;
  nombre: string;
}

export interface TareaFormModalProps {
  /** Controla si el modal está abierto. */
  open: boolean;
  /** Modo del modal: `crear` para "Nueva Tarea", `editar` para "Editar Tarea". */
  modo: ModoTareaFormModal;
  /** Proyectos existentes disponibles para asociar la Tarea. */
  proyectos: ProyectoOpcion[];
  /** Tarea a editar. Requerida cuando `modo === "editar"`. */
  tarea?: Tarea;
  /** Notifica los cambios de apertura/cierre (controlado por el padre). */
  onOpenChange: (open: boolean) => void;
  /** Notifica que la Tarea se creó o editó con éxito. */
  onGuardado?: () => void;
}

const TITULOS: Record<ModoTareaFormModal, string> = {
  crear: "Nueva Tarea",
  editar: "Editar Tarea",
};

/**
 * Modal único de creación/edición de Tarea, parametrizado por `modo`
 * (AC-004). En modo `crear` solicita Proyecto y Nombre; en modo `editar`
 * precarga los datos existentes y solo permite modificar el Nombre.
 */
export function TareaFormModal({
  open,
  modo,
  proyectos,
  tarea,
  onOpenChange,
  onGuardado,
}: TareaFormModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-inverse-surface/40 backdrop-blur-[8px]" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-outline-variant bg-surface-container-lowest p-6 shadow-xl">
          {/*
           * `key` fuerza un remount del contenido cada vez que cambia el modo o
           * la Tarea a editar (o el modal se cierra), de modo que el estado
           * local del formulario se inicialice directamente desde las props
           * sin necesitar un `useEffect` que llame a `setState` (evita
           * cascading renders, ver react-hooks/set-state-in-effect).
           */}
          <TareaFormModalContenido
            key={open ? `${modo}-${tarea?.id ?? "nueva"}` : "cerrado"}
            modo={modo}
            proyectos={proyectos}
            tarea={tarea}
            onOpenChange={onOpenChange}
            onGuardado={onGuardado}
          />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

interface TareaFormModalContenidoProps {
  modo: ModoTareaFormModal;
  proyectos: ProyectoOpcion[];
  tarea?: Tarea;
  onOpenChange: (open: boolean) => void;
  onGuardado?: () => void;
}

function TareaFormModalContenido({
  modo,
  proyectos,
  tarea,
  onOpenChange,
  onGuardado,
}: TareaFormModalContenidoProps) {
  const [proyectoId, setProyectoId] = useState(() =>
    modo === "editar" && tarea ? tarea.proyectoId : "",
  );
  const [nombre, setNombre] = useState(() =>
    modo === "editar" && tarea ? tarea.nombre : "",
  );
  const [errores, setErrores] = useState<ErroresTareaForm>({});
  const idProyecto = useId();
  const idNombre = useId();
  const idErrorProyecto = useId();
  const idErrorNombre = useId();

  function manejarConfirmar(evento: React.FormEvent<HTMLFormElement>): void {
    evento.preventDefault();

    if (modo === "crear") {
      const resultado = crearTarea({ proyectoId, nombre });
      if (!resultado.ok) {
        setErrores(resultado.errores);
        return;
      }
    } else if (tarea) {
      const resultado = editarTarea(tarea.id, { nombre });
      if (!resultado.ok) {
        setErrores(resultado.errores);
        return;
      }
    }

    onGuardado?.();
    onOpenChange(false);
  }

  const titulo = TITULOS[modo];

  return (
    <>
      <Dialog.Title className="font-sans text-xl font-semibold text-on-surface">
        {titulo}
      </Dialog.Title>
      <Dialog.Description className="mt-1 text-sm text-on-surface-variant">
        {modo === "crear"
          ? "Asocia la Tarea a un Proyecto existente y dale un Nombre."
          : "Actualiza el Nombre de la Tarea."}
      </Dialog.Description>

      <form
        className="mt-6 flex flex-col gap-4"
        onSubmit={manejarConfirmar}
        noValidate
      >
        <div className="flex flex-col gap-1">
          <label
            htmlFor={idProyecto}
            className="text-sm font-medium text-on-surface"
          >
            Proyecto
          </label>
          <select
            id={idProyecto}
            value={proyectoId}
            onChange={(evento) => setProyectoId(evento.target.value)}
            disabled={modo === "editar"}
            aria-invalid={Boolean(errores.proyectoId)}
            aria-describedby={errores.proyectoId ? idErrorProyecto : undefined}
            className="rounded border border-outline-variant bg-surface-container-lowest px-3 py-2 text-on-surface disabled:opacity-60"
          >
            <option value="" disabled>
              Selecciona un Proyecto
            </option>
            {proyectos.map((proyecto) => (
              <option key={proyecto.id} value={proyecto.id}>
                {proyecto.nombre}
              </option>
            ))}
          </select>
          {errores.proyectoId && (
            <p id={idErrorProyecto} role="alert" className="text-sm text-error">
              {errores.proyectoId}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor={idNombre}
            className="text-sm font-medium text-on-surface"
          >
            Nombre
          </label>
          <input
            id={idNombre}
            type="text"
            value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
            aria-invalid={Boolean(errores.nombre)}
            aria-describedby={errores.nombre ? idErrorNombre : undefined}
            className="rounded border border-outline-variant bg-surface-container-lowest px-3 py-2 text-on-surface"
          />
          {errores.nombre && (
            <p id={idErrorNombre} role="alert" className="text-sm text-error">
              {errores.nombre}
            </p>
          )}
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <Dialog.Close className="rounded px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container">
            Cancelar
          </Dialog.Close>
          <button
            type="submit"
            className="rounded bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-container"
          >
            {titulo}
          </button>
        </div>
      </form>
    </>
  );
}
