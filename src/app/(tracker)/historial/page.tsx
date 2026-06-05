import type { Metadata } from "next";
import { HistoryPage } from "@/features/time-tracker/components/history-page";

export const metadata: Metadata = {
  title: "Historial",
  description: "Historial de registros de tiempo por período",
};

export default function HistorialPage() {
  return <HistoryPage />;
}
