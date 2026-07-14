# Casos de prueba — US-001: Proyectos

Índice de casos de prueba (TC-XXX) derivados de los criterios de aceptación de [US-001](../README.md).

| TC                                                                    | Perspectiva | Automatización                   | Prioridad | Criterio de aceptación |
| --------------------------------------------------------------------- | ----------- | -------------------------------- | --------- | ---------------------- |
| [TC-001](./TC-001-crear-proyecto-nombre-y-descripcion-happy.md)       | Happy Path  | Automatizable (E2E)              | Alta      | AC-001                 |
| [TC-002](./TC-002-crear-proyecto-solo-nombre-limite.md)               | Límite      | Automatizable (Unit/Integration) | Media     | AC-001                 |
| [TC-003](./TC-003-nombre-vacio-bloquea-guardado-error.md)             | Error       | Automatizable (Unit/Integration) | Alta      | AC-002                 |
| [TC-004](./TC-004-nombre-solo-espacios-bloquea-guardado-limite.md)    | Límite      | Automatizable (Unit/Integration) | Media     | AC-002                 |
| [TC-005](./TC-005-persistencia-proyecto-tras-recarga-happy.md)        | Happy Path  | Automatizable (E2E)              | Alta      | AC-003                 |
| [TC-006](./TC-006-persistencia-multiples-proyectos-limite.md)         | Límite      | Automatizable (E2E)              | Media     | AC-003                 |
| [TC-007](./TC-007-listado-proyectos-creados-happy.md)                 | Happy Path  | Automatizable (E2E)              | Alta      | AC-004                 |
| [TC-008](./TC-008-listado-vacio-sin-proyectos-limite.md)              | Límite      | Automatizable (Unit/Integration) | Baja      | AC-004                 |
| [TC-009](./TC-009-editar-proyecto-nombre-descripcion-happy.md)        | Happy Path  | Automatizable (E2E)              | Alta      | AC-005                 |
| [TC-010](./TC-010-editar-proyecto-descripcion-vacia-limite.md)        | Límite      | Automatizable (Unit/Integration) | Media     | AC-005                 |
| [TC-011](./TC-011-edicion-nombre-vacio-bloquea-guardado-error.md)     | Error       | Automatizable (Unit/Integration) | Alta      | AC-006                 |
| [TC-012](./TC-012-edicion-nombre-solo-espacios-limite.md)             | Límite      | Automatizable (Unit/Integration) | Media     | AC-006                 |
| [TC-013](./TC-013-adherencia-sistema-diseno-precision-focus-happy.md) | Happy Path  | Automatizable (Visual Test)      | Baja      | AC-007                 |
| [TC-014](./TC-014-navegacion-lateral-acceso-proyectos-happy.md)       | Happy Path  | Automatizable (E2E)              | Media     | AC-008                 |
| [TC-015](./TC-015-fidelidad-visual-prototipo-figma-happy.md)          | Happy Path  | Automatizable (Visual Test)      | Baja      | AC-009                 |
