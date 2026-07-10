import { useEffect, useState } from "react";

/**
 * Segundos transcurridos desde `startedAt`, actualizados cada segundo
 * mientras el temporizador está activo. Alimenta el reloj en vivo de la
 * tarjeta de actividad actual (sin AC/TC que fije su formato exacto).
 */
export function useElapsedSeconds(startedAt: number | null): number {
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (startedAt == null) {
      return;
    }

    const intervalId = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(intervalId);
  }, [startedAt]);

  if (startedAt == null) {
    return 0;
  }

  return Math.max(0, Math.floor((nowMs - startedAt) / 1000));
}
