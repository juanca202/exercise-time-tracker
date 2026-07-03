# TK-001: Modelo de dominio y capa de persistencia local

Estado: Ready
Historia: [US-001](./README.md)
Repositorio: exercise-time-tracker

## Descripción

Dejar disponibles los tipos de dominio (`Project`, `Task`, `TimeEntry`, `ActiveTimer`) y una capa de persistencia en `localStorage` (lectura/escritura versionada, segura en SSR), junto con el store de Zustand que expone `projects`, `tasks` y las acciones `createProject`/`createTask`, hidratado desde el almacenamiento local al cargar la aplicación. Es la base de la que dependen el resto de tareas de US-001, US-002 y US-003.

## Dependencias

- Ninguna dentro del alcance del repositorio (tarea fundacional).

## Referencias

- **Arquitectura:** [ADR-003: Manejo de estado cliente con Zustand](../../../adr/ADR-003-zustand-state-management.md), [ADR-004: Estructura del proyecto con arquitectura por features](../../../adr/ADR-004-feature-based-architecture.md)

## Plan de implementación

### Archivos afectados

```text
exercise-time-tracker/
└── src/
    └── features/
        └── time-tracking/
            ├── + types/domain.ts                  # Project, Task, TimeEntry, ActiveTimer, TimeEntrySource
            ├── + lib/storage.ts                    # loadState/saveState en localStorage, clave "time-tracker:v1", guard SSR
            ├── + lib/id.ts                         # generador de ids únicos (crypto.randomUUID con fallback)
            ├── + store/time-tracking-store.ts      # store Zustand: projects, tasks, timeEntries, activeTimer, createProject, createTask, hidratación inicial
            └── + testing/object-mothers.ts         # aProject(overrides), aTask(overrides), aTimeEntry(overrides)
```

### Subtareas

- [x] Definir tipos `Project { id, name, description?, createdAt }`, `Task { id, projectId, name, createdAt }`, `TimeEntry { id, taskId, date, durationSeconds, source: 'timer' | 'manual', startTime?, endTime?, createdAt }`, `ActiveTimer { taskId, startedAt } | null`.
- [x] Implementar `storage.ts` con funciones puras `loadState()` / `saveState(state)` que serialicen a JSON bajo la clave `time-tracker:v1`, protegidas con `typeof window !== 'undefined'` para no romper en Server Components.
- [x] Implementar el store de Zustand con estado inicial hidratado desde `loadState()`, acciones `createProject(input)` y `createTask(input)` que validen los campos obligatorios, actualicen el estado y persistan mediante `saveState`.
- [x] Crear Object Mothers (`aProject`, `aTask`, `aTimeEntry`) con valores por defecto válidos y overrides opcionales para reutilizar en tests de esta y las siguientes tareas.
- [x] Documentar con TSDoc en español las funciones y el store exportados ([ADR-007](../../../adr/ADR-007-tsdoc-api-documentation.md)).
- [x] Escribir tests unitarios (Vitest, patrón AAA) para `storage.ts` y las acciones `createProject`/`createTask` del store, incluyendo el caso de datos ya persistidos previamente (hidratación) y reseteo del store entre tests.

## Observaciones

Sin pendientes documentados.
