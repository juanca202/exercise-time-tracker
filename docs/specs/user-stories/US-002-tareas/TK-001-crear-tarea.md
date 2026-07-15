# TK-001: Crear Tarea

**Estado**: Ready
**Historia**: [US-002](./README.md)
**Repositorio**: exercise-time-tracker
**Asignado a**: juanca202

## Descripción

Implementar la creación de una Tarea asociada obligatoriamente a un Proyecto existente y con un Nombre no vacío, rechazando la creación (con el motivo del rechazo) cuando falte el Proyecto o el Nombre, y delegando la persistencia de la Tarea resultante en el store raíz compartido (ver [TK-002](./TK-002-persistencia-tarea.md)).

## Dependencias

- `src/shared/domain/types.ts` — tipos `Proyecto` y `Tarea` (US-000).
- `src/shared/store/app-store.ts` — `crearTarea`, `useProyectos()`; CRUD crudo de US-000, sin validación propia.
- `src/shared/persistence/` — `useHasHydrated()`, para gatear la lectura de `useProyectos()` antes de validar contra los Proyectos existentes.

## Referencias

- **Arquitectura:** [ADR-004: Uso de Zustand para manejo de estado](../../../adr/ADR-004-uso-de-zustand.md) — el store compartido consumido (`useAppStore`) es Zustand.
- **Arquitectura:** [ADR-005: Arquitectura del proyecto basada en features](../../../adr/ADR-005-arquitectura-feature-based.md) — ubicación del código nuevo en `src/features/tareas/`.

## Archivos afectados

```text
exercise-time-tracker/
└── src/
    └── features/
        └── tareas/
            ├── domain/
            │   └── + validar-tarea.ts        # valida Proyecto existente y Nombre no vacío (BR-01, AC-001, AC-002)
            └── hooks/
                └── + useCrearTarea.ts         # crea una Tarea validada delegando en useAppStore().crearTarea
```

## Plan de implementación

- [ ] **IT-01** — Crear `validar-tarea.ts` con una función pura `validarTarea({ proyectoId, nombre }, proyectosExistentes)` que retorna un resultado de validación (válido/inválido + motivo).
      Verifica que `proyectoId` corresponda a un Proyecto existente en `proyectosExistentes` y que `nombre` no esté vacío tras `trim()`. Cubre AC-001 (happy path) y AC-002 (rechazo sin Proyecto o sin Nombre); ver [TC-001](./test-cases/TC-001-crear-tarea-happy.md), [TC-002](./test-cases/TC-002-crear-tarea-sin-proyecto-error.md), [TC-003](./test-cases/TC-003-crear-tarea-sin-nombre-error.md).
- [ ] **IT-02** — Crear `useCrearTarea.ts`: hook que lee `useProyectos()` (US-000) tras pasar el gate `useHasHydrated()`, ejecuta `validarTarea`, y si el resultado es válido invoca `useAppStore().crearTarea({ proyectoId, nombre })`.
      Si el resultado es inválido, retorna el motivo de rechazo sin llamar al store.
- [ ] **IT-03** — Exponer desde `useCrearTarea` el estado de error (motivo de rechazo) para que [TK-004](./TK-004-ui-pantalla-tareas.md) lo muestre en el modal "Nueva Tarea".

## Observaciones

Sin pendientes documentados.
