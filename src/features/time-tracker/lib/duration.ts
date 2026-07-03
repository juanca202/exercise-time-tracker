export function formatDurationClock(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function formatDurationShort(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${hours}h ${pad(minutes)}m`;
}

export function parseManualDuration(input: string): number | null {
  const match = /^(\d{1,3}):([0-5]\d)$/.exec(input.trim());
  if (!match) {
    return null;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const totalSeconds = hours * 3600 + minutes * 60;
  return totalSeconds > 0 ? totalSeconds : null;
}
