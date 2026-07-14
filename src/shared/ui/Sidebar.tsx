"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface EnlaceDeNavegacion {
  href: string;
  etiqueta: string;
}

const ENLACES: EnlaceDeNavegacion[] = [
  { href: "/tareas", etiqueta: "Tareas" },
  { href: "/proyectos", etiqueta: "Proyectos" },
  { href: "/historial", etiqueta: "Historial" },
];

/**
 * Barra de navegación lateral fija del app shell (frame Figma
 * "Aside - SideNavBar"), con enlaces a las tres rutas funcionales de Time
 * Tracker. Navegación pura vía `next/link` (sin red, sin autenticación).
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación principal"
      className="flex h-full w-70 shrink-0 flex-col gap-1 border-r border-outline-variant bg-primary px-4 py-6"
    >
      <span className="mb-6 px-2 font-mono text-xs font-medium tracking-wide text-on-primary-container uppercase">
        Time Tracker
      </span>
      {ENLACES.map((enlace) => {
        const activo = pathname?.startsWith(enlace.href) ?? false;
        return (
          <Link
            key={enlace.href}
            href={enlace.href}
            aria-current={activo ? "page" : undefined}
            className={`rounded-precision-md px-3 py-2 text-sm font-medium transition-colors ${
              activo
                ? "bg-primary-container text-on-primary"
                : "text-on-primary-container hover:bg-primary-container/60 hover:text-on-primary"
            }`}
          >
            {enlace.etiqueta}
          </Link>
        );
      })}
    </nav>
  );
}
