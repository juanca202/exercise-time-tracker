"use client";

import { useEffect, useReducer } from "react";
import { useTimeTrackerStore } from "../store/time-tracker-store";

export function useTimerTick(): number {
  const activeTimer = useTimeTrackerStore((s) => s.activeTimer);
  const getElapsedMs = useTimeTrackerStore((s) => s.getElapsedMs);
  const [, forceUpdate] = useReducer((tick: number) => tick + 1, 0);

  useEffect(() => {
    if (!activeTimer) return;

    const interval = window.setInterval(() => {
      forceUpdate();
    }, 1000);

    return () => window.clearInterval(interval);
  }, [activeTimer]);

  if (!activeTimer) return 0;
  return getElapsedMs();
}
