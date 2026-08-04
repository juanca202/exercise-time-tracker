## Why

El panel principal de Time Tracker ("Tareas") combina tres capacidades que el usuario necesita para llevar un registro completo de su trabajo: crear y mantener al día sus Tareas, registrar tiempo en tiempo real con un temporizador, y registrar tiempo de forma diferida cuando no usó el temporizador. Estas tres capacidades se agruparon intencionalmente en una sola historia de negocio (US-003) porque el wireframe las presenta como un único panel, pero se modelan aquí como tres capabilities independientes para mantener sus contratos de especificación separados.

## What Changes

- Se permite crear una Tarea asociada obligatoriamente a un Proyecto existente.
- Se permite editar el Nombre de una Tarea y/o reasignarla a otro Proyecto existente.
- Se permite eliminar una Tarea que no tenga Registros de Tiempo asociados; se bloquea la eliminación si los tiene.
- Se permite iniciar y detener un temporizador para una Tarea específica; solo puede haber un (1) temporizador activo en toda la aplicación — iniciar uno nuevo detiene y persiste automáticamente el anterior.
- Se permite crear un Registro de Tiempo manual para una Tarea, indicando Fecha y Duración, validando que la Duración sea mayor que cero.

## Capabilities

### New Capabilities

- `task-management`: ciclo de vida de una Tarea (crear, editar con reasignación de Proyecto, eliminar con regla de bloqueo, listar).
- `timer-tracking`: temporizador en tiempo real con la restricción de unicidad global y detención automática del temporizador anterior.
- `manual-time-entry`: registro manual de tiempo (Tarea, Fecha, Duración) con validación de duración positiva.

### Modified Capabilities

_Ninguna. `task-management` depende de `project-management` (change `gestion-de-proyectos`) para validar que el Proyecto exista, pero no modifica sus requisitos._

## Impacto

- Repositorio: `exercise-time-tracker` (monorepo, Next.js App Router).
- Persistencia: `localStorage` (ADR-011). Modelo de datos y flujos documentados en [technical-docs/timetracker.md](../../../docs/specs/technical-docs/timetracker.md): `MD-02` (Tarea), `MD-03` (Registro de Tiempo), `FL-01`/`FL-02` (temporizador), `FL-03` (registro manual), `FL-07`/`FL-08` (editar/eliminar Tarea), `DG-01` (diagrama de estados del temporizador).
- Depende de `project-management` (Proyectos existentes) y del shell de `layout-de-la-aplicacion`.
- Fuente funcional: [US-003 — Gestión de Tareas y Registro de Tiempo](../../../docs/specs/user-stories/US-003-gestion-de-tareas-y-registro-de-tiempo/README.md), derivada de [SRS-001](../../../docs/specs/requirements/SRS-001-timetracker-app/README.md) (RF-003 a RF-013, RIU-002, RIU-004, RD-003, RP-001, RP-002).
- Investigación relacionada: [RS-001 — Decisiones técnicas pendientes de Gestión de Tareas y Registro de Tiempo](../../../docs/specs/user-stories/US-003-gestion-de-tareas-y-registro-de-tiempo/research/RS-001-decisiones-tecnicas-pendientes/README.md) (unidad de Duración en segundos, fecha del temporizador que cruza medianoche, casos borde de reinicio/duración≤0, mensajes de bloqueo/validación).
