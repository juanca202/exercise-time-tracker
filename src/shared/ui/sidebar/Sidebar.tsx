"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ItemNavegacion {
  href: "/tareas" | "/proyectos" | "/historial";
  etiqueta: string;
}

const ITEMS_NAVEGACION: ItemNavegacion[] = [
  { href: "/tareas", etiqueta: "Tareas" },
  { href: "/proyectos", etiqueta: "Proyectos" },
  { href: "/historial", etiqueta: "Historial de registros" },
];

/**
 * Barra de navegación lateral fija de la aplicación (frame Figma
 * "Aside - SideNavBar"). Enlaza a las tres secciones finales de Time Tracker
 * y marca como activo el ítem correspondiente a la ruta actual.
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación principal"
      className="flex h-full w-[280px] shrink-0 flex-col gap-1 bg-primary px-4 py-6 text-on-primary"
    >
      <span className="text-label-meta mb-4 px-3 text-on-primary/70 uppercase">
        Time Tracker
      </span>
      <ul className="flex flex-col gap-1">
        {ITEMS_NAVEGACION.map((item) => {
          const estaActivo = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={estaActivo ? "page" : undefined}
                className={`text-body-md flex items-center rounded-md px-3 py-2 transition-colors ${
                  estaActivo
                    ? "bg-primary-container text-on-primary-container"
                    : "text-on-primary/85 hover:bg-primary-container/60"
                }`}
              >
                {item.etiqueta}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
