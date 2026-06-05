export interface NameColorTokens {
  background: string;
  foreground: string;
  accent: string;
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

/** Deriva colores estables a partir de un nombre (tarea, proyecto, etc.). */
export function getColorFromName(
  name: string,
  fallback = "item",
): NameColorTokens {
  const normalized = name.trim().toLowerCase() || fallback;
  const hash = hashString(normalized);

  const hue = hash % 360;
  const saturation = 42 + (hash % 28);
  const lightness = 82 + (hash % 10);

  return {
    background: `hsl(${hue} ${saturation}% ${lightness}%)`,
    foreground: `hsl(${hue} ${Math.min(saturation + 12, 85)}% ${Math.max(lightness - 48, 22)}%)`,
    accent: `hsl(${hue} ${Math.min(saturation + 24, 80)}% ${Math.max(lightness - 40, 32)}%)`,
  };
}

/** @deprecated Usar getColorFromName — alias para tareas */
export function getTaskColorFromName(taskName: string): NameColorTokens {
  return getColorFromName(taskName, "tarea");
}

export function getProjectColorFromName(projectName: string): NameColorTokens {
  return getColorFromName(projectName, "proyecto");
}
