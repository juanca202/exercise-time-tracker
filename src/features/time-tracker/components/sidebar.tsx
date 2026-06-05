"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Bars3Icon,
  CheckCircleIcon,
  ClockIcon,
  FolderIcon,
  XMarkIcon,
  iconClassName,
} from "./icons";
import { SidebarActiveTimer } from "./sidebar-active-timer";

const navItems = [
  { href: "/", label: "Tareas", Icon: CheckCircleIcon },
  { href: "/proyectos", label: "Proyectos", Icon: FolderIcon },
  { href: "/historial", label: "Historial de Registros", Icon: ClockIcon },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col">
      {navItems.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 border-l-4 py-3 pl-5 pr-4 text-body-md transition-colors",
              isActive
                ? "border-l-accent bg-nav-active font-semibold text-primary"
                : "border-l-transparent text-on-surface-variant hover:bg-nav-active hover:text-on-surface",
            )}
          >
            <item.Icon
              className={iconClassName(
                "lg",
                isActive ? "text-primary" : "text-on-surface-variant",
              )}
              aria-hidden="true"
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const showSidebarTimer = pathname !== "/";

  return (
    <>
      <div className="flex items-center justify-between border-b border-card-border bg-sidebar px-4 py-3 md:hidden">
        <p className="text-body-lg font-bold text-primary">TimeTracker</p>
        <button
          type="button"
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
          className="rounded border border-input-border p-2 text-on-surface"
        >
          {mobileOpen ? (
            <XMarkIcon className={iconClassName("lg")} aria-hidden="true" />
          ) : (
            <Bars3Icon className={iconClassName("lg")} aria-hidden="true" />
          )}
        </button>
      </div>

      {mobileOpen ? (
        <div
          className="fixed inset-0 z-40 bg-inverse-surface/30 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full w-[280px] shrink-0 flex-col border-r border-card-border bg-sidebar transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="mb-8 hidden px-6 pt-6 md:block">
          <p className="text-xl font-bold text-primary">TimeTracker</p>
          <p className="mt-0.5 text-body-md text-on-surface-variant">
            Panel de Control
          </p>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto">
          <NavLinks onNavigate={() => setMobileOpen(false)} />
        </div>
        {showSidebarTimer ? (
          <div className="sticky bottom-0 shrink-0 px-6 pb-6 pt-4">
            <SidebarActiveTimer />
          </div>
        ) : null}
      </aside>
    </>
  );
}
