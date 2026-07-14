import type { Metadata } from "next";
import { ProyectosListado } from "@/features/proyectos";

export const metadata: Metadata = {
  title: "Proyectos · TimeTracker",
};

/**
 * Ruta de la sección Proyectos (US-001): renderiza el listado de Proyectos
 * junto con las acciones de creación/edición (AC-004/AC-005), consumiendo el
 * store raíz compartido (`useAppStore`) provisto por
 * `fundamentos-infraestructura-compartida`.
 */
export default function ProyectosPage() {
  return <ProyectosListado />;
}
