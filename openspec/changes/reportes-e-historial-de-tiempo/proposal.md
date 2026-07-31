## Why

El valor final de Time Tracker es que el usuario entienda en qué invirtió su tiempo: sin visualización de totales e historial, los Registros de Tiempo generados por el temporizador y el ingreso manual quedarían atrapados sin utilidad. Además, el wireframe del panel principal expone un indicador de avance hacia una meta semanal fija que ningún requisito funcional original definía, y que producto confirmó durante la investigación de esta historia.

## What Changes

- Se muestra el historial completo de Registros de Tiempo, con navegación entre periodos mensuales.
- Se calculan y muestran los totales de tiempo acumulado por Tarea, por Proyecto y por mes.
- Se muestra el tiempo total acumulado de cada Proyecto en la pantalla "Proyectos".
- Se calcula y muestra el porcentaje de avance hacia una meta semanal fija de 40 horas, capado en 100% aunque el Total semanal la supere.
- La visualización de reportes carga en menos de 2 segundos para hasta 1000 Registros de Tiempo.

## Capabilities

### New Capabilities

- `time-reports`: historial de Registros de Tiempo, totales agregados (Tarea/Proyecto/mes) y el indicador de meta semanal.

### Modified Capabilities

_Ninguna. Depende de `task-management`/`timer-tracking`/`manual-time-entry` (change `gestion-de-tareas-y-registro-de-tiempo`) para los Registros de Tiempo, y de `project-management` para los Proyectos, pero no modifica sus requisitos._

## Impacto

- Repositorio: `exercise-time-tracker` (monorepo, Next.js App Router).
- Lectura agregada sobre `localStorage` (ADR-011); cálculo documentado en [technical-docs/timetracker.md#fl-04](../../../docs/specs/technical-docs/timetracker.md#fl-04-cálculo-de-totales-de-tiempo-tarea-proyecto-mes).
- Requisito de rendimiento explícito (RP-003): carga en menos de 2 segundos para hasta 1000 Registros de Tiempo.
- Fuente funcional: [US-004 — Reportes e Historial de Tiempo](../../../docs/specs/user-stories/US-004-reportes-e-historial-de-tiempo/README.md), derivada de [SRS-001](../../../docs/specs/requirements/SRS-001-timetracker-app/README.md) (RF-014 a RF-017, RIU-002, RD-003, RP-003).
- Investigación relacionada: [RS-001 — Meta semanal no especificada](../../../docs/specs/user-stories/US-004-reportes-e-historial-de-tiempo/research/RS-001-meta-semanal-no-especificada/README.md) — meta fija de 40 horas semanales, confirmada por producto.
