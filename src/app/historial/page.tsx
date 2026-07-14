import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Historial de registros · TimeTracker",
};

/**
 * Ruta stub de la sección Historial de registros (US-000, AC-008): sin gate
 * de autenticación (AC-009), resuelve sin error hasta que US-003 (Historial
 * de registros) reemplace este contenido por la pantalla final.
 */
export default function PaginaHistorial() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center p-10">
      <p className="text-lg text-on-surface-variant">Próximamente</p>
    </div>
  );
}
