## Why

[US-003](../../../docs/specs/user-stories/US-003-historial-de-registros/README.md) (Ready, 7 criterios de aceptación) cierra el bucle del MVP al permitir que el usuario vea el historial completo y los totales por Tarea, Proyecto y mes. El change `fundamentos` ya provee datos reales de Task/Project/TimeRecord (CRUD crudo, no solo tipos) y el shell de la app, por lo que este change puede construirse y verificarse de punta a punta — sembrando TimeRecords directamente mediante el `addTimeRecord` crudo de `fundamentos` para sus propios fixtures y pruebas de rendimiento — sin esperar a que existan las propias pantallas de los changes `proyectos` o `tareas`.

## What Changes

- Agregar la pantalla de Historial de registros: listado completo de los Time Records almacenados.
- Agregar el total de tiempo acumulado por Tarea.
- Agregar el total de tiempo acumulado por Proyecto (suma de los totales de sus Tareas).
- Agregar el total de tiempo acumulado por mes, con los registros de timer que cruzan de mes asignados en su totalidad al mes de la Hora de Inicio (sin prorrateo).
- Cumplir un presupuesto de rendimiento de menos de 2 segundos para renderizar el conjunto completo de reportes con hasta 1.000 Time Records.
- Implementar la UI según el prototipo de Figma y el DESIGN.md "Precision Focus", con un criterio de aceptación explícito de fidelidad visual.

No hay cambios **BREAKING**. Este change solo lee datos a través del CRUD crudo de `fundamentos` — no modifica la forma en que se crean Proyectos, Tareas o Time Records.

## Capacidades

### Capacidades Nuevas

- `time-history`: Historial completo de time records y totales por Tarea/Proyecto/Mes, más el requisito de rendimiento de <2s/1.000 registros. Fuente: US-003, AC-001 a AC-007.

### Capacidades Modificadas

- Ninguna — este change es de solo lectura sobre el modelo de datos establecido por `fundamentos`.

## Impacto

- **Código afectado**: `src/features/history` (nuevo). Lee el estado de Proyecto/Tarea/Time Record del store compartido de Zustand (mediante `listProjects`/`listTasks`/`listTimeRecords` crudos de `fundamentos`); no agrega estado persistido propio.
- **Dependencias**: ninguna nueva; reutiliza `src/shared/persistence`. Confirmado como suficiente para este volumen de datos por [RS-002](../../../docs/specs/user-stories/US-003-historial-de-registros/research/RS-002-persistencia-local-localstorage-vs-indexeddb.md) — `localStorage` mediante `persist` de Zustand, sin necesidad de IndexedDB.
- **Sistemas**: ninguno externo — offline-first, sin backend.
- **Sistema de diseño**: debe coincidir con el prototipo de Figma (frame "Historial de registros") y con DESIGN.md.
- **Secuenciación**: depende únicamente del change `fundamentos`. No depende de `proyectos` ni de `tareas` — el fixture de 1.000 registros propio de este change se siembra directamente mediante el `addTimeRecord` crudo de `fundamentos`, por lo que puede implementarse en paralelo con ambos.
- **Nota de regla de negocio**: la regla de atribución de cruce de mes (fecha de inicio, sin prorrateo) se resolvió mediante investigación dedicada — ver [RS-001](../../../docs/specs/user-stories/US-003-historial-de-registros/research/RS-001-regla-cruce-de-mes.md).
