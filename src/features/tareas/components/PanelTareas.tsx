"use client";

import { useMemo, useState } from "react";
import type { Tarea } from "@/shared/domain";
import { useAppStore } from "@/shared/store";
import { TopAppBar } from "@/shared/ui";
import { TareaFormModal, type ModoTareaFormModal } from "./TareaFormModal";
import { TareasRecientesCard } from "./TareasRecientesCard";
import { RegistroManualForm, type TareaOpcion } from "./RegistroManualForm";
import { ResumenTareas } from "./ResumenTareas";
import { SesionActivaCard } from "./SesionActivaCard";
import {
  calcularDuracionAcumuladaMinutos,
  obtenerUltimaActividad,
} from "../lib/calcular-duracion-acumulada-tarea";
import {
  iniciarTemporizador,
  detenerTemporizador,
} from "../lib/acciones-temporizador";

/**
 * Panel principal de la feature Tareas (frame Figma "Tareas"): TopAppBar
 * con la acción "Nueva Tarea", resumen semanal/mensual, la tarjeta "Sesión
 * Activa" del temporizador en curso, el ingreso manual de tiempo ("Entrada
 * Manual") y el listado "Tareas Recientes" con su propio control de
 * temporizador.
 *
 * Consume el store raíz compartido (`useAppStore`), ya rehidratado por
 * `InicializadorAplicacion` desde el layout raíz (`fundamentos-infraestructura-compartida`):
 * hasta que `haHidratado` sea `true` no renderiza contenido dependiente de
 * datos persistidos, para evitar un hydration-mismatch entre el render del
 * servidor y el primer render del cliente.
 */
export interface PanelTareasProps {
  /**
   * Fecha "actual" usada para calcular la semana/mes laboral del resumen.
   * Por defecto, ahora. Permite inyectar una fecha fija en pruebas.
   */
  fecha?: Date;
}

export function PanelTareas({ fecha }: PanelTareasProps = {}) {
  const haHidratado = useAppStore((state) => state.haHidratado);
  const proyectos = useAppStore((state) => state.proyectos);
  const tareas = useAppStore((state) => state.tareas);
  const registrosDeTiempo = useAppStore((state) => state.registrosDeTiempo);
  const temporizadorActivo = useAppStore((state) => state.temporizadorActivo);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modo, setModo] = useState<ModoTareaFormModal>("crear");
  const [tareaEnEdicion, setTareaEnEdicion] = useState<Tarea | undefined>(
    undefined,
  );

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

  const tareasOpciones = useMemo<TareaOpcion[]>(
    () =>
      tareas.map((tarea) => ({
        id: tarea.id,
        nombre: tarea.nombre,
        nombreProyecto: proyectosPorId.get(tarea.proyectoId) ?? "",
      })),
    [tareas, proyectosPorId],
  );

  const tareasRecientesVista = useMemo(
    () =>
      tareas.map((tarea) => {
        const enEjecucion = temporizadorActivo?.tareaId === tarea.id;
        return {
          tarea,
          nombreProyecto: proyectosPorId.get(tarea.proyectoId) ?? "",
          enEjecucion,
          duracionAcumuladaMinutos: calcularDuracionAcumuladaMinutos(
            registrosDeTiempo,
            tarea.id,
          ),
          horaInicioTemporizador: enEjecucion
            ? temporizadorActivo?.horaInicio
            : undefined,
          ultimaActividadEn: obtenerUltimaActividad(
            registrosDeTiempo,
            tarea.id,
          ),
        };
      }),
    [tareas, proyectosPorId, registrosDeTiempo, temporizadorActivo],
  );

  const tareaActiva = temporizadorActivo
    ? tareas.find((tarea) => tarea.id === temporizadorActivo.tareaId)
    : undefined;

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

  return (
    <div className="flex w-full flex-col">
      <TopAppBar>
        <button
          type="button"
          onClick={abrirModalCrear}
          className="rounded-precision-sm bg-primary px-4 py-2 text-sm font-bold text-on-primary hover:bg-primary/90"
        >
          Nueva Tarea
        </button>
      </TopAppBar>

      {/*
       * `proyectos`/`tareas`/`registrosDeTiempo` reflejan datos persistidos:
       * hasta que `haHidratado` sea `true` no se renderiza ningún contenido
       * que dependa de ellos, para evitar un hydration-mismatch entre el
       * render del servidor (siempre vacío) y el primer render del cliente
       * antes de rehidratar (AC-004 de `fundamentos-infraestructura-compartida`).
       */}
      {haHidratado && (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 p-6">
          <ResumenTareas registros={registrosDeTiempo} fecha={fecha} />

          <div className="grid grid-cols-12 gap-6">
            <SesionActivaCard
              nombreTarea={tareaActiva?.nombre}
              nombreProyecto={
                tareaActiva
                  ? proyectosPorId.get(tareaActiva.proyectoId)
                  : undefined
              }
              horaInicio={temporizadorActivo?.horaInicio}
              onDetener={() => detenerTemporizador()}
            />

            <RegistroManualForm tareas={tareasOpciones} />

            <TareasRecientesCard
              tareas={tareasRecientesVista}
              onIniciarTemporizador={iniciarTemporizador}
              onDetenerTemporizador={detenerTemporizador}
              onEditar={abrirModalEditar}
            />
          </div>
        </div>
      )}

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
