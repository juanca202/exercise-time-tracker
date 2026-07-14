import type { Metadata } from "next";
import { HistorialScreen } from "@/features/historial/components/HistorialScreen";

export const metadata: Metadata = {
  title: "Historial de registros · TimeTracker",
  description:
    "Historial completo de Registros de Tiempo y totales acumulados por Tarea, Proyecto y mes.",
};

/**
 * Ruta de la sección Historial de registros (US-003): renderiza el listado
 * de solo lectura de todos los Registros de Tiempo persistidos, junto con
 * los totales acumulados por Tarea, Proyecto y mes, consumiendo el store
 * raíz compartido (`useAppStore`) provisto por
 * `fundamentos-infraestructura-compartida`.
 */
export default function HistorialPage() {
  return <HistorialScreen />;
}
