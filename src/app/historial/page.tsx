import type { Metadata } from "next";
import { HistorialScreen } from "@/features/historial/components/HistorialScreen";

export const metadata: Metadata = {
  title: "Historial de registros | Time Tracker",
  description:
    "Historial completo de Registros de Tiempo y totales acumulados por Tarea, Proyecto y mes.",
};

export default function HistorialPage() {
  return <HistorialScreen />;
}
