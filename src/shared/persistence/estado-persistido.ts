import type {
  Proyecto,
  RegistroDeTiempo,
  Tarea,
  TemporizadorActivo,
} from "../domain";

/**
 * Versión de esquema actual del estado persistido. Se incrementa cada vez
 * que cambia la forma de los datos guardados, para habilitar una futura
 * migración de esquema sin perder datos existentes.
 */
export const VERSION_ESQUEMA_ACTUAL = 1;

/**
 * Forma completa del estado que la aplicación persiste en el almacenamiento
 * local del dispositivo.
 */
export interface EstadoPersistido {
  /** Versión de esquema de este estado persistido. */
  version: number;
  /** Colección completa de Proyectos. */
  proyectos: Proyecto[];
  /** Colección completa de Tareas. */
  tareas: Tarea[];
  /** Colección completa de Registros de Tiempo. */
  registrosDeTiempo: RegistroDeTiempo[];
  /** Temporizador activo, si existe alguno en curso. */
  temporizadorActivo: TemporizadorActivo | null;
}

/** Estado persistido vacío, usado como valor inicial antes de la primera escritura. */
export const estadoPersistidoVacio = (): EstadoPersistido => ({
  version: VERSION_ESQUEMA_ACTUAL,
  proyectos: [],
  tareas: [],
  registrosDeTiempo: [],
  temporizadorActivo: null,
});
