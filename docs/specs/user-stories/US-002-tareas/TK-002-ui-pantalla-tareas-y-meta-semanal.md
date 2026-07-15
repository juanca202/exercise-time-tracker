# TK-002: UI de la pantalla de Tareas, modal y meta/total semanal

**Estado**: Ready
**Historia**: [US-002](./README.md)
**Repositorio**: exercise-time-tracker
**Asignado a**: juanca202

## Descripción

Implementar la pantalla de Tareas (panel principal: listado de Tareas Recientes con acción para iniciar el temporizador, estado del temporizador activo, Meta Semanal, Total Semanal y Total Mensual) y el modal único "Nueva Tarea"/"Editar Tarea", reemplazando el placeholder de la ruta `/tareas` (US-000, AC-008) por la pantalla real, adherida al sistema de diseño DESIGN.md (tema Precision Focus) y visualmente fiel al prototipo de alta fidelidad en Figma referenciado; y calcular la Meta Semanal como un valor fijo de 40 horas (8 h × 5 días laborales, no configurable por el usuario), calcular y mostrar el Total Semanal sumando los Registros de Tiempo (por temporizador y manuales) generados durante la semana laboral en curso (Lunes a Viernes, hora local, excluyendo Sábado y Domingo), y mostrar el porcentaje alcanzado de la Meta Semanal ((Total Semanal ÷ Meta Semanal) × 100).

## Dependencias

- `src/shared/layout/` — `AppShell`, `SidebarNav` (US-000); resuelven la ruta `/tareas` con un placeholder que esta tarea reemplaza.
- [TK-002: Layout, navegación, tema de Tailwind y rutas placeholder (US-000)](../US-000-fundamentos/TK-002-layout-navegacion-y-rutas-placeholder.md) — tokens Tailwind (`@theme` en `src/app/globals.css`, IT-01 de ese TK) del tema "Precision Focus"; esta tarea los consume, no los redefine.
- `src/shared/store/app-store.ts` — `useTasks()`, `useProjects()`, `useTimeEntries()`.
- `src/shared/persistence/` — `useHasHydrated()`.
- [TK-001: Crear/editar Tarea, temporizador y registro manual de tiempo](TK-001-crear-editar-tarea-temporizador-y-registro-manual.md) — `use-create-task.ts` y `use-edit-task.ts` (lógica que `TaskModal`/`TaskForm` invocan), `timer-widget.tsx` y `use-timer.ts` (compuestos dentro de `TasksPanel`; `TaskList`/`TaskCard` los usan para alternar entre la acción de iniciar (▷) y la de detener según la Tarea con el temporizador activo), y `manual-entry-card.tsx` (tarjeta "Entrada Manual" compuesta directamente en el Bento Grid del panel principal).
- [TK-001: Dominio, persistencia local, store raíz y helper de fecha compartidos (US-000)](../US-000-fundamentos/TK-001-dominio-persistencia-store-y-fecha.md) — contrato `MonthTotal` y función `calculateTotalByMonth` (`src/shared/reports/`) para el "Total Mensual" — consumidos directamente desde el módulo compartido, sin depender de `features/historial/` (ADR-005).

## Referencias

