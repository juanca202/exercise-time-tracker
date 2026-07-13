# Casos de prueba — US-003: Historial de registros

Índice de casos de prueba (`TC-XXX`) derivados de los criterios de aceptación de [US-003](../README.md), siguiendo el estándar IEEE 29119-4.

| TC                                                      | Perspectiva | Automatización                    | Prioridad | Criterio de aceptación |
| ------------------------------------------------------- | ----------- | --------------------------------- | --------- | ---------------------- |
| [TC-001](./TC-001-historial-completo-happy.md)          | Happy Path  | Automatizable (E2E)               | Alta      | AC-001                 |
| [TC-002](./TC-002-datos-corruptos-error.md)             | Error       | Automatizable (E2E)               | Media     | AC-001                 |
| [TC-003](./TC-003-historial-vacio-limite.md)            | Límite      | Automatizable (E2E)               | Baja      | AC-001                 |
| [TC-004](./TC-004-total-por-tarea-happy.md)             | Happy Path  | Automatizable (Unit)              | Alta      | AC-002                 |
| [TC-005](./TC-005-total-por-tarea-error.md)             | Error       | Automatizable (Unit)              | Alta      | AC-002                 |
| [TC-006](./TC-006-total-por-tarea-limite.md)            | Límite      | Automatizable (Unit)              | Alta      | AC-002                 |
| [TC-007](./TC-007-total-por-proyecto-happy.md)          | Happy Path  | Automatizable (Integration)       | Alta      | AC-003                 |
| [TC-008](./TC-008-total-por-proyecto-error.md)          | Error       | Automatizable (Integration)       | Alta      | AC-003                 |
| [TC-009](./TC-009-total-por-proyecto-limite.md)         | Límite      | Automatizable (Integration)       | Alta      | AC-003                 |
| [TC-010](./TC-010-total-por-mes-happy.md)               | Happy Path  | Automatizable (Unit)              | Alta      | AC-004                 |
| [TC-011](./TC-011-total-por-mes-error.md)               | Error       | Automatizable (Unit)              | Alta      | AC-004                 |
| [TC-012](./TC-012-total-por-mes-limite.md)              | Límite      | Automatizable (Unit)              | Alta      | AC-004                 |
| [TC-013](./TC-013-rendimiento-1000-registros-happy.md)  | Happy Path  | Automatizable (E2E - Performance) | Media     | AC-005                 |
| [TC-014](./TC-014-rendimiento-1000-registros-limite.md) | Límite      | Automatizable (E2E - Performance) | Media     | AC-005                 |
| [TC-015](./TC-015-adherencia-design-system-happy.md)    | Happy Path  | Automatizable (Visual Test)       | Baja      | AC-006                 |
| [TC-016](./TC-016-fidelidad-figma-happy.md)             | Happy Path  | Automatizable (Visual Test)       | Baja      | AC-007                 |
