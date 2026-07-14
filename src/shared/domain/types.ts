/**
 * Tipos de dominio compartidos de Time Tracker.
 *
 * Consumidos de forma idéntica por todas las features (Proyectos, Tareas,
 * Historial de registros). Ninguna feature debe redefinir ni extender estos
 * tipos: si falta un campo, se agrega aquí (ver ADR-005).
 */

/** Identificador único de un {@link Proyecto}. */
export type ProyectoId = string;

/** Identificador único de una {@link Tarea}. */
export type TareaId = string;

/** Identificador único de un {@link RegistroDeTiempo}. */
export type RegistroDeTiempoId = string;

/** Un Proyecto agrupa una o más Tareas. */
export interface Proyecto {
  id: ProyectoId;
  nombre: string;
}

/** Una Tarea pertenece a un único Proyecto. */
export interface Tarea {
  id: TareaId;
  nombre: string;
  proyectoId: ProyectoId;
}

/**
 * Origen de un {@link RegistroDeTiempo}: generado al detener el temporizador
 * o ingresado manualmente por el usuario.
 */
export type OrigenRegistroDeTiempo = "temporizador" | "manual";

/**
 * Un Registro de Tiempo asociado a una Tarea.
 *
 * `horaInicio` representa la Fecha única del registro manual o la Hora de
 * Inicio real del registro de temporizador; `horaFin` solo está presente en
 * registros de origen `"temporizador"`. `duracion` se expresa en minutos.
 */
export interface RegistroDeTiempo {
  id: RegistroDeTiempoId;
  tareaId: TareaId;
  origen: OrigenRegistroDeTiempo;
  /** ISO 8601. Fecha (manual) u Hora de Inicio (temporizador). */
  horaInicio: string;
  /** ISO 8601. Solo presente cuando `origen === "temporizador"`. */
  horaFin?: string;
  /** Duración en minutos. */
  duracion: number;
}

/** Temporizador Activo: a lo sumo una Tarea puede tener un temporizador corriendo. */
export interface TemporizadorActivo {
  tareaId: TareaId;
  /** ISO 8601, instante en que se inició el temporizador. */
  horaInicio: string;
}
