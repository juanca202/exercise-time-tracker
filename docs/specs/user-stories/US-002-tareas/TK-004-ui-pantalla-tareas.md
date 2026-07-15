# TK-004: UI de la pantalla de Tareas y modal

**Estado**: Ready
**Historia**: [US-002](./README.md)
**Repositorio**: exercise-time-tracker
**Asignado a**: juanca202

## Descripción

Implementar la pantalla de Tareas (panel principal: listado de Tareas Recientes con acción para iniciar el temporizador, estado del temporizador activo, Meta Semanal, Total Semanal y Total Mensual) y el modal único "Nueva Tarea"/"Editar Tarea", reemplazando el placeholder de la ruta `/tareas` (US-000, AC-008) por la pantalla real, adherida al sistema de diseño DESIGN.md (tema Precision Focus) y visualmente fiel al prototipo de alta fidelidad en Figma referenciado.

## Dependencias

- `src/shared/layout/` — `AppShell`, `SidebarNav` (US-000); resuelven la ruta `/tareas` con un placeholder que esta tarea reemplaza.
- `src/shared/store/app-store.ts` — `useTareas()`, `useProyectos()`.
- `src/shared/persistence/` — `useHasHydrated()`.
- `src/features/tareas/hooks/useCrearTarea.ts` ([TK-001](./TK-001-crear-tarea.md)) y `useEditarTarea.ts` ([TK-003](./TK-003-editar-tarea.md)) — lógica que `ModalTarea`/`FormularioTarea` invocan.
- `src/features/tareas/components/WidgetTemporizador.tsx` ([TK-005](./TK-005-temporizador.md)) — compuesto dentro de `PanelTareas`.
- `src/features/tareas/hooks/useTemporizador.ts` ([TK-005](./TK-005-temporizador.md)) — usado por `ListaTareas`/`TarjetaTarea` para alternar entre la acción de iniciar (▷) y la de detener según la Tarea con el temporizador activo.
- `src/features/tareas/components/TarjetaEntradaManual.tsx` ([TK-006](./TK-006-registro-manual.md)) — tarjeta "Entrada Manual" compuesta directamente en el Bento Grid del panel principal (no es un modal disparado por una acción; ver corrección en Observaciones).
- `src/features/tareas/components/WidgetMetaSemanal.tsx` y `WidgetTotalSemanal.tsx` ([TK-007](./TK-007-meta-y-total-semanal.md)) — compuestos dentro de `PanelTareas`.

## Referencias

