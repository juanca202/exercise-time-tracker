# TK-005: UI y diseño de la pantalla de Proyectos

**Estado**: Ready
**Historia**: [US-001](./README.md)
**Repositorio**: exercise-time-tracker
**Asignado a**: juanca202

## Descripción

Aplicar el sistema de diseño `DESIGN.md` (tema "Precision Focus": colores, tipografía, radios y espaciado) a los componentes ya funcionales de la pantalla de Proyectos ([TK-001](TK-001-crear-proyecto.md), [TK-002](TK-002-editar-proyecto.md), [TK-004](TK-004-listado-proyectos.md)), verificar su fidelidad visual frente al prototipo de alta fidelidad en Figma, y confirmar que la navegación lateral hacia Proyectos (ya provista por US-000) queda accesible desde cualquier otra sección.

## Dependencias

- [TK-001: Crear Proyecto](TK-001-crear-proyecto.md), [TK-002: Editar Proyecto](TK-002-editar-proyecto.md), [TK-004: Listado de Proyectos](TK-004-listado-proyectos.md) — componentes funcionales (`proyecto-modal.tsx`, `proyecto-card.tsx`, `proyectos-listado.tsx`, `src/app/proyectos/page.tsx`) sobre los que se aplica esta tarea; TK-005 no agrega comportamiento nuevo, solo estilo y verificación visual.
- [TK-005: Layout y sidebar de navegación (US-000)](../US-000-fundamentos/TK-005-layout-sidebar-navegacion.md) — `AppShell` + `SidebarNav` ya implementan la navegación lateral con el enlace a `/proyectos` (AC-008); esta tarea no modifica ese módulo compartido, solo verifica el resultado (TC-014).

## Referencias

