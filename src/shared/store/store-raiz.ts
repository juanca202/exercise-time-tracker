import { create } from "zustand";
import type {
  Proyecto,
  RegistroDeTiempo,
  Tarea,
  TemporizadorActivo,
} from "../domain";
import {
  adaptadorPersistenciaLocal,
  VERSION_ESQUEMA_ACTUAL,
  type EstadoPersistido,
} from "../persistence";
import { generarId } from "./id";

/** Datos de entrada crudos para crear un Proyecto (sin id ni timestamps). */
export interface EntradaProyecto {
  nombre: string;
  descripcion: string;
}

/** Campos de Proyecto que pueden reemplazarse en una actualización cruda. */
export type CambiosProyecto = Partial<EntradaProyecto>;

/** Datos de entrada crudos para crear una Tarea (sin id ni timestamps). */
export interface EntradaTarea {
  proyectoId: string;
  titulo: string;
  descripcion: string;
  completada: boolean;
}

/** Campos de Tarea que pueden reemplazarse en una actualización cruda. */
export type CambiosTarea = Partial<EntradaTarea>;

/** Datos de entrada crudos para crear un Registro de Tiempo (sin id). */
export interface EntradaRegistroDeTiempo {
  tareaId: string;
  inicio: string;
  fin: string;
  duracionSegundos: number;
}

/** Campos de Registro de Tiempo que pueden reemplazarse en una actualización cruda. */
export type CambiosRegistroDeTiempo = Partial<EntradaRegistroDeTiempo>;

/**
 * Forma del store raíz compartido: expone operaciones CRUD crudas de
 * creación, actualización y listado por entidad (Proyecto, Tarea, Registro de
 * Tiempo), sin validación ni reglas de negocio propias de ninguna historia
 * funcional (esa responsabilidad es de cada feature). Ver
 * `fundamentos-infraestructura-compartida` / capability
 * `dominio-y-persistencia-compartida`.
 */
export interface StoreRaiz {
  /** `false` hasta completar la rehidratación desde el almacenamiento local; `true` en adelante. */
  haHidratado: boolean;
  proyectos: Proyecto[];
  tareas: Tarea[];
  registrosDeTiempo: RegistroDeTiempo[];
  temporizadorActivo: TemporizadorActivo | null;

  /** Rehidrata el estado desde el adaptador de persistencia local y marca `haHidratado`. Idempotente. */
  hidratar: () => void;

  crearProyecto: (input: EntradaProyecto) => Proyecto;
  actualizarProyecto: (id: string, cambios: CambiosProyecto) => void;
  listarProyectos: () => Proyecto[];

  crearTarea: (input: EntradaTarea) => Tarea;
  actualizarTarea: (id: string, cambios: CambiosTarea) => void;
  listarTareas: () => Tarea[];

  crearRegistroDeTiempo: (input: EntradaRegistroDeTiempo) => RegistroDeTiempo;
  actualizarRegistroDeTiempo: (
    id: string,
    cambios: CambiosRegistroDeTiempo,
  ) => void;
  listarRegistrosDeTiempo: () => RegistroDeTiempo[];
}

const ahoraIso = (): string => new Date().toISOString();

/**
 * Crea una instancia del store raíz, recibiendo el adaptador de persistencia
 * como dependencia explícita para facilitar pruebas aisladas y
 * deterministas (ADR-007).
 */