- **Diseño:** [Figma - Exercise · Time Tracker (pantalla Tareas y modal Nueva Tarea)](https://www.figma.com/design/YYHDIH7CBsZrZ4VKXvbzkR/Exercise---Time-Tracker)
- **Diseño:** [DESIGN.md](../../../../DESIGN.md) — sistema de diseño Precision Focus (paleta, tipografía, espaciado, elevación, formas).
- **Arquitectura:** [ADR-002: Uso de Tailwind CSS](../../../adr/ADR-002-uso-de-tailwind-css.md).
- **Arquitectura:** [ADR-003: Uso de Base UI](../../../adr/ADR-003-uso-de-base-ui.md).
- **Arquitectura:** [ADR-005: Arquitectura del proyecto basada en features](../../../adr/ADR-005-arquitectura-feature-based.md).

## Archivos afectados

```text
exercise-time-tracker/
└── src/
    ├── app/
    │   └── tareas/
    │       └── ~ page.tsx                     # reemplaza el placeholder de US-000 por <PanelTareas />
    └── features/
        └── tareas/
            └── components/
                ├── + PanelTareas.tsx           # Bento Grid 12 col: fila 1 (432px) = WidgetTemporizador (col 1-8) + TarjetaEntradaManual (col 9-12); fila 2 (353px) = ListaTareas (col 1-12)
                ├── + ListaTareas.tsx           # listado "Tareas Recientes" con acción de iniciar temporizador (AC-006)
                ├── + TarjetaTarea.tsx          # item de Tarea: nombre, Proyecto, acción iniciar/detener temporizador
                ├── + ModalTarea.tsx            # modal único "Nueva Tarea"/"Editar Tarea" (modo controlado por prop)
                ├── + FormularioTarea.tsx       # campos "PROYECTO" (select) y "NOMBRE" (input), con errores de validación
                └── + WidgetTotalMensual.tsx    # presentacional: recibe el total mensual ya calculado (fuente: US-003)
```

## Plan de implementación

- [ ] **IT-01** — Crear `PanelTareas.tsx`: compone `ListaTareas`, `WidgetTemporizador` ([TK-005](./TK-005-temporizador.md)), `TarjetaEntradaManual` ([TK-006](./TK-006-registro-manual.md)), `WidgetMetaSemanal`/`WidgetTotalSemanal` ([TK-007](./TK-007-meta-y-total-semanal.md)) y `WidgetTotalMensual`, replicando la estructura exacta del prototipo Figma (nodo `1:1374`): sección superior con heading "Tareas" (32px/600, `#182442`, DESIGN.md `headline-lg`) y subtítulo "Has alcanzado el {porcentaje}% de tu meta semanal." (16px/400 `#45464e`, con el porcentaje en Inter Bold `#006c4b`/DESIGN.md `secondary`) a la izquierda, y `WidgetTotalSemanal`/`WidgetTotalMensual` a la derecha; debajo, un Bento Grid de 12 columnas con gap 24px: fila 1 (alto 432px) = `WidgetTemporizador` (col 1–8) + `TarjetaEntradaManual` (col 9–12); fila 2 (alto 353px) = `ListaTareas` "Tareas Recientes" (col 1–12, ancho completo).
- [ ] **IT-02** — Crear `ListaTareas.tsx` y `TarjetaTarea.tsx`, replicando el nodo `1:1452` ("Tareas Recientes"): cabecera con fondo `#f7f9fb`, borde inferior `#c6c6ce`, título "Tareas Recientes" (Inter Bold 16px `#182442`) y enlace "Ver Historial" (Inter Bold 14px `#182442`); cada `TarjetaTarea` (separadas por `border-top #c6c6ce`, excepto la primera) muestra a la izquierda un ícono cuadrado 40×40 (`rounded-sm` 2px, color de fondo variable — ejemplos observados: `primary-container` `#2e3a59`, `tertiary-container` `#2c3c51`, `secondary-container` `#64f9bc`), el nombre de la Tarea (Inter Bold 16px `#182442`) y el Proyecto (Inter Regular 14px `#45464e`); a la derecha, la duración acumulada (JetBrains Mono Medium 12px, tracking 0.6px, `#182442`, alineada a la derecha) y el estado/fecha relativa (Inter Regular 12px `#45464e`), seguidos del ícono ▷ para iniciar su temporizador (AC-006) mediante `useTemporizador().iniciar(tareaId)` ([TK-005](./TK-005-temporizador.md)), en un botón circular 40×40, o el control de detener cuando esa Tarea es la que tiene el temporizador activo.
- [ ] **IT-03** — Crear `ModalTarea.tsx` y `FormularioTarea.tsx`, replicando el nodo `1:1539`: overlay `rgba(25,28,30,0.4)` con blur 2px; caja del modal blanca, borde `#c6c6ce`, `rounded-lg` (8px), sombra elevada, ancho fijo 512px; header con borde inferior `#c6c6ce`, título "Nueva Tarea" (creación) o "Editar Tarea" (edición) (Inter Semibold 24px `#182442`, DESIGN.md `headline-md`) y botón de cerrar (×) a la derecha; formulario con gap 16px reutilizado en modo "crear" ([TK-001](./TK-001-crear-tarea.md)) y "editar" ([TK-003](./TK-003-editar-tarea.md)):
  - Campo "PROYECTO" (label uppercase JetBrains Mono Medium 12px tracking 0.6px `#45464e` opacidad 50%, DESIGN.md `label-meta`): select con placeholder exacto "Selecciona un proyecto" (Inter Regular 14px `#191c1e`, borde `#c6c6ce`, `rounded` 4px), poblado con `useProyectos()`.
  - Campo "NOMBRE" (misma label): input con placeholder exacto "¿En qué estás trabajando?" (Inter Regular 14px, color de placeholder `#6b7280`, mismo borde/`rounded`).
  - Mensajes de error de validación bajo cada campo.
  - Fila de acciones alineada a la derecha (gap 12px, pt 16px): botón "Cancelar" (borde `#c6c6ce`, texto `#182442` bold 16px, `rounded-sm` 2px) y botón primario con etiqueta condicionada al modo — "Crear Tarea" (creación, AC-001) / "Editar Tarea" (edición, AC-004) — (`bg #182442`, texto blanco bold 16px, `rounded-sm` 2px, con sombra).
- [ ] **IT-04** — Reemplazar el placeholder de `src/app/tareas/page.tsx` (US-000, AC-008) por `<PanelTareas />`, manteniendo el gate `useHasHydrated()` antes de renderizar datos del store.
- [ ] **IT-05** — Estilizar los componentes anteriores con Tailwind CSS siguiendo los tokens de DESIGN.md (colores, tipografía, espaciado, elevación, formas) y construir los elementos interactivos (modal, selector) sobre Base UI. Los valores hexadecimales del prototipo Figma (nodos `1:1374` y `1:1539`) coinciden 1:1 con tokens de DESIGN.md: `#182442`→`primary`, `#006c4b`→`secondary`, `#64f9bc`→`secondary-container`, `#ffdad6`/`#93000a`→`error-container`/`on-error-container`, `#f7f9fb`→`surface`, `#c6c6ce`→`outline-variant`, `#45464e`→`on-surface-variant`, texto 32px/600→`headline-lg`, 24px/600→`headline-md`, 12px JetBrains Mono→`label-meta`.
      Cubre AC-005 y AC-016; ver [TC-006](./test-cases/TC-006-diseno-pantalla-tareas-happy.md) y [TC-018](./test-cases/TC-018-fidelidad-visual-tareas-happy.md) — la verificación visual ya no depende solo de revisión manual no bloqueante, queda respaldada por las specs concretas de este TK.
- [ ] **IT-06** — Crear `WidgetTotalMensual.tsx` como componente presentacional puro que recibe el total ya calculado por props; no calcula ni importa el módulo de US-003 directamente desde este TK (ver Observaciones). Misma estructura visual que `WidgetTotalSemanal` ([TK-007](./TK-007-meta-y-total-semanal.md)): tarjeta blanca (`border #c6c6ce`, `rounded-sm` 2px, sombra, min-width 160px, padding 17px), label "TOTAL MENSUAL" (uppercase, JetBrains Mono Medium 12px tracking 0.6px, opacidad 50%, `#45464e`) y valor (Inter Bold 24px `#182442`, formato `{h}h {m}m`, p. ej. "128h 12m").
- [ ] **IT-07** — Componer `TarjetaEntradaManual` ([TK-006](./TK-006-registro-manual.md)) dentro de `PanelTareas`, en la columna 9–12 de la fila 1 del Bento Grid (junto a `WidgetTemporizador`), tal como se ve siempre visible en el prototipo Figma — no es un modal disparado por una acción.

## Observaciones

- El widget "Total Mensual" del prototipo reutiliza el cálculo de total por mes de [US-003 (Historial de registros)](../US-003-historial-de-registros/README.md), AC-004 (ver Observaciones del [README de US-002](./README.md)). Esta tarea entrega `WidgetTotalMensual.tsx` como componente presentacional puro (recibe el valor por props); cablear su fuente de datos real al selector que exponga US-003 es un paso de integración posterior y no bloquea el resto del alcance de este TK.
- Acceso confirmado al prototipo Figma vía MCP (`fileKey: K6uQLWg82KsCSpHJVXSf6L`, nodo `1:1374` pantalla Tareas y nodo `1:1539` modal Nueva Tarea). Las specs concretas (colores, tipografía, espaciado, estructura) quedaron incorporadas en el Plan de implementación de este TK.
- Corrección respecto a la redacción original de este TK (escrita sin acceso a Figma): el prototipo NO muestra la "Entrada Manual" como un modal disparado por una acción explícita, sino como una tarjeta ("Entrada Manual") compuesta directamente en el Bento Grid del panel principal, junto a la Tarjeta de Actividad Actual (temporizador). Se corrigió el nombre del componente de `ModalRegistroManual.tsx` a `TarjetaEntradaManual.tsx` (ver Dependencias, Archivos afectados y [TK-006](./TK-006-registro-manual.md)); el alcance funcional de AC-013/AC-014/AC-015 no cambia.
- Corrección adicional: la "Meta Semanal" del prototipo no es una tarjeta numérica independiente — se expresa como el texto inline "Has alcanzado el {porcentaje}% de tu meta semanal." junto al heading "Tareas" (`WidgetMetaSemanal.tsx`, [TK-007](./TK-007-meta-y-total-semanal.md)). Las tarjetas numéricas visibles en la esquina superior derecha son "TOTAL SEMANAL" y "TOTAL MENSUAL".
