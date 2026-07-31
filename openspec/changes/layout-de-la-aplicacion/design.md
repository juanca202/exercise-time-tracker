## Context

Next.js 16 App Router (`src/app/`), React 19, Tailwind CSS 4, Base UI, arquitectura feature-based (`src/features/`, `src/shared/`) según ADR-005. No existe aún ningún layout ni componente de navegación en el repo (`src/app/`, `src/shared/`, `src/components/` están vacíos de UI de producto). Esta es la primera capability del backlog: el resto de las pantallas (Proyectos, Tareas, Historial) se montan sobre este shell.

## Goals / Non-Goals

**Goals:**

- Un layout raíz reutilizable (barra lateral + encabezado) que envuelva todas las rutas de la app.
- Resaltado de la sección activa basado en la ruta actual (App Router).
- Cero lógica de negocio ni acceso a datos: es un componente de presentación puro.

**Non-Goals:**

- No define el contenido de las pantallas Tareas/Proyectos/Historial (cubierto por otras changes).
- No incluye responsive/mobile específico más allá de lo que ya define `DESIGN.md`.
- No incluye autenticación ni control de acceso (RSG-001 del SRS: la app no requiere auth).

## Decisiones

- **Ubicación del componente:** `src/shared/layout/` (compartido entre features, no pertenece a una sola feature) conforme a ADR-005, en vez de duplicar el shell dentro de cada feature.
- **Layout raíz de Next.js:** usar `src/app/layout.tsx` para montar la barra lateral y el encabezado una sola vez, envolviendo `{children}`, aprovechando el App Router en vez de replicar el shell en cada página.
- **Sección activa:** derivar el ítem resaltado comparando el pathname actual (`usePathname()`) contra las rutas de cada sección, en vez de manejar un estado de navegación en Zustand — es información puramente derivada de la URL, no estado de negocio (ADR-004 reserva Zustand para estado de negocio).
- **Componentes de UI:** los enlaces de la barra lateral usan `next/link` y HTML semántico (`nav`/`ul`/`li`) en vez de un componente de Base UI. **Revisión durante la implementación:** los paquetes de Base UI (`navigation-menu`, `menu`, `menubar`) están diseñados para menús con popup/overlay (portal, positioner, trigger), no para una lista de enlaces siempre visible sin disclosure — forzar ese patrón aquí habría añadido complejidad sin ningún beneficio real de accesibilidad o interacción. ADR-003 reserva Base UI para "componentes de interfaz interactivos" con patrones de ese tipo (overlays, formularios, menús); un enlace de navegación persistente ya es accesible por naturaleza con `<a>`/`<Link>` semántico. Tailwind (ADR-002) se usa para aplicar los tokens de `DESIGN.md`.

## Riesgos / Trade-offs

- [Riesgo] Acoplar el resaltado de sección activa a nombres de ruta específicos puede romperse si las rutas cambian → Mitigación: centralizar el mapeo sección↔ruta en una única constante dentro de `src/shared/layout/`.
- [Riesgo] Sin datos reales de Proyectos/Tareas aún, el layout se valida solo visualmente contra los wireframes → Mitigación: las changes de Proyectos/Tareas/Reportes se implementan a continuación y validan el layout con contenido real.
