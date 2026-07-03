/**
 * Un Proyecto agrupa Tareas relacionadas.
 */
export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

/**
 * Una Tarea pertenece obligatoriamente a un único Proyecto.
 */
export interface Task {
  id: string;
  projectId: string;
  name: string;
  createdAt: string;
}

/**
 * Origen de un {@link TimeEntry}: generado por el temporizador o ingresado manualmente.
 */
export type TimeEntrySource = "timer" | "manual";

/**
 * Registro de tiempo dedicado a una Tarea, generado por el temporizador o de forma manual.
 */
export interface TimeEntry {
  id: string;
  taskId: string;
  /** Fecha del registro en formato ISO `YYYY-MM-DD`. */
  date: string;
  durationSeconds: number;
  source: TimeEntrySource;
  /** Presente solo cuando `source` es `"timer"`. */
  startTime?: string;
  /** Presente solo cuando `source` es `"timer"`. */
  endTime?: string;
  createdAt: string;
}

/**
 * Temporizador activo en la aplicación. Solo puede existir uno a la vez ({@link TimeTrackingState}).
 */
export interface ActiveTimer {
  taskId: string;
  startedAt: string;
}

/**
 * Forma persistida del dominio de Time Tracking en el almacenamiento local.
 */
export interface TimeTrackingState {
  projects: Project[];
  tasks: Task[];
  timeEntries: TimeEntry[];
  activeTimer: ActiveTimer | null;
}
