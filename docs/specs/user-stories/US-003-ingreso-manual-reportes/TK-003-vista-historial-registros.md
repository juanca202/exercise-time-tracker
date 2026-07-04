# TK-003: Vista "Historial de Registros"

Estado: Ready
Historia: [US-003](./README.md)
Repositorio: exercise-time-tracker

## Descripción

Implementar la ruta `/history`: selector de periodo mensual (mes anterior/siguiente), tarjetas resumen de tiempo total por Proyecto del periodo, tabla de Registros de Tiempo (Fecha/Proyecto/Tarea/Duración) del periodo, una sección de totales por Tarea, y un pie con el número de registros, número de proyectos y total de horas del periodo.

## Dependencias

- `totalsByTask`, `totalsByProject`, `monthTotalSeconds` — TK-001 de esta historia.
- `isEntryInMonth`, `formatMonthLabel`, `addMonths` — TK-001 de esta historia.
- `formatDuration` — TK-002 de [US-002](../US-002-control-tiempo-automatizado/README.md).
- `projects`, `tasks`, `timeEntries` del store — TK-001 de [US-001](../US-001-gestion-proyectos-tareas/README.md).
- `Button` — TK-002 de [US-001](../US-001-gestion-proyectos-tareas/README.md).

## Referencias

- **Diseño:** [Wireframe — Historial de Registros](assets/wireframe-historial-registros.png)
- **Historia base:** [US-001](../US-001-gestion-proyectos-tareas/README.md)

## Plan de implementación

### Archivos afectados

```text
exercise-time-tracker/
└── src/
    ├── + app/history/page.tsx                        # página de la ruta /history
    └── features/time-tracking/components/
        └── + history-view.tsx                        # selector de periodo + cards por proyecto + tabla + totales por tarea + footer
```

### Subtareas

- [x] Implementar `HistoryView` (Client Component) con estado local de periodo (`year`, `month`, inicializado en el mes actual), navegación anterior/siguiente usando `addMonths` y etiqueta con `formatMonthLabel`.
- [x] Filtrar `timeEntries` del periodo seleccionado con `isEntryInMonth`; derivar `projects` involucrados en el periodo y mostrar una tarjeta resumen por proyecto con el total del proyecto acotado al periodo (`totalsByProject`).
- [x] Renderizar la tabla de registros del periodo (`Fecha`, `Proyecto`, `Tarea`, `Duración`) ordenada por fecha descendente, usando elementos `table`/`thead`/`tbody` semánticos.
- [x] Añadir la sección "Totales por Tarea" (lista) usando `totalsByTask` acotado a los registros del periodo.
- [x] Renderizar el pie con: número de registros encontrados, número de proyectos distintos y el total de horas del periodo (`monthTotalSeconds`).
- [x] Manejar el estado vacío (sin registros en el periodo) con un mensaje claro, sin romper el layout de tarjetas/tabla.
- [x] Ensamblar `app/history/page.tsx` con `HistoryView`.
- [x] Documentar `HistoryView` con TSDoc en español.
- [x] Escribir tests de componente: navegación de periodo (mes anterior/siguiente actualiza la tabla y los totales), estado vacío sin registros en el periodo, y verificación de que los totales por tarea/proyecto/mes mostrados coinciden con datos creados vía el store.

## Observaciones

Sin pendientes documentados.
