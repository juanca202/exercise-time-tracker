import { create } from "zustand";
import type {
  Proyecto,
  RegistroDeTiempo,
  Tarea,
  TemporizadorActivo,
} from "@/shared/domain";
import {
  escribir,
  leer,
  VERSION_ESQUEMA_ESTADO_PERSISTIDO,
} from "@/shared/persistence";

/**
 * Estado de las entidades de dominio que administra el store raíz. Cada
 * colección constituye, a la vez, la operación de "listado crudo" exigida por
 * AC-003: una historia funcional lee estos campos (p. ej.
 * `useAppStore((estado) => estado.proyectos)`) para obtener la colección
 * completa de esa entidad, sin filtrar ni transformar según reglas de negocio.
 */
interface EstadoEntidades {
  proyectos: Proyecto[];
  tareas: Tarea[];
  registrosDeTiempo: RegistroDeTiempo[];
  temporizadorActivo: TemporizadorActivo | null;
}

/**
 * Store raíz compartido (ADR-004). Expone únicamente operaciones CRUD crudas
 * de creación, actualización y listado por entidad (BR-01, AC-003), el gate de
 * hidratación (`haHidratado`, AC-004) y la hidratación desde el adaptador de
 * persistencia (sección 2). Ninguna operación aplica validación ni reglas de
 * negocio propias de Proyectos, Tareas o Historial de registros: esa lógica
 * vive en cada feature, compuesta sobre este CRUD crudo.
 */
export interface AppStore extends EstadoEntidades {
  /**
   * `false` hasta completar la rehidratación desde el adaptador de
   * persistencia; `true` una vez finalizada (AC-004). Todo componente que lea
   * datos persistidos DEBE comprobar este indicador antes de renderizarlos,
   * para evitar un hydration-mismatch entre el render del servidor y el
   * primer render del cliente.
   */
  haHidratado: boolean;

  /** Rehidrata el estado desde el adaptador de persistencia y marca `haHidratado = true`. */
  hidratar: () => void;

  /** Reemplaza las colecciones de entidades (usado por la suscripción a cambios externos, p. ej. otra pestaña). */
  reemplazarEntidades: (entidades: EstadoEntidades) => void;

  crearProyecto: (proyecto: Proyecto) => void;
  actualizarProyecto: (id: string, cambios: Partial<Proyecto>) => void;

  crearTarea: (tarea: Tarea) => void;
  actualizarTarea: (id: string, cambios: Partial<Tarea>) => void;

  crearRegistroDeTiempo: (registro: RegistroDeTiempo) => void;
  actualizarRegistroDeTiempo: (
    id: string,
    cambios: Partial<RegistroDeTiempo>,
  ) => void;

  /** Establece (o limpia, con `null`) el único temporizador activo de la aplicación. */
  establecerTemporizadorActivo: (
    temporizadorActivo: TemporizadorActivo | null,
  ) => void;
}

const estadoInicial: EstadoEntidades & { haHidratado: boolean } = {
  proyectos: [],
  tareas: [],
  registrosDeTiempo: [],
  temporizadorActivo: null,
  haHidratado: false,
};

export const useAppStore = create<AppStore>((set, get) => {
  function persistirEstadoActual(): void {
    const estado = get();
    escribir({
      version: VERSION_ESQUEMA_ESTADO_PERSISTIDO,
      proyectos: estado.proyectos,
      tareas: estado.tareas,
      registrosDeTiempo: estado.registrosDeTiempo,
      temporizadorActivo: estado.temporizadorActivo,
    });
  }

  return {
    ...estadoInicial,

    hidratar: () => {
      const estadoPersistido = leer();
      set({
        proyectos: estadoPersistido?.proyectos ?? [],
        tareas: estadoPersistido?.tareas ?? [],
        registrosDeTiempo: estadoPersistido?.registrosDeTiempo ?? [],
        temporizadorActivo: estadoPersistido?.temporizadorActivo ?? null,
        haHidratado: true,
      });
    },

    reemplazarEntidades: (entidades) => {
      set(entidades);
    },

    crearProyecto: (proyecto) => {
      set((estado) => ({ proyectos: [...estado.proyectos, proyecto] }));
      persistirEstadoActual();
    },
    actualizarProyecto: (id, cambios) => {
      set((estado) => ({
        proyectos: estado.proyectos.map((proyecto) =>
          proyecto.id === id ? { ...proyecto, ...cambios } : proyecto,
        ),
      }));
      persistirEstadoActual();
    },

    crearTarea: (tarea) => {
      set((estado) => ({ tareas: [...estado.tareas, tarea] }));
      persistirEstadoActual();
    },
    actualizarTarea: (id, cambios) => {
      set((estado) => ({
        tareas: estado.tareas.map((tarea) =>
          tarea.id === id ? { ...tarea, ...cambios } : tarea,
        ),
      }));
      persistirEstadoActual();
    },

    crearRegistroDeTiempo: (registro) => {
      set((estado) => ({
        registrosDeTiempo: [...estado.registrosDeTiempo, registro],
      }));
      persistirEstadoActual();
    },
    actualizarRegistroDeTiempo: (id, cambios) => {
      set((estado) => ({
        registrosDeTiempo: estado.registrosDeTiempo.map((registro) =>
          registro.id === id ? { ...registro, ...cambios } : registro,
        ),
      }));
      persistirEstadoActual();
    },

    establecerTemporizadorActivo: (temporizadorActivo) => {
      set({ temporizadorActivo });
      persistirEstadoActual();
    },
  };
});
