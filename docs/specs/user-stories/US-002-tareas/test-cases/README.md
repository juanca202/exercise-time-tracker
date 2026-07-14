# Casos de prueba — US-002: Tareas

Índice de casos de prueba (TC-XXX) derivados de los criterios de aceptación de [US-002](../README.md), siguiendo el estándar IEEE 29119-4.

| TC                                                                 | Perspectiva | Automatización              | Prioridad | Criterio de aceptación |
| ------------------------------------------------------------------ | ----------- | --------------------------- | --------- | ---------------------- |
| [TC-001](./TC-001-crear-tarea-happy.md)                            | Happy Path  | Automatizable (E2E)         | Media     | AC-001                 |
| [TC-002](./TC-002-crear-tarea-sin-proyecto-error.md)               | Error       | Automatizable (Unit)        | Alta      | AC-002                 |
| [TC-003](./TC-003-crear-tarea-sin-nombre-error.md)                 | Error       | Automatizable (Unit)        | Alta      | AC-002                 |
| [TC-004](./TC-004-persistencia-tarea-happy.md)                     | Happy Path  | Automatizable (Integration) | Media     | AC-003                 |
| [TC-005](./TC-005-editar-nombre-tarea-happy.md)                    | Happy Path  | Automatizable (E2E)         | Media     | AC-004                 |
| [TC-006](./TC-006-diseno-pantalla-tareas-happy.md)                 | Happy Path  | Automatizable (Visual Test) | Baja      | AC-005                 |
| [TC-007](./TC-007-iniciar-temporizador-happy.md)                   | Happy Path  | Automatizable (E2E)         | Media     | AC-006                 |
| [TC-008](./TC-008-auto-stop-temporizador-happy.md)                 | Happy Path  | Automatizable (E2E)         | Alta      | AC-007                 |
| [TC-009](./TC-009-detener-temporizador-happy.md)                   | Happy Path  | Automatizable (E2E)         | Media     | AC-008                 |
| [TC-010](./TC-010-duracion-cero-al-detener-limite.md)              | Límite      | Automatizable (Unit)        | Alta      | AC-009                 |
| [TC-011](./TC-011-persistencia-registro-temporizador-happy.md)     | Happy Path  | Automatizable (Integration) | Media     | AC-010                 |
| [TC-012](./TC-012-estado-temporizador-visible-happy.md)            | Happy Path  | Automatizable (E2E)         | Media     | AC-011                 |
| [TC-013](./TC-013-rendimiento-temporizador-happy.md)               | Happy Path  | Automatizable (E2E)         | Media     | AC-012                 |
| [TC-014](./TC-014-registro-manual-happy.md)                        | Happy Path  | Automatizable (E2E)         | Media     | AC-013                 |
| [TC-015](./TC-015-duracion-manual-invalida-error.md)               | Error       | Automatizable (Unit)        | Alta      | AC-014                 |
| [TC-016](./TC-016-duracion-manual-minima-limite.md)                | Límite      | Automatizable (Unit)        | Alta      | AC-014                 |
| [TC-017](./TC-017-persistencia-registro-manual-happy.md)           | Happy Path  | Automatizable (Integration) | Media     | AC-015                 |
| [TC-018](./TC-018-fidelidad-visual-tareas-happy.md)                | Happy Path  | Automatizable (Visual Test) | Baja      | AC-016                 |
| [TC-019](./TC-019-meta-semanal-fija-happy.md)                      | Happy Path  | Automatizable (Unit)        | Media     | AC-017                 |
| [TC-020](./TC-020-total-semanal-happy.md)                          | Happy Path  | Automatizable (Unit)        | Media     | AC-018                 |
| [TC-021](./TC-021-total-semanal-excluye-semana-anterior-limite.md) | Límite      | Automatizable (Unit)        | Media     | AC-018                 |
| [TC-022](./TC-022-porcentaje-meta-semanal-happy.md)                | Happy Path  | Automatizable (Unit)        | Media     | AC-019                 |
| [TC-023](./TC-023-porcentaje-meta-semanal-superior-100-limite.md)  | Límite      | Automatizable (Unit)        | Baja      | AC-019                 |
| [TC-024](./TC-024-total-semanal-excluye-fin-de-semana-limite.md)   | Límite      | Automatizable (Unit)        | Media     | AC-018                 |
