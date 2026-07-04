"use client";

import { useEffect } from "react";
import { useTimeTrackingStore } from "../store/time-tracking-store";

/**
 * Carga una única vez el estado persistido en `localStorage` hacia el store
 * de dominio, después del montaje en cliente. No renderiza nada.
 *
 * El estado inicial del store es siempre vacío (igual en servidor y
 * cliente); este componente evita que la hidratación de Next.js falle por
 * una discrepancia entre el HTML del servidor y el primer render del
 * cliente (`localStorage` no existe en el servidor).
 */
export function StoreHydrator() {
  useEffect(() => {
    useTimeTrackingStore.getState().hydrate();
  }, []);

  return null;
}
