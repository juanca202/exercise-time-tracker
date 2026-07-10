import { useMemo, useState } from "react";
import { useTaskTimeTrackingStore } from "./task-time-tracking-store";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Total semanal (últimos 7 días) y mensual (mes calendario en curso) de los
 * Registros de Tiempo, para las tarjetas de resumen del panel de Tareas.
 * `now` se captura una única vez al montar (inicializador perezoso de
 * `useState`), en vez de leerse en cada render, para mantener el cálculo
 * puro entre renders.
 */
export function useWeeklyMonthlyTotals(): {
  weeklySeconds: number;
  monthlySeconds: number;
} {
  const timeEntries = useTaskTimeTrackingStore((state) => state.timeEntries);
  const [now] = useState(() => Date.now());

  return useMemo(() => {
    const weekAgo = now - WEEK_MS;
    const monthStart = new Date(now);
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthStartMs = monthStart.getTime();

    let weeklySeconds = 0;
    let monthlySeconds = 0;

    for (const entry of timeEntries) {
      if (entry.startedAt >= weekAgo) {
        weeklySeconds += entry.durationSeconds;
      }
      if (entry.startedAt >= monthStartMs) {
        monthlySeconds += entry.durationSeconds;
      }
    }

    return { weeklySeconds, monthlySeconds };
  }, [timeEntries, now]);
}
