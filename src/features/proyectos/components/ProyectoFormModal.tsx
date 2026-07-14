"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Field } from "@base-ui/react/field";
import { useState } from "react";
import type { Proyecto } from "@/shared/domain";
import { generarId, useAppStore } from "@/shared/store";
import { validarProyecto } from "../lib/validar-proyecto";

export interface ProyectoFormModalProps {
  /** Controla si el modal está abierto. */
  abierto: boolean;
  /** Invocado al cerrar el modal, tanto al cancelar como al guardar con éxito. */
  onCerrar: () => void;
  /**
   * Proyecto a editar. Cuando se omite (o es `null`), el modal opera en modo
   * creación ("Nuevo Proyecto"); cuando se provee, opera en modo edición
   * ("Editar Proyecto") precargado con sus datos (AC-005).
   */
  proyecto?: Proyecto | null;
}

/**
 * Modal único de creación/edición de Proyecto (AC-005), parametrizado por
 * modo según reciba o no un `proyecto` existente. Valida el Nombre (BR-01) al
 * confirmar y delega el guardado en las operaciones crudas del store
 * compartido (AC-002, AC-006).
 */
export function ProyectoFormModal({
  abierto,
  onCerrar,
  proyecto,
}: ProyectoFormModalProps) {
  const crearProyecto = useAppStore((estado) => estado.crearProyecto);
  const actualizarProyecto = useAppStore((estado) => estado.actualizarProyecto);

  const modoEdicion = Boolean(proyecto);
  const titulo = modoEdicion ? "Editar Proyecto" : "Nuevo Proyecto";

  // Identifica cada "apertura" del modal (creación o edición de un Proyecto
  // puntual) para poder recargar los campos al abrir sin usar un efecto:
  // ajustar el estado durante el renderizado cuando cambia, siguiendo el
  // patrón recomendado por React para derivar estado de props
  // (https://react.dev/learn/you-might-not-need-an-effect).
  const aperturaActual = abierto ? (proyecto?.id ?? "nuevo") : "cerrado";
  const [aperturaPrevia, setAperturaPrevia] = useState(aperturaActual);
  const [nombre, setNombre] = useState(proyecto?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(proyecto?.descripcion ?? "");
  const [errorNombre, setErrorNombre] = useState<string | undefined>(undefined);

  if (aperturaActual !== aperturaPrevia) {
    setAperturaPrevia(aperturaActual);
    setNombre(proyecto?.nombre ?? "");
    setDescripcion(proyecto?.descripcion ?? "");
    setErrorNombre(undefined);
  }

  const manejarEnvio = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    const resultado = validarProyecto({ nombre, descripcion });

    if (!resultado.valido) {
      setErrorNombre(resultado.errores.nombre);
      return;
    }

    const nombreNormalizado = nombre.trim();

    if (proyecto) {
      actualizarProyecto(proyecto.id, {
        nombre: nombreNormalizado,
        descripcion,
      });
    } else {
      crearProyecto({
        id: generarId(),
        nombre: nombreNormalizado,
        descripcion,
        creadoEn: new Date().toISOString(),
      });
    }

    onCerrar();
  };

  return (
    <Dialog.Root
      open={abierto}
      onOpenChange={(siguienteAbierto) => {
        if (!siguienteAbierto) {
          onCerrar();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-inverse-surface/40 backdrop-blur-[8px]" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-surface-container-lowest p-6 shadow-elevation-2 outline-none">
          <Dialog.Title className="text-headline-md text-on-surface">
            {titulo}
          </Dialog.Title>

          <form
            onSubmit={manejarEnvio}
            className="mt-6 flex flex-col gap-4"
            noValidate
          >
            <Field.Root
              invalid={Boolean(errorNombre)}
              className="flex flex-col gap-1.5"
            >
              <Field.Label className="text-body-md font-medium text-on-surface">
                Nombre
              </Field.Label>
              <Field.Control
                value={nombre}
                onChange={(evento) => setNombre(evento.target.value)}
                placeholder="Nombre del proyecto"
                className="rounded border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-md text-on-surface outline-none focus:border-primary data-[invalid]:border-error"
              />
              <Field.Error
                match={Boolean(errorNombre)}
                className="text-body-md text-error"
              >
                {errorNombre}
              </Field.Error>
            </Field.Root>

            <label className="flex flex-col gap-1.5">
              <span className="text-body-md font-medium text-on-surface">
                Descripción
              </span>
              <textarea
                value={descripcion}
                onChange={(evento) => setDescripcion(evento.target.value)}
                rows={3}
                placeholder="Descripción del proyecto (opcional)"
                className="rounded border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-md text-on-surface outline-none focus:border-primary"
              />
            </label>

            <div className="mt-2 flex justify-end gap-3">
              <Dialog.Close className="rounded px-4 py-2 text-body-md text-on-surface-variant hover:bg-surface-container">
                Cancelar
              </Dialog.Close>
              <button
                type="submit"
                className="rounded bg-primary px-4 py-2 text-body-md text-on-primary hover:opacity-90"
              >
                {titulo}
              </button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
