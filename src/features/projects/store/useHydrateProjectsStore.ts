"use client";

import { useEffect } from "react";
import { useProjectsStore } from "./projectsStore";

/**
 * Rehidrata `useProjectsStore` desde `localStorage` una vez montado el componente.
 *
 * El store usa `skipHydration` para no tocar `localStorage` durante el render en
 * servidor del Client Component; esta rehidratación manual solo ocurre en el cliente.
 */
export function useHydrateProjectsStore(): void {
  useEffect(() => {
    void useProjectsStore.persist.rehydrate();
  }, []);
}
