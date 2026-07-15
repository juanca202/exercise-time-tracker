/**
 * Paleta de clases Tailwind de fondo para el acento izquierdo (6px) de cada
 * tarjeta de Proyecto (frame Figma "Proyectos"). El store no documenta
 * ningún estado "activo"/"inactivo" para Proyecto (a diferencia de Tarea con
 * su temporizador): el color es puramente decorativo, así que se evita
 * inventar un sistema de estado inexistente y en su lugar se deriva de forma
 * determinística por `id`, igual patrón que `obtenerColorAcentoTarea` de
 * `gestion-tareas-temporizador` para el ícono de "Tareas Recientes" (se
 * mantiene local a esta feature, sin extraerlo a `shared/`, siguiendo la
 * arquitectura basada en features de ADR-005).
 */
const PALETA_ACENTO_PROYECTO = [
  "bg-secondary",
  "bg-primary",
  "bg-on-surface-variant",
  "bg-[#2e3a59]",
] as const;

/**
 * Deriva, de forma determinística a partir del `id` del Proyecto, una clase
 * de fondo de `PALETA_ACENTO_PROYECTO` para el acento izquierdo de su
 * tarjeta. Determinístico (mismo `id` → mismo color siempre) para no
 * introducir parpadeo entre renders ni romper pruebas de regresión visual.
 */
export function obtenerColorAcentoProyecto(proyectoId: string): string {
  let hash = 0;
  for (let indice = 0; indice < proyectoId.length; indice += 1) {
    hash = (hash * 31 + proyectoId.charCodeAt(indice)) >>> 0;
  }
  return PALETA_ACENTO_PROYECTO[hash % PALETA_ACENTO_PROYECTO.length];
}
