"use client";

import { useEffect, useState } from "react";

/** Intervalo de refresco (ms) del "reloj" en vivo: 1 segundo, granularidad de los contadores HH:MM:SS. */
const INTERVALO_TICK_MS = 1000;

/**
 * Devuelve `Date.now()`, actualizado cada segundo mientras `activo` es
 * `true`. Único punto de la feature Tareas que produce un "reloj" en vivo
 * (`setInterval`): tanto la tarjeta de Sesión Activa como la Duración
 * acumulada del `TareaListItem` en curso lo consumen, en lugar de que cada
 * uno programe su propio intervalo por separado.
 *
 * Cuando `activo` es `false` no programa ningún intervalo (evita timers
 * innecesarios en filas de Tareas sin temporizador en curso) y devuelve el
 * `Date.now()` capturado en el último render.
 */
export function useAhoraEnVivo(activo: boolean): number {
  const [ahora, setAhora] = useState(() => Date.now());

  useEffect(() => {
    if (!activo) {
      return;
    }

    const idIntervalo = setInterval(() => {
      setAhora(Date.now());
    }, INTERVALO_TICK_MS);

    return () => clearInterval(idIntervalo);
  }, [activo]);

  return ahora;
}
