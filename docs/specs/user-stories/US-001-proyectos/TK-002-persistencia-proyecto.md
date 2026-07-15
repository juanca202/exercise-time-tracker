# TK-002: Persistencia de Proyecto

**Estado**: Ready
**Historia**: [US-001](./README.md)
**Repositorio**: exercise-time-tracker
**Asignado a**: juanca202

## Descripción

Verificar y cubrir con una prueba end-to-end que los datos de un Proyecto (Nombre, Descripción) sobreviven a una recarga completa de la aplicación (equivalente a un cierre inesperado o un reinicio del dispositivo), apoyándose en el adaptador de persistencia local y el store raíz ya provistos por US-000, sin introducir un mecanismo de almacenamiento propio de esta historia.

## Dependencias

- [TK-001: Dominio, persistencia local, store raíz y helper de fecha compartidos (US-000)](../US-000-fundamentos/TK-001-dominio-persistencia-store-y-fecha.md) — `createLocalStorageAdapter` y `useHasHydrated()`, mecanismo de persistencia real que esta tarea verifica end-to-end para la entidad Proyecto; `useAppStore` persiste `projects` automáticamente mediante el middleware `persist` de Zustand sobre ese adaptador.
- [TK-001: Crear, editar y listar Proyectos](TK-001-crear-editar-y-listar-proyectos.md) — flujo usado para generar los Proyectos de prueba (crear vía modal) y pantalla usada para observar, tras la recarga, que los Proyectos persistidos siguen visibles.

## Referencias

- **Arquitectura:** [ADR-007: Estrategia de pruebas unitarias](../../../adr/ADR-007-estrategia-pruebas-unitarias.md) (co-localización y patrón AAA, también aplicado a la prueba E2E), [ADR-008: Uso de Playwright para las pruebas E2E](../../../adr/ADR-008-uso-de-playwright-para-e2e.md).

## Archivos afectados

```text
exercise-time-tracker/
└── e2e/
    └── + us-001-project-persistence.spec.ts   # TC-005/TC-006: recarga completa tras crear uno o varios Proyectos
```

## Plan de implementación

- [ ] **IT-01** — Escribir `e2e/us-001-project-persistence.spec.ts` (Playwright, ADR-008) cubriendo TC-005: crear un Proyecto (Nombre + Descripción) vía el modal ([TK-001](TK-001-crear-editar-y-listar-proyectos.md)), recargar completamente la página y verificar que sigue visible en el listado con el mismo Nombre y Descripción.
- [ ] **IT-02** — Extender el mismo spec para cubrir TC-006: crear varios Proyectos, recargar, y verificar que todos persisten sin pérdida ni duplicación.
- [ ] **IT-03** — Verificar (sin código de producto adicional) que `src/app/proyectos/page.tsx` y `ProjectsList` ([TK-001](TK-001-crear-editar-y-listar-proyectos.md)) gatean la lectura de `useProjects()` detrás de `useHasHydrated()` antes de dar la tarea por completa: es la garantía de que la recarga no produce hydration-mismatch ni pérdida de datos visibles.

## Observaciones

Sin pendientes documentados.
