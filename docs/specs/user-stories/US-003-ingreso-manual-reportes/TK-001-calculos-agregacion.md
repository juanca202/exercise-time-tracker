# TK-001: Cálculos de agregación y utilidades de periodo

Estado: Ready
Historia: [US-003](./README.md)
Repositorio: exercise-time-tracker

## Descripción

Implementar las funciones puras de agregación de tiempo (total por Tarea, por Proyecto y por mes/periodo) y las utilidades de filtrado por periodo mensual que usarán el panel de entrada manual y la vista de Historial de Registros.

## Dependencias

- Tipos `Task`, `TimeEntry` — TK-001 de [US-001](../US-001-gestion-proyectos-tareas/README.md).
- `projectTotalSeconds` (`lib/totals.ts`) — TK-004 de [US-001](../US-001-gestion-proyectos-tareas/README.md) (se extiende en esta tarea).

## Referencias

- **Historia base:** [US-001](../US-001-gestion-proyectos-tareas/README.md)

## Plan de implementación

### Archivos afectados

```text
exercise-time-tracker/
└── src/
    └── features/time-tracking/lib/
        ├── ~ totals.ts       # + taskTotalSeconds, monthTotalSeconds, totalsByTask, totalsByProject
        └── + period.ts       # isEntryInMonth(entry, year, month), formatMonthLabel(year, month), addMonths(year, month, delta)
```

### Subtareas

- [x] Implementar `taskTotalSeconds(taskId, timeEntries)`: suma de `durationSeconds` de los registros de una Tarea.
- [x] Implementar `totalsByTask(tasks, timeEntries)` y `totalsByProject(projects, tasks, timeEntries)`: mapas `{ id, name, totalSeconds }` ordenados de mayor a menor tiempo.
- [x] Implementar `monthTotalSeconds(timeEntries, year, month)`: suma de duraciones cuyos registros caen en el mes/año indicado (usar `date` del `TimeEntry`).
- [x] Implementar `period.ts`: `isEntryInMonth(entry, year, month)`, `formatMonthLabel(year, month)` (p. ej. "Octubre 2023" en español) y `addMonths(year, month, delta)` para la navegación de periodo.
- [x] Documentar cada función exportada con TSDoc en español.
- [x] Escribir tests unitarios con datos fijos (Object Mothers de `TimeEntry` con fechas controladas) cubriendo: proyecto/tarea sin registros (total 0), registros repartidos entre varias tareas/proyectos, registros de distintos meses (el filtro de mes excluye los que no correspondan), y el cambio de mes con `addMonths` en los bordes de año (diciembre → enero, enero → diciembre).

## Observaciones

Sin pendientes documentados.
