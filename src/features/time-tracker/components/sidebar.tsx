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
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-surface-container text-on-surface"
                : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
            )}
          >
            <item.Icon
              className={iconClassName(
                "lg",
                isActive ? "text-on-surface" : "text-on-surface-variant",
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
      <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-4 py-3 md:hidden">
        <p className="text-base font-semibold text-on-surface">Time Tracker</p>
        <button
          type="button"
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
          className="rounded border border-outline-variant p-2 text-on-surface"
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
          "fixed inset-y-0 left-0 z-50 flex h-full min-h-full w-[280px] shrink-0 flex-col border-r border-outline-variant bg-surface-container-lowest px-4 py-6 transition-transform md:static md:h-auto md:min-h-full md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="mb-8 hidden px-2 md:block">
          <p className="text-lg font-semibold text-on-surface">Time Tracker</p>
          <p className="text-sm text-on-surface-variant">Panel de Control</p>
        </div>
        <NavLinks onNavigate={() => setMobileOpen(false)} />
        {showSidebarTimer ? (
          <div className="mt-auto pt-6">
            <SidebarActiveTimer />
          </div>
        ) : null}
      </aside>
    </>
  );
}
