/**
 * Agrupación lógica de Tareas relacionadas (SRS-001 §1.3, §2.2). Un Proyecto puede
 * contener múltiples Tareas; la relación se establece desde `Tarea.proyectoId`.
 */
export interface Proyecto {
  /** Identificador único del proyecto. */
  id: string;
  /** Nombre del proyecto (obligatorio, RF-001). */
  nombre: string;
  /** Descripción adicional del proyecto (opcional, RF-001). */
  descripcion?: string;
  /** Fecha y hora de creación del proyecto, en formato ISO 8601. */
  creadoEn: string;
}
