import type { Metadata } from "next";
import { PanelTareas } from "@/features/tareas/components/PanelTareas";

export const metadata: Metadata = {
  title: "Tareas · Time Tracker",
};

/**
 * Ruta del panel principal de Tareas (App Router, ADR-001). Monta el
 * contenedor de la feature `tareas` dentro del layout raíz compartido
 * (`src/app/layout.tsx`).
 */
export default function TareasPage() {
  return <PanelTareas />;
}
