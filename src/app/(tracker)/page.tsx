import type { Metadata } from "next";
import { TasksPage } from "@/features/time-tracker/components/tasks-page";

export const metadata: Metadata = {
  title: "Tareas",
  description: "Temporizador, entrada manual y tareas recientes",
};

export default function HomePage() {
  return <TasksPage />;
}
