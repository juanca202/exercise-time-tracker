import type { ReactNode } from "react";

export interface TopAppBarProps {
  /** Contenido alineado a la izquierda de la barra (p. ej. la acción principal de la pantalla). */
  children: ReactNode;
}

/**
 * Barra superior fija de 64px (frame Figma "Tareas", nodo "Header -
 * TopAppBar"): fondo `surface` y una sombra sutil inferior que la separa del
 * bloque de contenido de la pantalla (título, resumen, tarjetas).
 *
 * Genérica y reutilizable por cualquier pantalla que necesite el mismo
 * patrón de encabezado (p. ej. Proyectos), aunque hoy solo la consume
 * Tareas: cada pantalla decide qué acción(es) renderizar dentro, alineadas a
 * la izquierda como en el frame de referencia.
 */
export function TopAppBar({ children }: TopAppBarProps) {
  return (
    <div className="flex h-16 w-full shrink-0 items-center bg-surface px-6 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
      {children}
    </div>
  );
}
