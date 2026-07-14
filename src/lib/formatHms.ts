function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** Formatea una duración en milisegundos como `"HH:MM:SS"`. */
export function formatHms(durationMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
