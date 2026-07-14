import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tareas · TimeTracker",
};

/**
 * Ruta stub de la sección Tareas (US-000, AC-008): sin gate de autenticación
 * (AC-009), resuelve sin error hasta que US-002 (Tareas) reemplace este
 * contenido por la pantalla final.
 */
export default function PaginaTareas() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center p-10">
      <p className="text-lg text-on-surface-variant">Próximamente</p>
    </div>
  );
}
