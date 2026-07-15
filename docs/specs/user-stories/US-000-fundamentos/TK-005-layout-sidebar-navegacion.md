# TK-005: Layout y sidebar de navegación

**Estado**: Ready
**Historia**: [US-000](./README.md)
**Repositorio**: exercise-time-tracker
**Asignado a**: juanca202

## Descripción

Mostrar un layout de nivel superior con una barra de navegación lateral fija (enlaces a Tareas, Proyectos e Historial de registros apuntando a sus rutas finales), sin requerir autenticación ni ningún gate de acceso, siguiendo con fidelidad visual el frame Figma "Aside - SideNavBar".

## Dependencias

- [TK-002: Adaptador de persistencia local](TK-002-adaptador-persistencia-local.md) — `StorageBootstrapper` se monta en el layout raíz para cumplir AC-005.
- Next.js `<Link>` y `usePathname` (`next/link`, `next/navigation`) — navegación y resaltado del enlace activo (`aria-current`).
- Tailwind CSS — estilos.

## Referencias

- **Arquitectura:** [ADR-001: Adopción exclusiva de App Router](../../../adr/ADR-001-adopcion-exclusiva-app-router.md) (layout raíz en `src/app/layout.tsx`), [ADR-002: Uso de Tailwind CSS como framework de presentación](../../../adr/ADR-002-uso-de-tailwind-css.md), [ADR-005: Arquitectura del proyecto basada en features](../../../adr/ADR-005-arquitectura-feature-based.md) (ubicación en módulo compartido), [ADR-007: Estrategia de pruebas unitarias](../../../adr/ADR-007-estrategia-pruebas-unitarias.md).
- **Diseño:** [Figma - exercise-time-tracker (frame "Aside - SideNavBar")](https://www.figma.com/design/K6uQLWg82KsCSpHJVXSf6L/exercise-time-tracker?node-id=9-331&m=dev) — nodo `9:473`. Especifica: aside fijo de 280px, fondo `#f7f9fb`, borde derecho `#c6c6ce` (1px), padding `24px 17px 24px 16px`; encabezado "TimeTracker" (Inter Bold 24px, `#182442`) y subtítulo "Título" (Inter Regular 16px, `#45464e`); 3 enlaces (Tareas — nodo `9:481`/ícono `9:482`, Proyectos — nodo `9:486`/ícono `9:487`, Historial de registros — nodo `9:491`/ícono `9:492`) con ícono + texto (Inter Regular 14px, `#45464e`), gap de `12px` entre ícono y texto, padding `16px 12px` por enlace y `4px` de separación entre enlaces.

## Archivos afectados

```text
exercise-time-tracker/
└── src/
    ├── app/
    │   └── ~ layout.tsx                        # envuelve children con AppShell y monta StorageBootstrapper (TK-002)
    └── shared/
        └── layout/
            ├── + app-shell.tsx                  # estructura del layout raíz: aside fijo (280px) + área de contenido
            ├── + sidebar-nav.tsx                 # enlaces Tareas/Proyectos/Historial con aria-current en el activo
            ├── + sidebar-nav.test.tsx
            └── icons/
                ├── + icono-tareas.tsx            # ícono SVG "Tareas" exportado del frame Figma (nodo 9:482)
                ├── + icono-proyectos.tsx         # ícono SVG "Proyectos" exportado del frame Figma (nodo 9:487)
                └── + icono-historial.tsx         # ícono SVG "Historial de registros" exportado del frame Figma (nodo 9:492)
```

## Plan de implementación

- [ ] **IT-01** — Exportar los 3 íconos SVG del frame Figma "Aside - SideNavBar" (nodos `9:482`, `9:487`, `9:492`) y convertirlos en componentes React inline (`icono-tareas.tsx`, `icono-proyectos.tsx`, `icono-historial.tsx`), sin agregar una librería de íconos nueva.
- [ ] **IT-02** — Implementar `AppShell` (`app-shell.tsx`): `<aside>` fijo de 280px de ancho, fondo `#f7f9fb`, borde derecho `#c6c6ce` (1px), padding `24px 17px 24px 16px`, con el encabezado "TimeTracker" y subtítulo "Título" (colores y tipografía según Referencias), más un `<main>` para el contenido de la página (`children`).
- [ ] **IT-03** — Implementar `SidebarNav` (`sidebar-nav.tsx`, client component): lista de 3 enlaces (`<Link>` de `next/link`) a `/tareas`, `/proyectos`, `/historial`, cada uno con su ícono (IT-01), texto y espaciado según Referencias; usar `usePathname()` para marcar `aria-current="page"` en el enlace cuya ruta coincide con la actual.
- [ ] **IT-04** — Integrar `AppShell` + `SidebarNav` en `src/app/layout.tsx`, reemplazando el contenido actual del `<body>`, y montar `<StorageBootstrapper />` (TK-002) dentro del layout para solicitar almacenamiento persistente al cargar la aplicación (AC-005).
- [ ] **IT-05** — Verificar visualmente el resultado contra el frame Figma "Aside - SideNavBar" (colores, tipografía, espaciado, componentes) antes de cerrar la tarea (AC-012).
- [ ] **IT-06** — Cubrir con pruebas Vitest + Testing Library (ADR-007) `sidebar-nav.test.tsx`: los 3 enlaces resuelven a `/tareas`, `/proyectos`, `/historial`, y el enlace activo recibe `aria-current="page"` según la ruta simulada.
