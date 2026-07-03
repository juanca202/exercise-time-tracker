"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Tareas" },
  { href: "/projects", label: "Proyectos" },
  { href: "/history", label: "Historial de Registros" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="w-[280px] shrink-0 border-r border-outline-variant bg-surface p-6">
        <p className="text-headline-md font-semibold text-on-surface">
          TimeTracker
        </p>
        <nav aria-label="Navegación principal" className="mt-8">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`block rounded px-3 py-2 text-body-lg ${
                      isActive
                        ? "bg-surface-container font-semibold text-on-surface"
                        : "text-on-surface-variant hover:bg-surface-container-low"
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
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
