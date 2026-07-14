import type {
  Proyecto,
  Tarea,
  RegistroDeTiempo,
  TemporizadorActivo,
} from "@/shared/domain";

/**
 * Versión de esquema del estado persistido. Debe incrementarse cada vez que
 * la forma de {@link EstadoPersistido} cambie de manera incompatible.
 */
export const VERSION_ESQUEMA_ACTUAL = 1;

/**
 * Forma completa del estado persistido en el almacenamiento local del
 * dispositivo. Incluye las colecciones de todas las entidades de dominio y
 * un campo de versión de esquema.
 */
export interface EstadoPersistido {
  /** Versión del esquema del estado persistido. */
  version: number;
  proyectos: Proyecto[];
  tareas: Tarea[];
  registrosDeTiempo: RegistroDeTiempo[];
  temporizadorActivo: TemporizadorActivo | null;
}

/**
 * Estado inicial usado cuando no existe ningún estado previamente persistido
 * (primer arranque de la aplicación en el dispositivo).
 */
export function crearEstadoPersistidoInicial(): EstadoPersistido {
  return {
    version: VERSION_ESQUEMA_ACTUAL,
    proyectos: [],
    tareas: [],
    registrosDeTiempo: [],
    temporizadorActivo: null,
  };
}