- **Arquitectura:** [ADR-002: Uso de Tailwind CSS](../../../adr/ADR-002-uso-de-tailwind-css.md) (los tokens de tema se centralizan en la configuración de Tailwind), [ADR-003: Uso de Base UI](../../../adr/ADR-003-uso-de-base-ui.md), [ADR-005: Arquitectura feature-based](../../../adr/ADR-005-arquitectura-feature-based.md).
- **Sistema de diseño:** [DESIGN.md](../../../../DESIGN.md) — tema "Precision Focus": paleta de colores, tipografía (Inter / JetBrains Mono), radios, espaciado (front-matter) y las secciones "Colors", "Typography", "Layout & Spacing", "Elevation & Depth" y "Shapes".
- **Diseño / prototipo:** [Figma - Exercise · Time Tracker](https://www.figma.com/design/K6uQLWg82KsCSpHJVXSf6L) — specs extraídas vía MCP de Figma (`get_design_context`) sobre la pantalla "Proyectos" (`nodeId 1:1571`) y el diálogo "Proyectos - Diálogo Nuevo proyecto" (`nodeId 1:1642`):
  - **Colores** (coinciden 1:1 con los tokens ya definidos en `DESIGN.md`): fondo de página `#f7f9fb` (`surface`); tarjetas y modal `#ffffff` (`surface-container-lowest`) con borde `#c6c6ce` (`outline-variant`); título y texto primario `#182442` (`primary`); texto secundario/descripciones `#45464e` (`on-surface-variant`); barra de acento lateral `#182442` al 20% de opacidad en todas las tarjetas por igual — confirmado con el usuario que el acento `secondary` (`#006c4b`) que el prototipo muestra en una sola tarjeta de ejemplo es dato ilustrativo sin regla de negocio asociada, no un estado a implementar; fondo del ícono del estado vacío `#f2f4f6` (`surface-container-low`); overlay del modal `rgba(25,28,30,0.4)` con `backdrop-blur` 2px; placeholders de inputs `#6b7280` (gris neutro, no mapeado a un token de `DESIGN.md`).
  - **Tipografía**: título "Proyectos" Inter Semibold 32px/40px (`headline-lg`); título de tarjeta y de botones Inter Bold 16px/24px; descripción de tarjeta Inter Regular 14px/20px (`body-md`); título del modal "Nuevo Proyecto" Inter Semibold 24px/32px (`headline-md`); etiquetas "TIEMPO REGISTRADO", "NOMBRE DEL PROYECTO" y "DESCRIPCIÓN" en JetBrains Mono Medium 12px/16px, mayúsculas, tracking 0.6px (`label-meta`); valor de tiempo registrado JetBrains Mono Medium 20px/28px.
  - **Espaciado y forma**: contenedor de contenido máx. 1280px con padding 40px (`margin-desktop`), gap 32px entre secciones, gap 24px entre tarjetas (`gutter`); tarjeta de proyecto con padding 25px y gap interno 16px, barra de acento lateral de 6px; radio 2px (`sm`) en botones, 4px (`DEFAULT`) en inputs/textarea y en la tarjeta vacía, 8px (`lg`) en el contenedor del modal, 12px (`xl`) en el ícono circular del estado vacío.
  - **Modal "Nuevo Proyecto"**: contenedor de 512px de ancho, sombra `0 20px 25px -5px rgba(0,0,0,.1), 0 8px 10px -6px rgba(0,0,0,.1)`, encabezado con borde inferior `#c6c6ce`; campo "NOMBRE DEL PROYECTO" con placeholder "ej. Estrategia de Marketing Q4" y campo "DESCRIPCIÓN" con placeholder "Define los objetivos primarios..."; acciones "Cancelar" (borde `#c6c6ce`, sin relleno) y "Crear Proyecto" (fondo `#182442`, sombra `0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -2px rgba(0,0,0,.1)`).
  - Estado vacío de la grilla ("Button - Project Card 3 (Empty State Style)"): tarjeta con borde punteado 2px `#c6c6ce`, radio 4px, min-height 250px, contenido centrado (ícono "+" sobre círculo de 48px y radio 12px, texto "Crear Nuevo Proyecto" Inter Bold 16px).

## Archivos afectados

```text
exercise-time-tracker/
└── src/
    ├── app/
    │   ├── ~ globals.css                        # tokens Tailwind (@theme) del tema Precision Focus (DESIGN.md): colores, tipografía, radios, espaciado
    │   └── proyectos/
    │       └── ~ page.tsx                        # ajuste final de layout/spacing del encabezado y el contenedor de la pantalla
    └── features/
        └── proyectos/
            └── components/
                ├── ~ proyecto-modal.tsx           # aplica tokens Precision Focus: elevación de modal (backdrop blur 8px), tipografía, radios
                ├── ~ proyecto-card.tsx            # aplica tokens de tarjeta "Level 1" (fondo, borde, sombra difusa, radio 0.5rem)
                └── ~ proyectos-listado.tsx        # aplica grid y ritmo de espaciado (8/16/24px) según DESIGN.md
```

## Plan de implementación

- [ ] **IT-01** — Definir en `src/app/globals.css`, dentro del bloque `@theme`, los tokens de color, tipografía, radios y espaciado del tema "Precision Focus" tomados literalmente del front-matter de `DESIGN.md` (`colors`, `typography`, `rounded`, `spacing`), centralizando el ajuste de tema según ADR-002 (sin introducir una solución de estilado distinta a Tailwind). Confirmado contra Figma (nodos 1:1571, 1:1642): `primary #182442`, `secondary #006c4b`, `surface #f7f9fb`, `surface-container-lowest #ffffff`, `surface-container-low #f2f4f6`, `outline-variant #c6c6ce`, `on-surface-variant #45464e`; `rounded.sm 2px`, `rounded.DEFAULT 4px`, `rounded.lg 8px`, `rounded.xl 12px`; `spacing.unit 4px`, `spacing.gutter 24px`, `spacing.margin-desktop 40px`, `spacing.container-max-width 1280px` — sin discrepancias entre `DESIGN.md` y el prototipo.
- [ ] **IT-02** — Aplicar los tokens anteriores a `ProyectoModal` (`proyecto-modal.tsx`): overlay `rgba(25,28,30,0.4)` con `backdrop-blur` 2px; contenedor de 512px de ancho, fondo `surface-container-lowest`, borde `outline-variant`, radio `lg` (8px), sombra `0 20px 25px -5px rgba(0,0,0,.1), 0 8px 10px -6px rgba(0,0,0,.1)`; encabezado con borde inferior `outline-variant` y título "Nuevo Proyecto" en `headline-md` (Inter Semibold 24px/32px) color `primary`; etiquetas "NOMBRE DEL PROYECTO" y "DESCRIPCIÓN" en `label-meta` (JetBrains Mono Medium 12px, mayúsculas, tracking 0.6px) color `on-surface-variant`; inputs/textarea con borde `outline-variant`, radio `DEFAULT` (4px) y placeholders "ej. Estrategia de Marketing Q4" / "Define los objetivos primarios..." en Inter Regular 14px `#6b7280`; botón "Cancelar" con borde `outline-variant` y radio `sm` (2px); botón principal con fondo `primary`, radio `sm` y sombra `0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -2px rgba(0,0,0,.1)`.
- [ ] **IT-03** — Aplicar los tokens a `ProyectoCard` (`proyecto-card.tsx`): fondo `surface-container-lowest`, borde 1px `outline-variant`, padding 25px, gap interno 16px, barra de acento lateral de 6px; título Inter Bold 16px/24px color `primary`; descripción Inter Regular 14px/20px (`body-md`) color `on-surface-variant`; etiqueta "TIEMPO REGISTRADO" en `label-meta` al 50% de opacidad; valor de tiempo en JetBrains Mono Medium 20px/28px color `primary`. Barra de acento lateral: `primary` al 20% de opacidad en **todas** las tarjetas, sin variante `secondary` — decisión confirmada con el usuario (el acento distinto de una tarjeta en el prototipo es dato de ejemplo sin regla de negocio, no se implementa un estado "destacado").
- [ ] **IT-04** — Aplicar los tokens a `ProyectosListado` (`proyectos-listado.tsx`) y al contenedor de `src/app/proyectos/page.tsx`: contenedor máximo 1280px, padding 40px (`margin-desktop`), gap 32px entre encabezado y grilla, gap 24px entre tarjetas (`gutter`); tarjeta vacía ("Button - Project Card 3 (Empty State Style)") con borde punteado 2px `outline-variant`, radio `DEFAULT` (4px), min-height 250px, contenido centrado con ícono "+" sobre círculo `surface-container-low` de 48px y radio `xl` (12px), y texto "Crear Nuevo Proyecto" en Inter Bold 16px color `on-surface-variant`.
- [ ] **IT-05** — Verificar el resultado contra el prototipo de Figma (pantalla Proyectos `nodeId 1:1571`, modal "Nuevo Proyecto" `nodeId 1:1642`) obtenido vía MCP (`get_design_context` + captura de pantalla), comparando layout, colores, tipografía, espaciado y componentes (AC-009, TC-015). Verificación completada para el estado estático del prototipo (colores, tipografía, espaciado, textos y radios confirmados 1:1 contra `DESIGN.md`, ver Referencias); estados de interacción no representados en el prototipo (hover, foco, error del campo Nombre) quedan a criterio de implementación siguiendo los tokens ya confirmados.
- [ ] **IT-06** — Confirmar (sin cambios de código) que la navegación lateral hacia "Proyectos" (AC-008, TC-014) funciona sin ajustes adicionales, heredada de `SidebarNav` (US-000 TK-005).

## Observaciones

Sin pendientes documentados. La fidelidad visual contra el prototipo de Figma (IT-05) se verificó vía MCP de Figma (`get_design_context` sobre `nodeId 1:1571` y `1:1642`, fileKey `K6uQLWg82KsCSpHJVXSf6L`): colores, tipografía, espaciado y radios coinciden con los tokens ya definidos en `DESIGN.md`. El acento `secondary` que el prototipo muestra en una sola tarjeta de ejemplo quedó confirmado con el usuario como dato ilustrativo sin regla de negocio: todas las tarjetas usan el mismo acento `primary` al 20% de opacidad (ver IT-03).
