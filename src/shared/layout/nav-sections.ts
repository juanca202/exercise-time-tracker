/** Secciones de navegación de la aplicación y su ruta asociada. */
export interface NavSection {
  id: string;
  label: string;
  href: string;
}

export const NAV_SECTIONS: readonly NavSection[] = [
  { id: "tasks", label: "Tareas", href: "/" },
  { id: "projects", label: "Proyectos", href: "/proyectos" },
  { id: "history", label: "Historial de registros", href: "/historial" },
];

/**
 * Resuelve la sección activa a partir del pathname actual. La sección raíz
 * ('/') solo coincide de forma exacta para no capturar todas las demás rutas.
 */
export function resolveActiveSection(pathname: string): NavSection | undefined {
  return NAV_SECTIONS.find((section) =>
    section.href === "/" ? pathname === "/" : pathname.startsWith(section.href),
  );
}
