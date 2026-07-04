# TK-002: Panel "Entrada Manual" y lista "Tareas Recientes"

Estado: Ready
Historia: [US-003](./README.md)
Repositorio: exercise-time-tracker

## Descripción

Añadir a la vista `/tasks` el panel "Entrada Manual" (Fecha, Proyecto/Tarea, Duración) que crea un `TimeEntry` manual validado, y la lista "Tareas Recientes" que muestra los últimos Registros de Tiempo (de cualquier origen) con acceso rápido para reiniciar el temporizador de esa misma Tarea.

## Dependencias

- Store de dominio (`tasks`, `projects`, `timeEntries`) y acción `createManualTimeEntry` (nueva en esta tarea) — TK-001 de [US-001](../US-001-gestion-proyectos-tareas/README.md).
- `startTimer` — TK-001 de [US-002](../US-002-control-tiempo-automatizado/README.md).
- `formatDuration` — TK-002 de [US-002](../US-002-control-tiempo-automatizado/README.md).
- `Field`, `SelectField`, `Button` — TK-002 de [US-001](../US-001-gestion-proyectos-tareas/README.md).
- `app/tasks/page.tsx` — TK-005 de [US-001](../US-001-gestion-proyectos-tareas/README.md), ya extendida por TK-002 de US-002.

## Referencias

- **Diseño:** [Wireframe — Panel de Tareas (entrada manual)](assets/wireframe-panel-tareas-entrada-manual.png)
- **Historia base:** [US-001](../US-001-gestion-proyectos-tareas/README.md)

## Plan de implementación

### Archivos afectados

```text
exercise-time-tracker/
└── src/
    └── features/time-tracking/
        ├── ~ store/time-tracking-store.ts       # + createManualTimeEntry({ taskId, date, durationSeconds })
        ├── + lib/duration-input.ts               # parseDurationInput("HH:MM") → segundos | null si inválido
        ├── + components/manual-entry-panel.tsx   # formulario Fecha + Proyecto/Tarea + Duración + Guardar Registro
        ├── + components/recent-entries-list.tsx  # lista de TimeEntry recientes con botón reiniciar temporizador
        └── ~ app/tasks/page.tsx                  # incorpora <ManualEntryPanel /> y <RecentEntriesList />
```

### Subtareas

- [x] Implementar `parseDurationInput("HH:MM")` devolviendo segundos totales o `null` si el formato es inválido o el resultado no es mayor que cero.
- [x] Implementar `createManualTimeEntry` en el store: valida `durationSeconds > 0` (usando `parseDurationInput` desde el componente antes de invocar la acción), crea el `TimeEntry` con `source: 'manual'` y persiste.
- [x] Implementar `ManualEntryPanel`: campo Fecha (input `date`), `SelectField` de Proyecto/Tarea (agrupado por proyecto), campo de Duración en formato `HH:MM`; botón "Guardar Registro" valida los campos al confirmar y muestra el error correspondiente si falta alguno o la duración es inválida.
- [x] Implementar `RecentEntriesList`: ordena `timeEntries` por fecha de creación descendente, muestra un máximo razonable de filas (5) con nombre de Tarea, Proyecto, duración formateada y tiempo relativo de creación; cada fila incluye un botón que llama a `startTimer(taskId)` para reiniciar el temporizador de esa Tarea.
- [x] Integrar ambos componentes en `app/tasks/page.tsx`.
- [x] Documentar con TSDoc en español las funciones y componentes exportados.
- [x] Escribir tests: unitario de `parseDurationInput` (formato válido, inválido, cero, negativo); de componente para `ManualEntryPanel` (creación válida, bloqueo con duración inválida) y `RecentEntriesList` (reiniciar temporizador desde una fila llama a `startTimer` con el `taskId` correcto).

## Observaciones

Sin pendientes documentados.
