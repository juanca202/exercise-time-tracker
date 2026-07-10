# Índice de casos de prueba

| TC                                                                     | Perspectiva | Automatización              | Prioridad | Criterio de aceptación |
| ---------------------------------------------------------------------- | ----------- | --------------------------- | --------- | ---------------------- |
| [TC-001](./TC-001-crear-tarea-nombre-proyecto-happy.md)                | Happy Path  | Automatizable (E2E)         | Alta      | AC-001                 |
| [TC-002](./TC-002-crear-tarea-nombre-vacio-error.md)                   | Error       | Automatizable (E2E)         | Alta      | AC-001                 |
| [TC-003](./TC-003-crear-tarea-sin-proyecto-error.md)                   | Error       | Automatizable (E2E)         | Alta      | AC-001                 |
| [TC-004](./TC-004-persistencia-tarea-proyecto-happy.md)                | Happy Path  | Automatizable (Integration) | Alta      | AC-002                 |
| [TC-005](./TC-005-modal-nueva-tarea-presentacion-happy.md)             | Happy Path  | Automatizable (Visual Test) | Media     | AC-003                 |
| [TC-006](./TC-006-modal-nueva-tarea-cancelar-happy.md)                 | Happy Path  | Automatizable (E2E)         | Media     | AC-003                 |
| [TC-007](./TC-007-iniciar-temporizador-tarea-happy.md)                 | Happy Path  | Automatizable (E2E)         | Alta      | AC-004                 |
| [TC-008](./TC-008-cambio-temporizador-activo-happy.md)                 | Happy Path  | Automatizable (Integration) | Alta      | AC-005                 |
| [TC-009](./TC-009-cambio-temporizador-duracion-minima-limite.md)       | Límite      | Automatizable (Integration) | Media     | AC-005                 |
| [TC-010](./TC-010-detener-temporizador-sesion-happy.md)                | Happy Path  | Automatizable (E2E)         | Alta      | AC-006                 |
| [TC-011](./TC-011-detener-temporizador-sin-activo-error.md)            | Error       | Automatizable (E2E)         | Media     | AC-006                 |
| [TC-012](./TC-012-calculo-duracion-persistencia-temporizador-happy.md) | Happy Path  | Automatizable (Integration) | Alta      | AC-007                 |
| [TC-013](./TC-013-duracion-temporizador-cero-error.md)                 | Error       | Automatizable (Unit)        | Alta      | AC-008                 |
| [TC-014](./TC-014-duracion-temporizador-minima-valida-limite.md)       | Límite      | Automatizable (Unit)        | Media     | AC-008                 |
| [TC-015](./TC-015-crear-registro-manual-valido-happy.md)               | Happy Path  | Automatizable (E2E)         | Alta      | AC-009                 |
| [TC-016](./TC-016-crear-registro-manual-campo-obligatorio-error.md)    | Error       | Automatizable (E2E)         | Alta      | AC-009                 |
| [TC-017](./TC-017-persistencia-registro-manual-happy.md)               | Happy Path  | Automatizable (Integration) | Alta      | AC-010                 |
| [TC-018](./TC-018-duracion-manual-negativa-error.md)                   | Error       | Automatizable (Unit)        | Alta      | AC-011                 |
| [TC-019](./TC-019-duracion-manual-cero-error.md)                       | Error       | Automatizable (Unit)        | Alta      | AC-011                 |
| [TC-020](./TC-020-duracion-manual-minima-valida-limite.md)             | Límite      | Automatizable (Unit)        | Media     | AC-011                 |
| [TC-021](./TC-021-rendimiento-inicio-temporizador-happy.md)            | Happy Path  | Automatizable (E2E)         | Media     | AC-012                 |
| [TC-022](./TC-022-rendimiento-detener-temporizador-happy.md)           | Happy Path  | Automatizable (E2E)         | Media     | AC-013                 |
