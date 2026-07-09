"use client";

import { useHydrateProjectsStore } from "@/features/projects";
import { AppShell } from "@/components/layout/AppShell";
import { formatDuration } from "@/lib/formatDuration";
import Link from "next/link";
import {
  selectMonthlyTotal,
  selectWeeklyGoalProgress,
  selectWeeklyTotal,
} from "../selectors";
import { useTasksStore } from "../store/tasksStore";
import { useHydrateTasksStore } from "../store/useHydrateTasksStore";
import { ActiveTimerCard } from "./ActiveTimerCard";
import { ManualEntryForm } from "./ManualEntryForm";
import { NewTaskButton, NewTaskDialog } from "./NewTaskModal";
import { TaskListItem } from "./TaskListItem";

/** Pantalla "Tareas": temporizador activo, entrada manual, resumen semanal/mensual y Tareas Recientes. */
export function TasksScreen() {
  useHydrateTasksStore();
  // Este panel también lee `useProjectsStore` (Select de Proyecto, nombre de Proyecto por Tarea).
  useHydrateProjectsStore();
  const tasks = useTasksStore((state) => state.tasks);
  // Se suscribe a timeEntries para que el resumen semanal/mensual reaccione a nuevos Registros.
  useTasksStore((state) => state.timeEntries);

  const weeklyTotal = selectWeeklyTotal();
  const monthlyTotal = selectMonthlyTotal();
  const progress = selectWeeklyGoalProgress();

  return (
    <AppShell activeNav="tasks" headerAction={<NewTaskButton />}>
      <div className="mx-auto max-w-[1280px] p-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold text-primary">Tareas</h1>
            <p className="mt-1 text-on-surface-variant">
              Has alcanzado el{" "}
              <span className="font-bold text-secondary">{progress}%</span> de
              tu meta semanal.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="min-w-40 border border-outline-variant bg-surface-container-lowest px-4 py-4 shadow-sm">
              <p className="font-mono text-xs tracking-wider text-on-surface-variant/50 uppercase">
                Total Semanal
              </p>
              <p className="text-2xl font-bold text-primary">
                {formatDuration(weeklyTotal)}
              </p>
            </div>
            <div className="min-w-40 border border-outline-variant bg-surface-container-lowest px-4 py-4 shadow-sm">
              <p className="font-mono text-xs tracking-wider text-on-surface-variant/50 uppercase">
                Total Mensual
              </p>
              <p className="text-2xl font-bold text-primary">
                {formatDuration(monthlyTotal)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <ActiveTimerCard />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <ManualEntryForm />
          </div>

          <div className="col-span-12 border border-outline-variant bg-surface-container-lowest shadow-sm">
            <div className="flex items-center justify-between border-b border-outline-variant bg-surface px-6 py-6">
              <h3 className="font-bold text-primary">Tareas Recientes</h3>
              <Link
                href="/history"
                className="text-sm font-bold text-primary hover:underline"
              >
                Ver Historial
              </Link>
            </div>
            {tasks.length === 0 ? (
              <p className="p-6 text-on-surface-variant">
                Todavía no creaste ninguna tarea.
              </p>
            ) : (
              <ul>
                {tasks.map((task) => (
                  <TaskListItem key={task.id} task={task} />
                ))}
              </ul>
            )}
          </div>
        </div>

        <NewTaskDialog />
      </div>
    </AppShell>
  );
}
