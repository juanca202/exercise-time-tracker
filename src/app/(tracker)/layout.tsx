import type { Metadata } from "next";
import { Sidebar } from "@/features/time-tracker/components/sidebar";

export const metadata: Metadata = {
  title: "Panel",
  description: "Gestión de tareas, proyectos e historial de tiempo",
};

export default function TrackerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-1 flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 overflow-auto p-4 md:p-10">
        <div className="mx-auto max-w-[1280px]">{children}</div>
      </main>
    </div>
  );
}
