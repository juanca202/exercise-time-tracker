import type { Metadata } from "next";
import { PanelTareas } from "@/features/tareas/components/PanelTareas";

export const metadata: Metadata = {
  title: "Tareas · TimeTracker",
};

/**
 * Ruta de la sección Tareas (US-002): renderiza el panel principal de
 * Tareas (listado "Tareas Recientes", temporizador, ingreso manual de
 * tiempo y widget de Meta Semanal), consumiendo el store raíz compartido
 * (`useAppStore`) provisto por `fundamentos-infraestructura-compartida`.
 */
export default function TareasPage() {
  return <PanelTareas />;
}
