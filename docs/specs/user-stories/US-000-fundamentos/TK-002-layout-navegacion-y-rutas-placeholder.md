# TK-002: Layout, navegación, tema de Tailwind y rutas placeholder (verificación offline)

**Estado**: Ready
**Historia**: [US-000](./README.md)
**Repositorio**: exercise-time-tracker
**Asignado a**: juanca202

## Descripción

Definir en un único lugar compartido los tokens de tema de Tailwind (`@theme` en `src/app/globals.css`) derivados de `DESIGN.md`; mostrar un layout de nivel superior con una barra de navegación lateral fija (enlaces a Tareas, Proyectos e Historial de registros apuntando a sus rutas finales), sin requerir autenticación ni ningún gate de acceso, siguiendo con fidelidad visual el frame Figma "Aside - SideNavBar"; y resolver las rutas `/tareas`, `/proyectos` y `/historial` con una página funcional para cada una (aunque sea un placeholder mínimo de "Próximamente"), de modo que la navegación no produzca errores y garantizando que el layout, el sidebar y las 3 rutas sean completamente utilizables con la red deshabilitada.

## Dependencias

- [TK-001: Dominio, persistencia local, store raíz y helper de fecha compartidos](TK-001-dominio-persistencia-store-y-fecha.md) — `StorageBootstrapper` se monta en el layout raíz para cumplir AC-005.
- Next.js `<Link>` y `usePathname` (`next/link`, `next/navigation`) — navegación y resaltado del enlace activo (`aria-current`).
- Next.js App Router (convención de archivo `page.tsx` por carpeta de ruta).
- Tailwind CSS — estilos.

## Referencias

