"use client";

import { useEffect } from "react";
import { suscribir } from "@/shared/persistence";
import { useAppStore } from "./app-store";
import { solicitarAlmacenamientoPersistente } from "./solicitar-almacenamiento-persistente";

/**
 * Efectos de arranque de la aplicación, centralizados en un único componente
 * cliente montado desde el layout raíz (AC-004, AC-005):
 *
 * - Rehidrata el store raíz desde el adaptador de persistencia y marca
 *   `haHidratado = true` al terminar.
 * - Se suscribe a cambios externos del estado persistido (p. ej. otra pestaña).
 * - Solicita almacenamiento persistente al navegador de forma best-effort.
 *
 * No renderiza ningún elemento visual.
 */
export function InicializadorAplicacion(): null {
  useEffect(() => {
    useAppStore.getState().hidratar();
    solicitarAlmacenamientoPersistente();

    const desuscribir = suscribir((estadoPersistido) => {
      useAppStore.getState().reemplazarEntidades({
        proyectos: estadoPersistido.proyectos,
        tareas: estadoPersistido.tareas,
        registrosDeTiempo: estadoPersistido.registrosDeTiempo,
        temporizadorActivo: estadoPersistido.temporizadorActivo,
      });
    });

    return desuscribir;
  }, []);

  return null;
}
