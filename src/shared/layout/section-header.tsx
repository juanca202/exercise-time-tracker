"use client";

import { usePathname } from "next/navigation";
import { resolveActiveSection } from "./nav-sections";

/** Nombre del producto y título de la sección activa, en la cabecera de la barra lateral. */
export function SectionHeader() {
  const pathname = usePathname();
  const activeSection = resolveActiveSection(pathname);

  return (
    <div className="px-2 pb-10">
      <p className="text-2xl font-bold text-primary">TimeTracker</p>
      <p className="text-base text-on-surface-variant">
        {activeSection?.label}
      </p>
    </div>
  );
}
