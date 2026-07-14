"use client";

import { useState } from "react";
import type { Proyecto } from "@/shared/domain";
import { useStoreRaiz } from "@/shared/store";
import { ProyectoFormModal } from "./ProyectoFormModal";

/**
 * Pantalla de la sección Proyectos: lista, en modo de solo lectura, la
 * colección de Proyectos existente en el store compartido (sin estado
 * duplicado ni side-effects de persistencia propios) y da acceso a las
 * acciones "Nuevo Proyecto" y "Editar" por tarjeta, ambas resueltas por el
 * mismo modal (AC-004, AC-005).
 */
export function ProyectosListado() {
  const proyectos = useStoreRaiz((estado) => estado.proyectos);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [proyectoEnEdicion, setProyectoEnEdicion] = useState<Proyecto | null>(
    null,
  );

  const abrirModalCreacion = () => {
    setProyectoEnEdicion(null);
    setModalAbierto(true);
  };

  const abrirModalEdicion = (proyecto: Proyecto) => {
    setProyectoEnEdicion(proyecto);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-lg text-on-surface">Proyectos</h1>
        <button
          type="button"
          onClick={abrirModalCreacion}
          className="rounded bg-primary px-4 py-2 text-body-md text-on-primary hover:opacity-90"
        >
          Nuevo Proyecto
        </button>
      </div>

      {proyectos.length === 0 ? (
        <p
          data-testid="proyectos-listado-vacio"
          className="text-body-lg text-on-surface-variant"
        >
          Aún no hay proyectos. Crea el primero con &quot;Nuevo Proyecto&quot;.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {proyectos.map((proyecto) => (
            <li
              key={proyecto.id}
              className="flex flex-col gap-3 rounded-lg border border-outline-variant bg-surface-container-lowest p-5 shadow-elevation-1"
            >
              <h2 className="text-headline-md text-on-surface">
                {proyecto.nombre}
              </h2>
              {proyecto.descripcion ? (
                <p className="text-body-md text-on-surface-variant">
                  {proyecto.descripcion}
                </p>
              ) : null}
              <button
                type="button"
                onClick={() => abrirModalEdicion(proyecto)}
                className="mt-auto self-start rounded px-3 py-1.5 text-body-md text-secondary hover:bg-secondary-container/30"
              >
                Editar
              </button>
            </li>
          ))}
        </ul>
      )}

      <ProyectoFormModal
        abierto={modalAbierto}
        onCerrar={cerrarModal}
        proyecto={proyectoEnEdicion}
      />
    </div>
  );
}
