# TK-001: Crear/editar Tarea, temporizador y registro manual de tiempo

**Estado**: Ready
**Historia**: [US-002](./README.md)
**Repositorio**: exercise-time-tracker
**Asignado a**: juanca202

## Descripción

Implementar la creación de una Tarea asociada obligatoriamente a un Proyecto existente y con un Nombre no vacío, rechazando la creación (con el motivo del rechazo) cuando falte el Proyecto o el Nombre; permitir editar el Nombre de una Tarea existente en cualquier momento, validando el Nombre editado con la misma regla usada al crear (BR-01); implementar el control del temporizador de una Tarea (iniciar, detener, auto-stop al cambiar de Tarea con un temporizador ya activo, con un único temporizador activo a la vez en toda la aplicación); y permitir crear un Registro de Tiempo manual para una Tarea (Tarea, Fecha y Duración), validando que la Duración sea mayor que cero en ambos flujos (temporizador y manual) — delegando en todos los casos la persistencia en el store raíz compartido (ver [TK-002: Persistencia de Tarea](TK-002-persistencia-tarea.md)).

## Dependencias

- [TK-001: Dominio, persistencia local, store raíz y helper de fecha compartidos (US-000)](../US-000-fundamentos/TK-001-dominio-persistencia-store-y-fecha.md) — tipos `Project`, `Task`, `TimeEntry`, `ActiveTimer`; `useAppStore` expone `createTask`, `updateTask`, `createTimeEntry`, `useProjects()`, `useTasks()` (CRUD crudo, sin validación propia); `useHasHydrated()` para gatear toda lectura de estado persistido; `PersistenceAdapter<T>` y `createLocalStorageAdapter` para el store dedicado del temporizador.

## Referencias

