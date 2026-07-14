import type { Metadata } from "next";
import { PanelTareas } from "@/features/tareas/components/PanelTareas";

export const metadata: Metadata = {
  title: "Tareas · TimeTracker",
};

/**
 * Ruta de la sección Tareas (US-002): renderiza el panel principal de
 * Tareas (TopAppBar, resumen semanal/mensual, Sesión Activa, ingreso manual
 * de tiempo y listado "Tareas Recientes" con su temporizador), consumiendo
 * el store raíz compartido (`useAppStore`) provisto por
 * `fundamentos-infraestructura-compartida`.
 */
export default function TareasPage() {
  return <PanelTareas />;
}
