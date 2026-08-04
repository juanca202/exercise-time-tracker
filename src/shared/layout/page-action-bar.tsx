import type { ReactNode } from "react";

interface PageActionBarProps {
  children: ReactNode;
}

/**
 * Barra de acciones superior (p. ej. "Nueva Tarea" / "Nuevo Proyecto").
 * Permanece fija al hacer scroll del contenido principal.
 */
export function PageActionBar({ children }: PageActionBarProps) {
  return (
    <div className="sticky top-0 z-10 flex items-center bg-background px-6 py-3 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
      {children}
    </div>
  );
}
