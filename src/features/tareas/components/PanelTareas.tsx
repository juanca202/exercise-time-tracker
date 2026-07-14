"use client";

import { useEffect, useMemo, useState } from "react";
import type { Tarea } from "@/shared/domain";
import { useRaizStore } from "@/shared/store";
import { TareaFormModal, type ModoTareaFormModal } from "./TareaFormModal";
import { TareaListItem } from "./TareaListItem";
import { RegistroManualForm } from "./RegistroManualForm";
import { MetaSemanalWidget } from "./MetaSemanalWidget";
import {
  iniciarTemporizador,
  detenerTemporizador,
} from "../lib/acciones-temporizador";

/**
 * Panel principal de la feature Tareas: agrupa el listado "Tareas
 * Recientes" con los controles de temporizador, el modal de creación/edición
 * de Tarea, el ingreso manual de tiempo y el widget de Meta Semanal.
 *
 * Hidrata el store raíz compartido al montarse (operación idempotente) para
 * que el panel funcione de forma autónoma incluso si ningún ancestro ya lo
 * hizo, según el contrato de `fundamentos-infraestructura-compartida`.
 */
export interface PanelTareasProps {
  /**
   * Fecha "actual" usada para calcular la semana laboral del widget de Meta
   * Semanal. Por defecto, ahora. Permite inyectar una fecha fija en pruebas.
   */
  fecha?: Date;
}

export function PanelTareas({ fecha }: PanelTareasProps = {}) {
  const haHidratado = useRaizStore((state) => state.haHidratado);
  const hidratar = useRaizStore((state) => state.hidratar);
  const proyectos = useRaizStore((state) => state.proyectos);
  const tareas = useRaizStore((state) => state.tareas);
  const registrosDeTiempo = useRaizStore((state) => state.registrosDeTiempo);
  const temporizadorActivo = useRaizStore((state) => state.temporizadorActivo);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modo, setModo] = useState<ModoTareaFormModal>("crear");
  const [tareaEnEdicion, setTareaEnEdicion] = useState<Tarea | undefined>(
    undefined,
  );

  useEffect(() => {
    hidratar();
  }, [hidratar]);

  const proyectosPorId = useMemo(() => {
    const mapa = new Map(
      proyectos.map((proyecto) => [proyecto.id, proyecto.nombre]),
    );
    return mapa;
  }, [proyectos]);

  const proyectosOpciones = useMemo(
    () =>
      proyectos.map((proyecto) => ({
        id: proyecto.id,
        nombre: proyecto.nombre,
      })),
    [proyectos],
  );

  const tareasOpciones = useMemo(
    () => tareas.map((tarea) => ({ id: tarea.id, nombre: tarea.nombre })),
    [tareas],
  );

  function abrirModalCrear(): void {
    setModo("crear");
    setTareaEnEdicion(undefined);
    setModalAbierto(true);
  }

  function abrirModalEditar(tarea: Tarea): void {
    setModo("editar");
    setTareaEnEdicion(tarea);
    setModalAbierto(true);
  }

  if (!haHidratado) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6 sm:p-10">
      <header className="flex items-center justify-between">
        <h1 className="font-sans text-2xl font-semibold text-on-surface">
          Tareas
        </h1>
        <button
          type="button"
          onClick={abrirModalCrear}
          className="rounded bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-container"
        >
          Nueva Tarea
        </button>
      </header>

      <MetaSemanalWidget registros={registrosDeTiempo} fecha={fecha} />

      <section className="flex flex-col gap-3">
        <h2 className="font-sans text-lg font-semibold text-on-surface">
          Tareas Recientes
        </h2>
        {tareas.length === 0 ? (
          <p className="text-sm text-on-surface-variant">
            Todavía no hay Tareas. Crea la primera con &quot;Nueva Tarea&quot;.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {tareas.map((tarea) => (
              <TareaListItem
                key={tarea.id}
                tarea={tarea}
                nombreProyecto={proyectosPorId.get(tarea.proyectoId) ?? ""}
                enEjecucion={temporizadorActivo?.tareaId === tarea.id}
                onIniciarTemporizador={iniciarTemporizador}
                onDetenerTemporizador={detenerTemporizador}
                onEditar={abrirModalEditar}
              />
            ))}
          </ul>
        )}
      </section>

      <RegistroManualForm tareas={tareasOpciones} />

      <TareaFormModal
        open={modalAbierto}
        modo={modo}
        proyectos={proyectosOpciones}
        tarea={tareaEnEdicion}
        onOpenChange={setModalAbierto}
      />
    </div>
  );
}
