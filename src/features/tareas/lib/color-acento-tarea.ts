/**
 * Paleta de clases Tailwind de fondo para el ícono cuadrado de cada fila de
 * "Tareas Recientes" (frame Figma "Tareas": "color de fondo varía por
 * ítem en el mock, no es semántico"). Reutiliza tokens de color ya
 * existentes del sistema de diseño en la medida de lo posible; el último
 * valor es un tono adicional del mismo prototipo Figma sin token propio
 * todavía, mantenido como color puntual en lugar de introducir un token
 * nuevo para un único uso decorativo.
 */
const PALETA_ACENTO_TAREA = [
  "bg-primary",
  "bg-secondary",
  "bg-on-surface-variant",
  "bg-[#2e3a59]",
] as const;

/**
 * Deriva, de forma determinística a partir del `id` de la Tarea, una clase
 * de fondo de `PALETA_ACENTO_TAREA` para el ícono de su fila en "Tareas
 * Recientes". Determinístico (mismo `id` → mismo color siempre) para no
 * introducir parpadeo entre renders ni romper pruebas de regresión visual.
 */
export function obtenerColorAcentoTarea(tareaId: string): string {
  let hash = 0;
  for (let indice = 0; indice < tareaId.length; indice += 1) {
    hash = (hash * 31 + tareaId.charCodeAt(indice)) >>> 0;
  }
  return PALETA_ACENTO_TAREA[hash % PALETA_ACENTO_TAREA.length];
}