export const crearStoreRaiz = (adaptador = adaptadorPersistenciaLocal) => {
  const persistirEstadoActual = (estado: {
    proyectos: Proyecto[];
    tareas: Tarea[];
    registrosDeTiempo: RegistroDeTiempo[];
    temporizadorActivo: TemporizadorActivo | null;
  }): void => {
    const estadoPersistido: EstadoPersistido = {
      version: VERSION_ESQUEMA_ACTUAL,
      proyectos: estado.proyectos,
      tareas: estado.tareas,
      registrosDeTiempo: estado.registrosDeTiempo,
      temporizadorActivo: estado.temporizadorActivo,
    };

    adaptador.escribir(estadoPersistido);
  };

  return create<StoreRaiz>()((set, get) => ({
    haHidratado: false,
    proyectos: [],
    tareas: [],
    registrosDeTiempo: [],
    temporizadorActivo: null,

    hidratar: () => {
      if (get().haHidratado) {
        return;
      }

      const estadoPersistido = adaptador.leer();

      set({
        proyectos: estadoPersistido?.proyectos ?? [],
        tareas: estadoPersistido?.tareas ?? [],
        registrosDeTiempo: estadoPersistido?.registrosDeTiempo ?? [],
        temporizadorActivo: estadoPersistido?.temporizadorActivo ?? null,
        haHidratado: true,
      });

      adaptador.suscribir((estadoExterno) => {
        set({
          proyectos: estadoExterno.proyectos,
          tareas: estadoExterno.tareas,
          registrosDeTiempo: estadoExterno.registrosDeTiempo,
          temporizadorActivo: estadoExterno.temporizadorActivo,
        });
      });
    },

    crearProyecto: (input) => {
      const nuevoProyecto: Proyecto = {
        id: generarId(),
        nombre: input.nombre,
        descripcion: input.descripcion,
        creadoEn: ahoraIso(),
        actualizadoEn: ahoraIso(),
      };

      const proyectos = [...get().proyectos, nuevoProyecto];
      set({ proyectos });
      persistirEstadoActual({ ...get(), proyectos });

      return nuevoProyecto;
    },

    actualizarProyecto: (id, cambios) => {
      const proyectos = get().proyectos.map((proyecto) =>
        proyecto.id === id
          ? { ...proyecto, ...cambios, actualizadoEn: ahoraIso() }
          : proyecto,
      );

      set({ proyectos });
      persistirEstadoActual({ ...get(), proyectos });
    },

    listarProyectos: () => get().proyectos,

    crearTarea: (input) => {
      const nuevaTarea: Tarea = {
        id: generarId(),
        proyectoId: input.proyectoId,
        titulo: input.titulo,
        descripcion: input.descripcion,
        completada: input.completada,
        creadoEn: ahoraIso(),
        actualizadoEn: ahoraIso(),
      };

      const tareas = [...get().tareas, nuevaTarea];
      set({ tareas });
      persistirEstadoActual({ ...get(), tareas });

      return nuevaTarea;
    },

    actualizarTarea: (id, cambios) => {
      const tareas = get().tareas.map((tarea) =>
        tarea.id === id
          ? { ...tarea, ...cambios, actualizadoEn: ahoraIso() }
          : tarea,
      );

      set({ tareas });
      persistirEstadoActual({ ...get(), tareas });
    },

    listarTareas: () => get().tareas,

    crearRegistroDeTiempo: (input) => {
      const nuevoRegistro: RegistroDeTiempo = {
        id: generarId(),
        tareaId: input.tareaId,
        inicio: input.inicio,
        fin: input.fin,
        duracionSegundos: input.duracionSegundos,
        creadoEn: ahoraIso(),
      };

      const registrosDeTiempo = [...get().registrosDeTiempo, nuevoRegistro];
      set({ registrosDeTiempo });
      persistirEstadoActual({ ...get(), registrosDeTiempo });

      return nuevoRegistro;
    },

    actualizarRegistroDeTiempo: (id, cambios) => {
      const registrosDeTiempo = get().registrosDeTiempo.map((registro) =>
        registro.id === id ? { ...registro, ...cambios } : registro,
      );

      set({ registrosDeTiempo });
      persistirEstadoActual({ ...get(), registrosDeTiempo });
    },

    listarRegistrosDeTiempo: () => get().registrosDeTiempo,
  }));
};

/** Instancia compartida (singleton) del store raíz, usada por toda la aplicación. */
export const useStoreRaiz = crearStoreRaiz();
