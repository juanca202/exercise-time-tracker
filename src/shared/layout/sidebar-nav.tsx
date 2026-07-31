"use client";

import type { ReactElement } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_SECTIONS, resolveActiveSection } from "./nav-sections";
import { HistoryIcon, ProjectsIcon, TasksIcon } from "./nav-icons";

const ICONS_BY_SECTION_ID: Record<
  string,
  (props: { className?: string }) => ReactElement
> = {
  tasks: TasksIcon,
  projects: ProjectsIcon,
  history: HistoryIcon,
};

/** Lista de navegación de la barra lateral, con resaltado de la sección activa. */
export function SidebarNav() {
  const pathname = usePathname();
  const activeSection = resolveActiveSection(pathname);

  return (
    <nav aria-label="Navegación principal">
      <ul className="flex flex-col gap-1">
        {NAV_SECTIONS.map((section) => {
          const isActive = section.id === activeSection?.id;
          const Icon = ICONS_BY_SECTION_ID[section.id];

          return (
            <li key={section.id}>
              <Link
                href={section.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 py-3 pr-4 text-sm transition-colors ${
                  isActive
                    ? "border-l-2 border-secondary bg-surface-container-low pl-[18px] font-bold text-primary"
                    : "pl-4 font-normal text-on-surface-variant hover:bg-surface"
                }`}
              >
                <Icon className="shrink-0" />
                {section.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
