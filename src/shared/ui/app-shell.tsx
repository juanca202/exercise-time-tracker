"use client";

import { useState } from "react";
import type { ComponentType } from "react";
import { ProjectsPage } from "@/features/project-management";
import { TasksPanel } from "@/features/task-time-tracking";
import { HistoryPage } from "@/features/time-history";
import { IconCheckCircle, IconFolder, IconStopwatch } from "./icons";

const TABS = [
  { id: "tasks", label: "Tareas", Icon: IconCheckCircle },
  { id: "projects", label: "Proyectos", Icon: IconFolder },
  { id: "history", label: "Historial de registros", Icon: IconStopwatch },
] as const;

type TabId = (typeof TABS)[number]["id"];

const TAB_CONTENT: Record<TabId, ComponentType> = {
  projects: ProjectsPage,
  tasks: TasksPanel,
  history: HistoryPage,
};

export function AppShell() {
  const [activeTab, setActiveTab] = useState<TabId>("projects");
  const ActiveTabContent = TAB_CONTENT[activeTab];
  const activeLabel = TABS.find((tab) => tab.id === activeTab)?.label;

  return (
    <div className="flex min-h-screen w-full bg-page">
      <aside className="flex w-[280px] shrink-0 flex-col border-r border-border bg-page px-4 py-6">
        <div className="flex flex-col px-2 pb-10">
          <h1 className="text-2xl font-bold text-ink">TimeTracker</h1>
          <p className="text-base text-ink-muted opacity-70">{activeLabel}</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {TABS.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "flex items-center gap-3 border-l-2 border-accent bg-surface-muted py-3 pr-4 pl-[18px] text-sm font-bold text-ink"
                    : "flex items-center gap-3 px-4 py-3 text-sm text-ink-muted"
                }
              >
                <Icon className="size-5 shrink-0" />
                {label}
              </button>
            );
          })}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <ActiveTabContent />
      </div>
    </div>
  );
}
