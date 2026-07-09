/** Una Tarea: unidad de trabajo que se asocia obligatoriamente a un único Proyecto (BR-01). */
export interface Task {
  id: string;
  projectId: string;
  name: string;
  createdAt: string;
}

/** Un Registro de Tiempo: documenta el tiempo dedicado a una Tarea, por temporizador o manual. */
export interface TimeEntry {
  id: string;
  taskId: string;
  startedAt: string;
  endedAt: string;
  durationMs: number;
  source: "timer" | "manual";
}
