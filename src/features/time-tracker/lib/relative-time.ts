export function formatRelativeTime(isoDate: string, now: Date): string {
  const target = new Date(isoDate);
  const diffMinutes = Math.floor((now.getTime() - target.getTime()) / 60000);

  if (diffMinutes < 1) {
    return "hace un momento";
  }
  if (diffMinutes < 120) {
    return `hace ${diffMinutes}m`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `hace ${diffHours}h`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) {
    return "Ayer";
  }
  return `hace ${diffDays} días`;
}