- **Diseño:** [Figma - Exercise · Time Tracker (pantalla Tareas y modal Nueva Tarea)](https://www.figma.com/design/YYHDIH7CBsZrZ4VKXvbzkR/Exercise---Time-Tracker) — nodo `1:1374` (pantalla Tareas, sección "Welcome Summary Section") y nodo `1:1539` (modal Nueva Tarea).
- **Diseño:** [DESIGN.md](../../../../DESIGN.md) — sistema de diseño Precision Focus (paleta, tipografía, espaciado, elevación, formas).
- **Investigación:** [RS-001: Inicio de la semana en curso para el cálculo del Total Semanal](./research/RS-001-inicio-semana-total-semanal.md) — fija Lunes como inicio de la semana laboral y el rango Lunes-Viernes para el Total Semanal, consistente con la Meta Semanal (BR-05).
- **Arquitectura:** [ADR-002: Uso de Tailwind CSS](../../../adr/ADR-002-uso-de-tailwind-css.md), [ADR-003: Uso de Base UI](../../../adr/ADR-003-uso-de-base-ui.md), [ADR-005: Arquitectura del proyecto basada en features](../../../adr/ADR-005-arquitectura-feature-based.md).

## Archivos afectados

```text
exercise-time-tracker/
└── src/
    ├── app/
    │   └── tareas/
    │       └── ~ page.tsx                     # reemplaza el placeholder de US-000 por <TasksPanel />
    └── features/
        └── tareas/
            ├── domain/
            │   ├── + calculate-work-week-range.ts      # obtiene el Lunes 00:00:00 y el Viernes 23:59:59 de la semana de una fecha (RS-001)
            │   └── + calculate-weekly-total-minutes.ts  # suma la duración de los Registros de Tiempo dentro del rango Lunes-Viernes
            ├── hooks/
            │   └── + use-weekly-goal-and-total.ts       # expone weeklyGoalMinutes (constante), weeklyTotalMinutes, percentage
            └── components/
                ├── + tasks-panel.tsx           # Bento Grid 12 col: fila 1 (432px) = TimerWidget (col 1-8) + ManualEntryCard (col 9-12); fila 2 (353px) = TaskList (col 1-12)
                ├── + task-list.tsx             # listado "Tareas Recientes" con acción de iniciar temporizador (AC-006)
                ├── + task-card.tsx             # item de Tarea: nombre, Proyecto, acción iniciar/detener temporizador
                ├── + task-modal.tsx            # modal único "Nueva Tarea"/"Editar Tarea" (modo controlado por prop)
                ├── + task-form.tsx             # campos "PROYECTO" (select) y "NOMBRE" (input), con errores de validación
                ├── + monthly-total-widget.tsx  # calcula calculateTotalByMonth (US-000 TK-001) sobre el mes en curso y lo muestra
                ├── + weekly-goal-widget.tsx    # muestra el porcentaje alcanzado de la Meta Semanal
                └── + weekly-total-widget.tsx    # muestra el Total Semanal acumulado
```

## Plan de implementación

- [ ] **IT-01** — Crear `calculate-work-week-range.ts`: función pura que, dada una fecha de referencia, retorna el Lunes 00:00:00 y el Viernes 23:59:59 (hora local) de esa semana, como constante fija en código — sin `Intl.Locale` ni librerías de fecha adicionales — siguiendo la recomendación de [RS-001](./research/RS-001-inicio-semana-total-semanal.md).
- [ ] **IT-02** — Crear `calculate-weekly-total-minutes.ts`: función pura que, dado el arreglo de `TimeEntry` (`useTimeEntries()`) y el rango de `calculate-work-week-range.ts` (IT-01), suma `durationMinutes` de los registros cuya `date` cae dentro del rango (inclusive), excluyendo explícitamente los de Sábado y Domingo.
      Cubre AC-018; ver [TC-020](./test-cases/TC-020-total-semanal-happy.md), [TC-021](./test-cases/TC-021-total-semanal-excluye-semana-anterior-limite.md) y [TC-024](./test-cases/TC-024-total-semanal-excluye-fin-de-semana-limite.md).
- [ ] **IT-03** — Definir en `use-weekly-goal-and-total.ts` la constante `WEEKLY_GOAL_MINUTES = 8 * 60 * 5` (= 2400, no configurable) y calcular `percentage = (weeklyTotalMinutes / WEEKLY_GOAL_MINUTES) * 100`, sin acotar el valor superior a 100.
      Cubre AC-017 ([TC-019](./test-cases/TC-019-meta-semanal-fija-happy.md)) y AC-019 ([TC-022](./test-cases/TC-022-porcentaje-meta-semanal-happy.md), [TC-023](./test-cases/TC-023-porcentaje-meta-semanal-superior-100-limite.md) para el caso de superar el 100%).
- [ ] **IT-04** — Crear `weekly-goal-widget.tsx` y `weekly-total-widget.tsx`, componentes presentacionales que consumen `useWeeklyGoalAndTotal()` (IT-03), replicando la estructura exacta del nodo `1:1374`:
  - `weekly-goal-widget.tsx`: no es una tarjeta separada — se renderiza como el texto inline junto al heading "Tareas": "Has alcanzado el **{porcentaje}%** de tu meta semanal." (Inter Regular 16px `#45464e`, con `{porcentaje}%` en Inter Bold 16px `#006c4b`/DESIGN.md `secondary`).
  - `weekly-total-widget.tsx`: tarjeta blanca (`border #c6c6ce`, `rounded-sm` 2px, sombra, min-width 160px, padding 17px) con label "TOTAL SEMANAL" (uppercase, JetBrains Mono Medium 12px tracking 0.6px, opacidad 50%, `#45464e`, DESIGN.md `label-meta`) y valor (Inter Bold 24px `#182442`, formato `{h}h {m}m`, p. ej. "32h 45m").
- [ ] **IT-05** — Crear `task-list.tsx` y `task-card.tsx`, replicando el nodo `1:1452` ("Tareas Recientes"): cabecera con fondo `#f7f9fb`, borde inferior `#c6c6ce`, título "Tareas Recientes" (Inter Bold 16px `#182442`) y enlace "Ver Historial" (Inter Bold 14px `#182442`); cada `TaskCard` (separadas por `border-top #c6c6ce`, excepto la primera) muestra a la izquierda un ícono cuadrado 40×40 (`rounded-sm` 2px, color de fondo variable — ejemplos observados: `primary-container` `#2e3a59`, `tertiary-container` `#2c3c51`, `secondary-container` `#64f9bc`), el nombre de la Tarea (Inter Bold 16px `#182442`) y el Proyecto (Inter Regular 14px `#45464e`); a la derecha, la duración acumulada (JetBrains Mono Medium 12px, tracking 0.6px, `#182442`, alineada a la derecha) y el estado/fecha relativa (Inter Regular 12px `#45464e`), seguidos del ícono ▷ para iniciar su temporizador (AC-006) mediante `useTimer().start(taskId)` ([TK-001](./TK-001-crear-editar-tarea-temporizador-y-registro-manual.md)), en un botón circular 40×40, o el control de detener cuando esa Tarea es la que tiene el temporizador activo.
- [ ] **IT-06** — Crear `task-modal.tsx` y `task-form.tsx`, replicando el nodo `1:1539`: overlay `rgba(25,28,30,0.4)` con blur 2px; caja del modal blanca, borde `#c6c6ce`, `rounded-lg` (8px), sombra elevada, ancho fijo 512px; header con borde inferior `#c6c6ce`, título "Nueva Tarea" (creación) o "Editar Tarea" (edición) (Inter Semibold 24px `#182442`, DESIGN.md `headline-md`) y botón de cerrar (×) a la derecha; formulario con gap 16px reutilizado en modo "crear" y "editar" (`use-create-task.ts`/`use-edit-task.ts`, [TK-001](./TK-001-crear-editar-tarea-temporizador-y-registro-manual.md)):
  - Campo "PROYECTO" (label uppercase JetBrains Mono Medium 12px tracking 0.6px `#45464e` opacidad 50%, DESIGN.md `label-meta`): select con placeholder exacto "Selecciona un proyecto" (Inter Regular 14px `#191c1e`, borde `#c6c6ce`, `rounded` 4px), poblado con `useProjects()`.
  - Campo "NOMBRE" (misma label): input con placeholder exacto "¿En qué estás trabajando?" (Inter Regular 14px, color de placeholder `#6b7280`, mismo borde/`rounded`).
  - Mensajes de error de validación bajo cada campo.
  - Fila de acciones alineada a la derecha (gap 12px, pt 16px): botón "Cancelar" (borde `#c6c6ce`, texto `#182442` bold 16px, `rounded-sm` 2px) y botón primario con etiqueta condicionada al modo — "Crear Tarea" (creación, AC-001) / "Editar Tarea" (edición, AC-004) — (`bg #182442`, texto blanco bold 16px, `rounded-sm` 2px, con sombra).
- [ ] **IT-07** — Crear `monthly-total-widget.tsx`: calcula `calculateTotalByMonth(useTimeEntries())` (`src/shared/reports/`, US-000 TK-001) y muestra el `totalMinutes` del `MonthTotal` cuyo `month` coincide con el mes calendario actual (`0` si no hay ninguna entrada para ese mes). Misma estructura visual que `weekly-total-widget.tsx` (IT-04): tarjeta blanca (`border #c6c6ce`, `rounded-sm` 2px, sombra, min-width 160px, padding 17px), label "TOTAL MENSUAL" (uppercase, JetBrains Mono Medium 12px tracking 0.6px, opacidad 50%, `#45464e`) y valor (Inter Bold 24px `#182442`, formato `{h}h {m}m`, p. ej. "128h 12m").
- [ ] **IT-08** — Crear `tasks-panel.tsx`: compone `TaskList` (IT-05), `TimerWidget` ([TK-001](./TK-001-crear-editar-tarea-temporizador-y-registro-manual.md)), `ManualEntryCard` ([TK-001](./TK-001-crear-editar-tarea-temporizador-y-registro-manual.md)), `WeeklyGoalWidget`/`WeeklyTotalWidget` (IT-04) y `MonthlyTotalWidget` (IT-07), replicando la estructura exacta del prototipo Figma (nodo `1:1374`): sección superior con heading "Tareas" (32px/600, `#182442`, DESIGN.md `headline-lg`) y subtítulo "Has alcanzado el {porcentaje}% de tu meta semanal." (16px/400 `#45464e`, con el porcentaje en Inter Bold `#006c4b`/DESIGN.md `secondary`) a la izquierda, y `WeeklyTotalWidget`/`MonthlyTotalWidget` a la derecha; debajo, un Bento Grid de 12 columnas con gap 24px: fila 1 (alto 432px) = `TimerWidget` (col 1–8) + `ManualEntryCard` (col 9–12, siempre visible, no requiere una acción que la abra); fila 2 (alto 353px) = `TaskList` "Tareas Recientes" (col 1–12, ancho completo).
- [ ] **IT-09** — Reemplazar el placeholder de `src/app/tareas/page.tsx` (US-000, AC-008) por `<TasksPanel />`, manteniendo el gate `useHasHydrated()` antes de renderizar datos del store.
- [ ] **IT-10** — Estilizar los componentes anteriores con Tailwind CSS siguiendo los tokens de DESIGN.md (colores, tipografía, espaciado, elevación, formas) y construir los elementos interactivos (modal, selector) sobre Base UI. Los valores hexadecimales del prototipo Figma (nodos `1:1374` y `1:1539`) coinciden 1:1 con tokens de DESIGN.md: `#182442`→`primary`, `#006c4b`→`secondary`, `#64f9bc`→`secondary-container`, `#ffdad6`/`#93000a`→`error-container`/`on-error-container`, `#f7f9fb`→`surface`, `#c6c6ce`→`outline-variant`, `#45464e`→`on-surface-variant`, texto 32px/600→`headline-lg`, 24px/600→`headline-md`, 12px JetBrains Mono→`label-meta`.
      Cubre AC-005 y AC-016; ver [TC-006](./test-cases/TC-006-diseno-pantalla-tareas-happy.md) y [TC-018](./test-cases/TC-018-fidelidad-visual-tareas-happy.md) — la verificación visual ya no depende solo de revisión manual no bloqueante, queda respaldada por las specs concretas de este TK.

## Observaciones

- El widget "Total Mensual" del prototipo reutiliza la misma regla de cálculo que consume [US-003 (Historial de registros)](../US-003-historial-de-registros/README.md), AC-004. Para no duplicarla ni acoplar esta historia a `features/historial/` (ADR-005), `calculateTotalByMonth` vive en el módulo compartido de [US-000 (Fundamentos)](../US-000-fundamentos/README.md); `monthly-total-widget.tsx` (IT-07) la consume directamente desde ahí, sin depender de que US-003 esté implementada.
- Acceso confirmado al prototipo Figma vía MCP (`fileKey: K6uQLWg82KsCSpHJVXSf6L`, nodo `1:1374` pantalla Tareas y nodo `1:1539` modal Nueva Tarea). Las specs concretas (colores, tipografía, espaciado, estructura) quedaron incorporadas en el Plan de implementación de este TK.
- Corrección respecto a la redacción original de la antigua tarea de UI (escrita sin acceso a Figma): el prototipo NO muestra la "Entrada Manual" como un modal disparado por una acción explícita, sino como una tarjeta ("Entrada Manual") compuesta directamente en el Bento Grid del panel principal, junto a la Tarjeta de Actividad Actual (temporizador); ver [TK-001](./TK-001-crear-editar-tarea-temporizador-y-registro-manual.md).
- Corrección adicional: la "Meta Semanal" del prototipo no es una tarjeta numérica independiente — se expresa como el texto inline "Has alcanzado el {porcentaje}% de tu meta semanal." junto al heading "Tareas" (`weekly-goal-widget.tsx`, IT-04). Las tarjetas numéricas visibles en la esquina superior derecha son "TOTAL SEMANAL" y "TOTAL MENSUAL".
- El prototipo Figma no muestra la Meta Semanal como una tarjeta numérica independiente: el porcentaje se expresa como texto inline junto al heading "Tareas" (`weekly-goal-widget.tsx`), mientras que "TOTAL SEMANAL" sí es una tarjeta con valor `{h}h {m}m` (`weekly-total-widget.tsx`). Esto no cambia el alcance de AC-017/AC-018/AC-019, solo precisa su forma visual.
