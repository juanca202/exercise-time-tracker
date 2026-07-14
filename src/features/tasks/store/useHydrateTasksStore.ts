"use client";

import { useEffect } from "react";
import { useTasksStore } from "./tasksStore";

/** Rehidrata `useTasksStore` desde `localStorage` una vez montado el componente (ver `useHydrateProjectsStore`). */
export function useHydrateTasksStore(): void {
  useEffect(() => {
    void useTasksStore.persist.rehydrate();
  }, []);
}
