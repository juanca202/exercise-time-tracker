import { formatHoursMinutesSeconds } from "@/shared/format-duration";

/** Formatea segundos como `HH:MM:SS`. */
export function formatElapsedTime(totalSeconds: number): string {
  return formatHoursMinutesSeconds(totalSeconds);
}

/** Formatea un ISO datetime como `hh:mm AM/PM` (p. ej. "09:15 AM"). */
export function formatStartTime(isoDateTime: string): string {
  const date = new Date(isoDateTime);
  const hours24 = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

  return `${hours12.toString().padStart(2, "0")}:${minutes} ${period}`;
}
