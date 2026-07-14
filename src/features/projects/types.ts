/** Un Proyecto: agrupación lógica de Tareas relacionadas (SRS-001, sección 1.3). */
export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}
