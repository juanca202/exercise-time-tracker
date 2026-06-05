const MS_PER_MINUTE = 60 * 1000;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

export function formatRelativeTime(iso: string, now = new Date()): string {
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();

  if (diffMs < 0) return "Ahora";

  const diffDays = Math.floor(diffMs / MS_PER_DAY);
  if (diffDays >= 2) return `Hace ${diffDays} días`;
  if (diffDays === 1) return "Ayer";

  const diffHours = Math.floor(diffMs / MS_PER_HOUR);
  if (diffHours >= 1) {
    return `Completado hace ${diffHours}h`;
  }

  const diffMinutes = Math.floor(diffMs / MS_PER_MINUTE);
  if (diffMinutes >= 1) {
    return `Completado hace ${diffMinutes}m`;
  }

  return "Completado hace un momento";
}

export function formatCompletedRelativeTime(
  iso: string,
  now = new Date(),
): string {
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();

  if (diffMs < 0) return "Completado ahora";

  const diffDays = Math.floor(diffMs / MS_PER_DAY);
  if (diffDays >= 2) return `Completado hace ${diffDays} días`;
  if (diffDays === 1) return "Ayer";

  return formatRelativeTime(iso, now);
}
