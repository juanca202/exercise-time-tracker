/**
 * Entidad Proyecto: agrupación lógica base sobre la que se organizan las
 * Tareas (US-002). Un Proyecto no depende de ninguna otra entidad.
 */
export interface Proyecto {
  /** Identificador único y estable del Proyecto. */
  id: string;
  /** Nombre del Proyecto. Su validez (obligatorio, no vacío) es responsabilidad de la feature de Proyectos. */
  nombre: string;
  /** Descripción opcional del Proyecto. Cadena vacía cuando no se provee. */
  descripcion: string;
  /** Fecha y hora (ISO 8601) de creación del Proyecto. */
  creadoEn: string;
  /** Fecha y hora (ISO 8601) de la última actualización del Proyecto. */
  actualizadoEn: string;
}