- **Arquitectura:** [ADR-001: Adopción exclusiva de App Router](../../../adr/ADR-001-adopcion-exclusiva-app-router.md) (layout raíz en `src/app/layout.tsx`), [ADR-002: Uso de Tailwind CSS como framework de presentación](../../../adr/ADR-002-uso-de-tailwind-css.md) (los tokens de tema se centralizan aquí, en un único bloque `@theme`, en vez de duplicarse o inferirse por cada historia que estiliza una pantalla), [ADR-005: Arquitectura del proyecto basada en features](../../../adr/ADR-005-arquitectura-feature-based.md) (ubicación en módulo compartido; componente placeholder reutilizable), [ADR-007: Estrategia de pruebas unitarias](../../../adr/ADR-007-estrategia-pruebas-unitarias.md), [ADR-008: Uso de Playwright para las pruebas E2E](../../../adr/ADR-008-uso-de-playwright-para-e2e.md) (verificación offline).
- **Sistema de diseño:** [DESIGN.md](../../../../DESIGN.md) — tema "Precision Focus": paleta de colores, tipografía (Inter / JetBrains Mono), radios, espaciado (front-matter) y las secciones "Colors", "Typography", "Layout & Spacing", "Elevation & Depth" y "Shapes". Fuente única de los tokens que definen Proyectos ([TK-002](../US-001-proyectos/TK-002-ui-diseno-proyectos.md)), Tareas ([TK-002](../US-002-tareas/TK-002-ui-pantalla-tareas-y-meta-semanal.md)) e Historial de registros ([TK-003](../US-003-historial-de-registros/TK-003-ui-diseno-historial.md)).
- **Diseño:** [Figma - exercise-time-tracker (frame "Aside - SideNavBar")](https://www.figma.com/design/K6uQLWg82KsCSpHJVXSf6L/exercise-time-tracker?node-id=9-331&m=dev) — nodo `9:473`. Especifica: aside fijo de 280px, fondo `#f7f9fb`, borde derecho `#c6c6ce` (1px), padding `24px 17px 24px 16px`; encabezado "TimeTracker" (Inter Bold 24px, `#182442`) y subtítulo "Título" (Inter Regular 16px, `#45464e`); 3 enlaces (Tareas — nodo `9:481`/ícono `9:482`, Proyectos — nodo `9:486`/ícono `9:487`, Historial de registros — nodo `9:491`/ícono `9:492`) con ícono + texto (Inter Regular 14px, `#45464e`), gap de `12px` entre ícono y texto, padding `16px 12px` por enlace y `4px` de separación entre enlaces.

## Archivos afectados

```text
exercise-time-tracker/
├── e2e/
│   └── + us-000-offline.spec.ts   # navega /, /tareas, /proyectos, /historial con la red deshabilitada (AC-011)
└── src/
    ├── app/
    │   ├── ~ globals.css                       # tokens Tailwind (@theme) del tema Precision Focus (DESIGN.md): colores, tipografía, radios, espaciado
    │   ├── ~ layout.tsx                        # envuelve children con AppShell y monta StorageBootstrapper (TK-001)
    │   ├── tareas/
    │   │   └── + page.tsx          # ruta /tareas — placeholder "Próximamente"
    │   ├── proyectos/
    │   │   └── + page.tsx          # ruta /proyectos — placeholder "Próximamente"
    │   └── historial/
    │       └── + page.tsx          # ruta /historial — placeholder "Próximamente"
    └── shared/
        ├── layout/
        │   ├── + app-shell.tsx                  # estructura del layout raíz: aside fijo (280px) + área de contenido
        │   ├── + sidebar-nav.tsx                 # enlaces Tareas/Proyectos/Historial con aria-current en el activo
        │   ├── + sidebar-nav.test.tsx
        │   └── icons/
        │       ├── + tasks-icon.tsx            # ícono SVG "Tareas" exportado del frame Figma (nodo 9:482)
        │       ├── + projects-icon.tsx         # ícono SVG "Proyectos" exportado del frame Figma (nodo 9:487)
        │       └── + history-icon.tsx          # ícono SVG "Historial de registros" exportado del frame Figma (nodo 9:492)
        └── ui/
            ├── + coming-soon.tsx      # componente "Próximamente" reutilizado por las 3 rutas
            └── + coming-soon.test.tsx
```

## Plan de implementación

- [ ] **IT-01** — Definir en `src/app/globals.css`, dentro del bloque `@theme`, los tokens de color, tipografía, radios y espaciado del tema "Precision Focus" tomados literalmente del front-matter de `DESIGN.md` (`colors`, `typography`, `rounded`, `spacing`), centralizando el ajuste de tema según ADR-002 (sin introducir una solución de estilado distinta a Tailwind): `primary #182442`, `secondary #006c4b`, `surface #f7f9fb`, `surface-container-lowest #ffffff`, `surface-container-low #f2f4f6`, `outline-variant #c6c6ce`, `on-surface-variant #45464e`; `rounded.sm 2px`, `rounded.DEFAULT 4px`, `rounded.lg 8px`, `rounded.xl 12px`; `spacing.unit 4px`, `spacing.gutter 24px`, `spacing.margin-desktop 40px`, `spacing.container-max-width 1280px`. Estos tokens son la única fuente de tema Tailwind del proyecto: ninguna otra historia los redefine ni asume valores hexadecimales propios.
- [ ] **IT-02** — Exportar los 3 íconos SVG del frame Figma "Aside - SideNavBar" (nodos `9:482`, `9:487`, `9:492`) y convertirlos en componentes React inline (`tasks-icon.tsx`, `projects-icon.tsx`, `history-icon.tsx`), sin agregar una librería de íconos nueva.
- [ ] **IT-03** — Implementar `AppShell` (`app-shell.tsx`): `<aside>` fijo de 280px de ancho, fondo `surface` (`#f7f9fb`), borde derecho `outline-variant` (`#c6c6ce`, 1px), padding `24px 17px 24px 16px`, con el encabezado "TimeTracker" y subtítulo "Título" (colores y tipografía según Referencias, usando los tokens de IT-01), más un `<main>` para el contenido de la página (`children`).
- [ ] **IT-04** — Implementar `SidebarNav` (`sidebar-nav.tsx`, client component): lista de 3 enlaces (`<Link>` de `next/link`) a `/tareas`, `/proyectos`, `/historial`, cada uno con su ícono (IT-02), texto y espaciado según Referencias; usar `usePathname()` para marcar `aria-current="page"` en el enlace cuya ruta coincide con la actual.
- [ ] **IT-05** — Integrar `AppShell` + `SidebarNav` en `src/app/layout.tsx`, reemplazando el contenido actual del `<body>`, y montar `<StorageBootstrapper />` (TK-001) dentro del layout para solicitar almacenamiento persistente al cargar la aplicación (AC-005).
- [ ] **IT-06** — Verificar visualmente el resultado contra el frame Figma "Aside - SideNavBar" (colores, tipografía, espaciado, componentes) antes de cerrar la tarea (AC-012).
- [ ] **IT-07** — Cubrir con pruebas Vitest + Testing Library (ADR-007) `sidebar-nav.test.tsx`: los 3 enlaces resuelven a `/tareas`, `/proyectos`, `/historial`, y el enlace activo recibe `aria-current="page"` según la ruta simulada.
- [ ] **IT-08** — Implementar `ComingSoon` (`coming-soon.tsx`) en `src/shared/ui/`: componente reutilizable que recibe `title: string` y renderiza el mensaje "Próximamente" (AC-008), evitando duplicar el marcado entre las 3 rutas.
- [ ] **IT-09** — Crear `src/app/tareas/page.tsx` renderizando `<ComingSoon title="Tareas" />`.
- [ ] **IT-10** — Crear `src/app/proyectos/page.tsx` renderizando `<ComingSoon title="Proyectos" />`.
- [ ] **IT-11** — Crear `src/app/historial/page.tsx` renderizando `<ComingSoon title="Historial de registros" />`.
- [ ] **IT-12** — Verificar que ninguna de las 3 rutas ni el layout raíz (IT-05) requieren autenticación ni gate de acceso alguno (AC-009): navegación directa a cada URL sin redirecciones.
- [ ] **IT-13** — Cubrir con pruebas Vitest + Testing Library (ADR-007) `coming-soon.test.tsx`: renderiza el `title` recibido y el mensaje "Próximamente".
- [ ] **IT-14** — Escribir la prueba E2E `e2e/us-000-offline.spec.ts` (Playwright, ADR-008): tras la carga inicial, deshabilitar la red del contexto de navegador y navegar a `/`, `/tareas`, `/proyectos` y `/historial`, verificando que el layout, el sidebar y el contenido de cada ruta se renderizan sin error (AC-011).

## Observaciones

Sin pendientes documentados. Los tokens de tema (IT-01) se movieron aquí desde la antigua tarea de UI de Proyectos (US-001) para que las 3 historias funcionales dependan de un único lugar compartido, en vez de que el bloque `@theme` quedara implícitamente acoplado a la implementación de Proyectos.
