"use client";

import { Toolbar } from "@base-ui/react/toolbar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { IconoHistorial, IconoProyectos, IconoTareas } from "./iconos";

interface EnlaceDeNavegacion {
  href: "/tareas" | "/proyectos" | "/historial";
  etiqueta: string;
  Icono: ComponentType<{ className?: string }>;
}

/**
 * Enlaces de navegación del sidebar hacia las rutas finales de las tres
 * secciones de la aplicación (AC-007). El orden replica el frame Figma
 * "Aside - SideNavBar": Tareas, Proyectos, Historial de registros.
 */
const ENLACES_DE_NAVEGACION: EnlaceDeNavegacion[] = [
  { href: "/tareas", etiqueta: "Tareas", Icono: IconoTareas },
  { href: "/proyectos", etiqueta: "Proyectos", Icono: IconoProyectos },
  {
    href: "/historial",
    etiqueta: "Historial de registros",
    Icono: IconoHistorial,
  },
];

/**
 * Barra de navegación lateral fija de la aplicación (US-000, AC-007, AC-012),
 * fiel al frame Figma "Aside - SideNavBar": colores, tipografía y espaciado
 * extraídos de ese frame y del sistema de diseño "Precision Focus"
 * (DESIGN.md), mapeados a tokens de Tailwind CSS en `globals.css`.
 *
 * Construida sobre `Toolbar` de Base UI (ADR-003) para obtener navegación por
 * teclado (flechas) entre los enlaces de forma accesible out-of-the-box; cada
 * enlace se renderiza como `Link` de Next.js (ADR-001) para navegar sin
 * recarga completa y sin depender de red (AC-011).
 *
 * Es parte de la superficie de API estable de esta historia (BR-03,
 * AC-010): las historias funcionales de Proyectos, Tareas e Historial de
 * registros no necesitan modificar este componente, solo reemplazar el
 * contenido de sus propias rutas.
 *
 * Marca como activo (`aria-current="page"`) el enlace de la sección actual,
 * a partir de la ruta activa (US-001, AC-008).
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-[280px] shrink-0 flex-col border-r border-outline-variant bg-surface py-6 pr-[17px] pl-4">
      <div className="flex w-full flex-col items-start gap-6 px-2 pb-10">
        <h1 className="w-full text-2xl leading-8 font-bold text-primary">
          TimeTracker
        </h1>
        <p className="w-full text-base leading-6 text-on-surface-variant">
          Título
        </p>
      </div>

      <nav aria-label="Navegación principal" className="w-full flex-1">
        <Toolbar.Root
          orientation="vertical"
          className="flex w-full flex-col gap-1"
        >
          {ENLACES_DE_NAVEGACION.map(({ href, etiqueta, Icono }) => {
            const estaActivo = pathname === href;

            return (
              <Toolbar.Link
                key={href}
                render={<Link href={href} />}
                aria-current={estaActivo ? "page" : undefined}
                className="flex w-full items-center gap-3 rounded px-4 py-3 text-sm leading-5 text-on-surface-variant hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary aria-[current=page]:bg-black/5 aria-[current=page]:font-medium aria-[current=page]:text-primary"
              >
                <Icono className="size-5 shrink-0" />
                <span>{etiqueta}</span>
              </Toolbar.Link>
            );
          })}
        </Toolbar.Root>
      </nav>
    </aside>
  );
}