- **Arquitectura:** [ADR-004: Uso de Zustand para manejo de estado](../../../adr/ADR-004-uso-de-zustand.md) — el store compartido consumido (`useAppStore`) es Zustand; justifica también el store adicional dedicado al Temporizador Activo. [ADR-005: Arquitectura del proyecto basada en features](../../../adr/ADR-005-arquitectura-feature-based.md) — ubicación del código nuevo en `src/features/tareas/`. [ADR-012: Separación entre el store raíz (CRUD crudo) y stores de feature (estado de negocio)](../../../adr/ADR-012-separacion-store-raiz-y-stores-de-feature.md) — formaliza la decisión de IT-07: la máquina de estados del Temporizador Activo es estado de negocio propio de esta feature y por eso vive en un store dedicado, no en el store raíz. Reforzado por la fitness function de ese ADR.
- **Diseño:** [Figma - Exercise · Time Tracker (modal Nueva Tarea, reutilizado en modo edición)](https://www.figma.com/design/YYHDIH7CBsZrZ4VKXvbzkR/Exercise---Time-Tracker) — el prototipo no incluye un modal específico de "Editar Tarea"; por decisión del usuario (ver [Observaciones de la US](./README.md#observaciones)), se reutiliza este mismo prototipo, integrado en [TK-003: UI de la pantalla de Tareas y meta/total semanal](TK-003-ui-pantalla-tareas-y-meta-semanal.md). [Figma - Exercise · Time Tracker (estado del temporizador en el panel principal)](https://www.figma.com/design/YYHDIH7CBsZrZ4VKXvbzkR/Exercise---Time-Tracker) y [Figma - Exercise · Time Tracker (registro manual de tiempo)](https://www.figma.com/design/YYHDIH7CBsZrZ4VKXvbzkR/Exercise---Time-Tracker) — tarjeta "Entrada Manual" en el nodo `1:1374` (Bento Grid, columna 9–12 de la fila 1), compuesta por [TK-003](TK-003-ui-pantalla-tareas-y-meta-semanal.md).

## Archivos afectados

```text
exercise-time-tracker/
└── src/
    └── features/
        └── tareas/
            ├── domain/
            │   ├── + validate-task.ts               # valida Proyecto existente y Nombre no vacío (BR-01, AC-001, AC-002)
            │   ├── + validate-duration.ts            # valida que una Duración (minutos) sea > 0 (BR-04)
            │   └── + calculate-duration-minutes.ts   # calcula minutos enteros entre Hora Inicio y Hora Fin
            ├── store/
            │   └── + timer-store.ts                  # store Zustand dedicado y persistido para ActiveTimer (Decisión técnica, IT-07)
            ├── hooks/
            │   ├── + use-create-task.ts              # crea una Tarea validada delegando en useAppStore().createTask
            │   ├── + use-edit-task.ts                # precarga datos, valida y actualiza el Nombre de una Tarea existente
            │   ├── + use-timer.ts                     # expone activeTimer, start(taskId), stop()
            │   └── + use-manual-entry.ts             # valida y crea un TimeEntry con source "manual"
            └── components/
                ├── + timer-widget.tsx                  # UI: estado activo/inactivo y Tarea asociada (AC-011)
                └── + manual-entry-card.tsx             # tarjeta "Entrada Manual": campos FECHA, PROYECTO / TAREA, DURACIÓN
```

## Plan de implementación

- [ ] **IT-01** — Crear `validate-task.ts` con una función pura `validateTask({ projectId, name }, existingProjects)` que retorna un resultado de validación (válido/inválido + motivo).
      Verifica que `projectId` corresponda a un Proyecto existente en `existingProjects` y que `name` no esté vacío tras `trim()`. Cubre AC-001 (happy path) y AC-002 (rechazo sin Proyecto o sin Nombre); ver [TC-001](./test-cases/TC-001-crear-tarea-happy.md), [TC-002](./test-cases/TC-002-crear-tarea-sin-proyecto-error.md), [TC-003](./test-cases/TC-003-crear-tarea-sin-nombre-error.md).
- [ ] **IT-02** — Crear `use-create-task.ts`: hook que lee `useProjects()` (US-000) tras pasar el gate `useHasHydrated()`, ejecuta `validateTask`, y si el resultado es válido invoca `useAppStore().createTask({ projectId, name })`.
      Si el resultado es inválido, retorna el motivo de rechazo sin llamar al store.
- [ ] **IT-03** — Exponer desde `useCreateTask` el estado de error (motivo de rechazo) para que [TK-003](./TK-003-ui-pantalla-tareas-y-meta-semanal.md) lo muestre en el modal "Nueva Tarea".
- [ ] **IT-04** — Crear `use-edit-task.ts`: hook que recibe una `Task` existente, reutiliza `validateTask({ projectId: task.projectId, name })` (IT-01) validando solo el nuevo Nombre, y si es válido invoca `useAppStore().updateTask(task.id, { name })`.
      Cubre AC-004; ver [TC-005](./test-cases/TC-005-editar-nombre-tarea-happy.md).
- [ ] **IT-05** — Definir en el hook el modo de precarga: recibe la `Task` a editar y retorna sus valores iniciales (`projectId`, `name`) para inicializar `TaskModal`/`TaskForm` ([TK-003](./TK-003-ui-pantalla-tareas-y-meta-semanal.md)) en modo edición.
- [ ] **IT-06** — Exponer un indicador de modo (`mode: "create" | "edit"`) que `TaskModal` ([TK-003](./TK-003-ui-pantalla-tareas-y-meta-semanal.md)) usa para cambiar el título del modal y la etiqueta del botón principal a "Editar Tarea".
- [ ] **IT-07** — Decisión técnica: persistencia del Temporizador Activo. Crear `timer-store.ts` como store Zustand dedicado a esta feature (no una extensión de `src/shared/store/app-store.ts`), persistido mediante un `PersistenceAdapter<ActiveTimer | null>` propio construido con `createLocalStorageAdapter` (US-000), y gateado por `useHasHydrated()` antes de leerse.
      Se decide un store dedicado — en vez de ampliar el store compartido — porque BR-01 de US-000 exige que el store raíz exponga únicamente CRUD crudo sin lógica propia de cada historia funcional, y porque AC-010 de US-000 exige que ninguna historia funcional necesite modificar el store compartido para agregar su propia lógica; la máquina de estados de esta tarea (exclusividad, auto-stop) es lógica de negocio propia de US-002. Decisión formalizada en [ADR-012](../../../adr/ADR-012-separacion-store-raiz-y-stores-de-feature.md).
- [ ] **IT-08** — Definir en `use-timer.ts` (sobre `timer-store.ts`) los dos estados y sus transiciones:
      Estado `Inactive` (`activeTimer === null`) y estado `Active(taskId)` (`activeTimer = { taskId, start }`). `start(taskId)` desde `Inactive` escribe `{ taskId, start: new Date().toISOString() }` y pasa a `Active(taskId)` (AC-006, [TC-007](./test-cases/TC-007-iniciar-temporizador-happy.md)).
- [ ] **IT-09** — Implementar la transición de auto-stop: `start(taskId')` desde `Active(taskId)` con `taskId' !== taskId` ejecuta primero la transición de `stop()` (IT-10) sobre el temporizador anterior y, solo si se completa, inicia el nuevo con `taskId'` (BR-03/AC-007, [TC-008](./test-cases/TC-008-auto-stop-temporizador-happy.md)).
      `start(taskId)` desde `Active(taskId)` con la misma Tarea no se contempla en este alcance: [TK-003](./TK-003-ui-pantalla-tareas-y-meta-semanal.md) no expone la acción de iniciar sobre la Tarea que ya tiene el temporizador activo, sino la acción de detener.
- [ ] **IT-10** — Implementar la transición `stop()`: calcula `durationMinutes` con `calculate-duration-minutes.ts` (Hora Fin − Hora Inicio, redondeado a minutos enteros), valida con `validate-duration.ts` que sea mayor que cero (AC-009/BR-04, [TC-010](./test-cases/TC-010-duracion-cero-al-detener-limite.md)).
      Si es válida: invoca `useAppStore().createTimeEntry({ taskId, date, durationMinutes, source: "timer" })` (persistencia inmediata, AC-008/AC-010, [TC-009](./test-cases/TC-009-detener-temporizador-happy.md), [TC-011](./test-cases/TC-011-persistencia-registro-temporizador-happy.md)) y limpia `timer-store.ts` a `null`. Si no es válida: no persiste el Registro de Tiempo y mantiene el estado `Active` sin cambios.
- [ ] **IT-11** — Crear `timer-widget.tsx`: muestra de forma visible el estado (activo/inactivo) y la Tarea asociada (`useTasks()` para resolver el nombre), replicando la "Current Activity Card" del nodo `1:1374` (`1:1394`–`1:1412`): tarjeta blanca (`border #c6c6ce`, `rounded-sm` 2px, sombra, contenido centrado, padding 33px) que en estado Activo muestra: la fase/nombre del Proyecto en mayúsculas (JetBrains Mono Medium 12px tracking 0.6px `#006c4b`/DESIGN.md `secondary`), el nombre de la Tarea como título (Inter Semibold 32px `#182442`, DESIGN.md `headline-lg`), el texto "Iniciado a las {hora} {AM|PM}" (Inter Regular 16px `#45464e`) con ícono de reloj, el cronómetro en formato `HH:MM:SS` (JetBrains Mono Medium 64px, tracking -3.2px, `#182442`, leading 96px), y el botón "Detener Sesión" (`bg #ffdad6`/DESIGN.md `error-container`, texto `#93000a`/DESIGN.md `on-error-container` bold 16px, `rounded-sm` 2px, px32 py12, con ícono cuadrado).
      Cubre AC-011; ver [TC-012](./test-cases/TC-012-estado-temporizador-visible-happy.md). Compuesto dentro de `tasks-panel.tsx` por [TK-003](TK-003-ui-pantalla-tareas-y-meta-semanal.md).
- [ ] **IT-12** — Verificar que `start()` y `stop()` son operaciones síncronas de escritura local (Zustand + `localStorage`, sin llamadas de red ni operaciones asíncronas en la ruta crítica), de modo que ambas se completen en menos de 1 segundo desde la acción del usuario (AC-012, [TC-013](./test-cases/TC-013-rendimiento-temporizador-happy.md)) por construcción.
- [ ] **IT-13** — Crear `use-manual-entry.ts`: hook que recibe `{ taskId, date, durationMinutes }`, valida `durationMinutes` con `validate-duration.ts` (IT-10) y, si es válida, invoca `useAppStore().createTimeEntry({ taskId, date, durationMinutes, source: "manual" })`.
      Cubre AC-013 y AC-015; ver [TC-014](./test-cases/TC-014-registro-manual-happy.md) y [TC-017](./test-cases/TC-017-persistencia-registro-manual-happy.md). Si la Duración no es válida, retorna el motivo de rechazo sin crear el registro (AC-014, [TC-015](./test-cases/TC-015-duracion-manual-invalida-error.md), [TC-016](./test-cases/TC-016-duracion-manual-minima-limite.md)).
- [ ] **IT-14** — Crear `manual-entry-card.tsx`: tarjeta blanca (`border #c6c6ce`, `rounded-sm` 2px, sombra, padding 25px) con heading "Entrada Manual" (Inter Semibold 24px `#182442`, DESIGN.md `headline-md`) y formulario con gap 20px entre campos, replicando el nodo `1:1374`:
  - Campo "FECHA" (label uppercase JetBrains Mono Medium 12px tracking 0.6px opacidad 50% `#45464e`, DESIGN.md `label-meta`): input con formato `DD/MM/AAAA` e ícono de calendario, borde `#c6c6ce`, `rounded` 4px.
  - Campo "PROYECTO / TAREA" (misma label): selector de Tarea (`useTasks()`) con el mismo estilo de borde/`rounded` que el campo Fecha.
  - Campo "DURACIÓN" (misma label): input de texto en formato `HH:MM`, mismo borde/`rounded`.
  - Botón "Guardar Registro" (`bg #182442`, texto blanco bold 16px, `rounded-md` 8px, con sombra, ancho completo).
    Muestra el mensaje de error de `useManualEntry` cuando la Duración no sea válida. Compuesta dentro de `tasks-panel.tsx`, en la columna 9–12 de la fila 1 del Bento Grid, por [TK-003](TK-003-ui-pantalla-tareas-y-meta-semanal.md).

## Observaciones

Sin pendientes documentados. La decisión de dónde y cómo persistir el Temporizador Activo (IT-07) queda resuelta y documentada en este TK.

- Acceso confirmado al prototipo Figma vía MCP (`fileKey: K6uQLWg82KsCSpHJVXSf6L`, nodo `1:1374`); las specs visuales de la "Current Activity Card" (IT-11) quedaron incorporadas en el Plan de implementación.
- Corrección respecto a la redacción original de la antigua tarea de registro manual (escrita sin acceso a Figma): el prototipo (nodo `1:1374`) muestra "Entrada Manual" como una tarjeta siempre visible en el Bento Grid del panel principal, no como un modal disparado por una acción explícita. Se renombró el componente de `ModalRegistroManual.tsx` a `manual-entry-card.tsx`; el alcance funcional (AC-013/AC-014/AC-015: Tarea, Fecha, Duración, validación > 0, persistencia con origen `"manual"`) no cambia.
