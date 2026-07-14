import type {
  Proyecto,
  RegistroDeTiempo,
  Tarea,
  TemporizadorActivo,
} from "@/shared/domain";

/**
 * Versión vigente del esquema de {@link EstadoPersistido}. Incrementar cada vez
 * que cambie la forma de los datos persistidos, para habilitar una futura
 * migración de esquema sin perder datos existentes.
 */
export const VERSION_ESQUEMA_ESTADO_PERSISTIDO = 1;

/**
 * Forma completa del estado que guarda el adaptador de persistencia local,
 * incluyendo la versión del esquema (AC-002).
 */
export interface EstadoPersistido {
  /** Versión del esquema de este estado persistido. */
  version: number;
  proyectos: Proyecto[];
  tareas: Tarea[];
  registrosDeTiempo: RegistroDeTiempo[];
  temporizadorActivo: TemporizadorActivo | null;
}

/** Estado persistido vacío, usado como punto de partida antes de la primera escritura. */
export function crearEstadoPersistidoInicial(): EstadoPersistido {
  return {
    version: VERSION_ESQUEMA_ESTADO_PERSISTIDO,
    proyectos: [],
    tareas: [],
    registrosDeTiempo: [],
    temporizadorActivo: null,
  };
}
