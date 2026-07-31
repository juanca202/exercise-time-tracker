## Why

Un Proyecto es la agrupación lógica de nivel superior del dominio de Time Tracker: sin Proyectos no pueden existir Tareas ni, por lo tanto, Registros de Tiempo. Es el punto de entrada al producto y necesita cubrir su ciclo de vida completo (crear, editar, eliminar, visualizar) para que el usuario pueda mantener su organización al día.

## What Changes

- Se permite crear un Proyecto con Nombre (obligatorio) y Descripción (opcional).
- Se permite editar el Nombre y/o la Descripción de un Proyecto existente.
- Se permite eliminar un Proyecto que no tenga Tareas asociadas.
- Se bloquea la eliminación de un Proyecto que tenga una o más Tareas asociadas, informando al usuario el motivo.
- La pantalla "Proyectos" lista los Proyectos existentes con acciones de editar y eliminar.
- Todos los datos se persisten exclusivamente en el almacenamiento local del dispositivo (offline-first, sin backend).

## Capabilities

### New Capabilities

- `project-management`: ciclo de vida completo de un Proyecto (crear, editar, eliminar con regla de bloqueo, listar).

### Modified Capabilities

_Ninguna. Depende de la capability `app-layout` (change `layout-de-la-aplicacion`) para la navegación, pero no modifica sus requisitos._

## Impacto

- Repositorio: `exercise-time-tracker` (monorepo, Next.js App Router).
- Persistencia: `localStorage` del navegador (ver ADR-011); ver modelo de datos `MD-01: Proyecto` y flujos `FL-05`/`FL-06` en [technical-docs/timetracker.md](../../../docs/specs/technical-docs/timetracker.md).
- Depende del layout de `layout-de-la-aplicacion` para la navegación lateral y el encabezado.
- Fuente funcional: [US-002 — Gestión de Proyectos](../../../docs/specs/user-stories/US-002-gestion-de-proyectos/README.md), derivada de [SRS-001](../../../docs/specs/requirements/SRS-001-timetracker-app/README.md) (RF-001, RF-002, RIU-001, RIU-002, RD-001, RD-003).
- Investigación relacionada: [RS-001 — Decisiones técnicas pendientes de Gestión de Proyectos](../../../docs/specs/user-stories/US-002-gestion-de-proyectos/research/RS-001-decisiones-tecnicas-pendientes/README.md) (longitud/unicidad de nombre, mensaje de bloqueo, manejo de fallo de `localStorage`).
