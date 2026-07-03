"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/tasks", label: "Tareas" },
  { href: "/projects", label: "Proyectos" },
  { href: "/history", label: "Historial de Registros" },
] as const;

/**
 * Navegación lateral persistente de la aplicación (Tareas, Proyectos,
 * Historial de Registros), con resaltado de la sección activa.
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-[280px] shrink-0 flex-col gap-6 border-r border-border bg-surface-elevated p-6">
      <div>
        <p className="text-lg font-semibold text-foreground">TimeTracker</p>
        <p className="text-sm text-tertiary">Panel de Control</p>
      </div>
      <nav aria-label="Secciones de la aplicación">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`block rounded-(--radius-standard) px-3 py-2 text-sm font-medium ${
                    isActive
                      ? "bg-surface text-foreground"
                      : "text-tertiary hover:bg-surface hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
