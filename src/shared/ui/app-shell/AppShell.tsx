"use client";

import { useEffect, type ReactNode } from "react";
import { useStoreRaiz } from "../../store";
import { Sidebar } from "../sidebar";

/**
 * Solicita almacenamiento persistente al navegador de forma best-effort, sin
 * bloquear el render ni requerir que el usuario conceda permiso explícito.
 */
const solicitarAlmacenamientoPersistente = (): void => {
  void navigator.storage?.persist?.().catch(() => {
    // Best-effort: si el navegador rechaza o no soporta la API, la
    // aplicación continúa funcionando con normalidad.
  });
};

/**
 * Layout de nivel superior: monta la barra de navegación lateral fija y el
 * contenido de la sección activa, dispara la rehidratación del store raíz
 * desde el almacenamiento local y solicita almacenamiento persistente al
 * arrancar la aplicación (AC-004, AC-005 de
 * `fundamentos-infraestructura-compartida`).
 */
export function AppShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    useStoreRaiz.getState().hidratar();
    solicitarAlmacenamientoPersistente();
  }, []);

  return (
    <div className="flex min-h-full flex-1">
      <Sidebar />
      <main className="min-w-0 flex-1 bg-background text-on-background">
        {children}
      </main>
    </div>
  );
}
