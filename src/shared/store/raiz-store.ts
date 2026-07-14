import { create } from "zustand";
import type {
  Proyecto,
  Tarea,
  RegistroDeTiempo,
  TemporizadorActivo,
} from "@/shared/domain";
import {
  leerEstadoPersistido,
  escribirEstadoPersistido,
  VERSION_ESQUEMA_ACTUAL,
} from "@/shared/persistence";

/**
 * Genera un identificador único para una nueva entidad.
 */
function generarId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Slice de datos de dominio del store raíz, usado para persistir el estado completo. */
interface DatosDominio {
  proyectos: Proyecto[];
  tareas: Tarea[];
  registrosDeTiempo: RegistroDeTiempo[];
  temporizadorActivo: TemporizadorActivo | null;
}

/**
 * Store raíz compartido de la aplicación (Zustand, según ADR-004).
 *
 * Expone operaciones CRUD "en crudo" (creación, actualización, listado vía el
 * propio estado) por entidad, sin aplicar ninguna regla de negocio propia de
 * una historia funcional: esa validación es responsabilidad de la feature que
 * invoca estas operaciones. También expone el indicador de hidratación
 * `haHidratado`, en `false` hasta completar la rehidratación desde el
 * adaptador de persistencia local.
 */
export interface RaizStore extends DatosDominio {
  /** `false` hasta que `hidratar()` complete la lectura del estado persistido. */
  haHidratado: boolean;
  /** Rehidrata el estado desde el adaptador de persistencia local. Idempotente. */
  hidratar: () => void;
  /** Crea un Proyecto y lo persiste, sin validación de negocio. */
  crearProyecto: (input: Omit<Proyecto, "id">) => Proyecto;
  /** Crea una Tarea y la persiste, sin validación de negocio. */
  crearTarea: (input: Omit<Tarea, "id">) => Tarea;
  /** Actualiza los campos provistos de una Tarea existente y persiste el cambio. */
  actualizarTarea: (id: string, cambios: Partial<Omit<Tarea, "id">>) => void;
  /** Crea un Registro de Tiempo y lo persiste, sin validación de negocio. */
  crearRegistroDeTiempo: (
    input: Omit<RegistroDeTiempo, "id">,
  ) => RegistroDeTiempo;
  /** Reemplaza en crudo el temporizador activo (o lo limpia con `null`) y persiste el cambio. */
  setTemporizadorActivo: (
    temporizadorActivo: TemporizadorActivo | null,
  ) => void;
}

function persistir(datos: DatosDominio): void {
  escribirEstadoPersistido({ version: VERSION_ESQUEMA_ACTUAL, ...datos });
}

export const useRaizStore = create<RaizStore>((set, get) => ({
  haHidratado: false,
  proyectos: [],
  tareas: [],
  registrosDeTiempo: [],
  temporizadorActivo: null,

  hidratar: () => {
    if (get().haHidratado) {
      return;
    }
    const estado = leerEstadoPersistido();
    set({
      proyectos: estado.proyectos,
      tareas: estado.tareas,
      registrosDeTiempo: estado.registrosDeTiempo,
      temporizadorActivo: estado.temporizadorActivo,
      haHidratado: true,
    });
  },

  crearProyecto: (input) => {
    const proyecto: Proyecto = { id: generarId(), ...input };
    set((state) => {
      const proyectos = [...state.proyectos, proyecto];
      persistir({ ...state, proyectos });
      return { proyectos };
    });
    return proyecto;
  },

  crearTarea: (input) => {
    const tarea: Tarea = { id: generarId(), ...input };
    set((state) => {
      const tareas = [...state.tareas, tarea];
      persistir({ ...state, tareas });
      return { tareas };
    });
    return tarea;
  },

  actualizarTarea: (id, cambios) => {
    set((state) => {
      const tareas = state.tareas.map((tarea) =>
        tarea.id === id ? { ...tarea, ...cambios } : tarea,
      );
      persistir({ ...state, tareas });
      return { tareas };
    });
  },

  crearRegistroDeTiempo: (input) => {
    const registro: RegistroDeTiempo = { id: generarId(), ...input };
    set((state) => {
      const registrosDeTiempo = [...state.registrosDeTiempo, registro];
      persistir({ ...state, registrosDeTiempo });
      return { registrosDeTiempo };
    });
    return registro;
  },

  setTemporizadorActivo: (temporizadorActivo) => {
    set((state) => {
      persistir({ ...state, temporizadorActivo });
      return { temporizadorActivo };
    });
  },
}));
