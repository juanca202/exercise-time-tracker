import type { Metadata } from "next";
import { ProjectsPage } from "@/features/time-tracker/components/projects-page";

export const metadata: Metadata = {
  title: "Proyectos",
  description: "Proyectos y tiempo registrado por período",
};

export default function ProyectosPage() {
  return <ProjectsPage />;
}
