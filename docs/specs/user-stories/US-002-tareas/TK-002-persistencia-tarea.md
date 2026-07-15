# TK-002: Persistencia de Tarea

**Estado**: Ready
**Historia**: [US-002](./README.md)
**Repositorio**: exercise-time-tracker
**Asignado a**: juanca202

## Descripción

Garantizar que toda Tarea creada o actualizada, incluyendo su asociación al Proyecto (`proyectoId`), quede persistida en el almacenamiento local del dispositivo y sea recuperable tras un cierre inesperado o un reinicio, apoyándose en el store raíz y el adaptador de persistencia ya construidos en US-000 (sin introducir un mecanismo de persistencia adicional).

## Dependencias

- `src/shared/store/app-store.ts` — `crearTarea`, `actualizarTarea`, `useTareas()`; ya persistidos mediante el adaptador de persistencia compartido (US-000, AC-002).
- `src/shared/persistence/` — `AdaptadorPersistencia<T>`, `crearAdaptadorLocalStorage`, `useHasHydrated()`.
- `src/features/tareas/hooks/useCrearTarea.ts` ([TK-001](./TK-001-crear-tarea.md)) — consumidor de `crearTarea` cuya persistencia valida esta tarea.

## Referencias

- **Arquitectura:** [ADR-004: Uso de Zustand para manejo de estado](../../../adr/ADR-004-uso-de-zustand.md).

## Archivos afectados

```text
exercise-time-tracker/
└── (sin archivos nuevos: la persistencia de Tarea se resuelve íntegramente con el store y el adaptador compartidos ya construidos en US-000; ver Plan de implementación)
```

## Plan de implementación

- [ ] **IT-01** — Confirmar que `crearTarea` y `actualizarTarea` (`src/shared/store/app-store.ts`, US-000) escriben el objeto `Tarea` completo — incluyendo `proyectoId` — a través de `AdaptadorPersistencia<T>`, sin omitir campos al serializar.
- [ ] **IT-02** — Confirmar que `useTareas()` solo se lee en componentes que ya pasaron el gate `useHasHydrated()` ([TK-001](./TK-001-crear-tarea.md), [TK-004](./TK-004-ui-pantalla-tareas.md)), evitando renderizar una lista vacía o parcial antes de la hidratación del store persistido.
- [ ] **IT-03** — Verificar manualmente (recarga completa del navegador tras crear una Tarea) que la Tarea y su asociación al Proyecto sobreviven al reinicio, conforme a [TC-004](./test-cases/TC-004-persistencia-tarea-happy.md).

## Observaciones

Sin pendientes documentados. Esta tarea no agrega código de aplicación nuevo: su alcance es confirmar y trazar (AC-003) la garantía de persistencia genérica que US-000 ya entrega para la entidad Tarea.
