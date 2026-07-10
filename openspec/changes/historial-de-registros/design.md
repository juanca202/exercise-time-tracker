## Context

Time Tracker es offline-first, sin backend: toda la información vive en `localStorage` vía el middleware `persist` de Zustand ([ADR-011](../../../docs/adr/ADR-011-uso-de-localstorage-para-persistencia.md)), con manejo de estado exclusivamente en Zustand ([ADR-004](../../../docs/adr/ADR-004-uso-de-zustand.md)) y arquitectura feature-based bajo `src/features/` ([ADR-005](../../../docs/adr/ADR-005-arquitectura-feature-based.md)). `time-history` es de solo lectura: agrega datos que ya producen `task-time-tracking` (Tareas y Registros de Tiempo, change `gestion-de-tareas`) y `project-management` (Proyectos, change `gestion-de-proyectos`). El punto crítico de diseño es cómo lograr el presupuesto de rendimiento (RP-003: <2s para 1000 registros) al leer y agregar datos que viven en `localStorage`, una API síncrona.

## Goals / Non-Goals

**Goals:**

- Definir cómo se agregan los Registros de Tiempo por Tarea, Proyecto y mes sin duplicar lógica de cálculo entre las tres agregaciones.
- Definir el modelo de "periodo seleccionado" (mes) y su navegación.
- Asegurar que la agregación de hasta 1000 registros cumpla el presupuesto de <2s.

**Non-Goals:**

- Creación, edición o eliminación de Registros de Tiempo (exclusivo de `task-time-tracking`).
- Gestión de Proyectos o Tareas (exclusivo de `project-management` y `task-time-tracking`).
- Persistencia de la selección de periodo entre sesiones (se asume que cada visita al Historial inicia en el mes actual, salvo que el usuario indique lo contrario en una futura historia).

## Decisions

- **Capability de solo lectura sin store propio de escritura:** `time-history` no introduce un nuevo store de Zustand con `persist`; lee directamente los stores existentes de Tareas/Registros y de Proyectos, y mantiene únicamente un estado de UI local (el mes seleccionado) que no requiere persistencia.
- **Una única función de agregación como base de las tres vistas:** los totales por Tarea, por Proyecto y por mes se derivan de una sola pasada de agrupación (`groupBy` sobre los Registros de Tiempo filtrados por el periodo), evitando iterar la colección completa tres veces por separado.
- **Filtrado por periodo antes de agregar:** el filtrado por mes seleccionado ocurre antes de cualquier cálculo de totales, para que el costo de agregación escale con el tamaño del periodo visible, no con el histórico completo.
- **Memoización del cálculo de agregados:** el resultado de la agregación se memoiza (p. ej. con `useMemo`) por combinación de (periodo seleccionado, Registros de Tiempo, Proyectos), para no recalcular en cada render mientras el usuario interactúa con la pantalla.

## Risks / Trade-offs

- [Cumplir <2s con 1000 registros usando lectura síncrona de `localStorage`] → Mitigado limitando el trabajo por render a una sola pasada de agregación sobre los registros ya filtrados por periodo, y memoizando el resultado; si en la práctica no alcanza, se evaluará paginar el listado (fuera de alcance de este change).
- [Cantidad de proyectos involucrados en el resumen requiere Proyectos únicos entre los Registros del periodo] → se calcula como un `Set` de `projectId` sobre los Registros ya filtrados, sin recorrido adicional sobre el store de Proyectos completo.
