# TK-001: Lectura del historial y presentación de totales por Tarea, Proyecto y mes

**Estado**: Ready
**Historia**: [US-003](./README.md)
**Repositorio**: exercise-time-tracker
**Asignado a**: juanca202

## Descripción

Leer los Registros de Tiempo persistidos junto con su Tarea y Proyecto asociados, uniéndolos y anotándolos con el total acumulado de cada fila por Tarea y por mes (usando los contratos y funciones de cálculo ya compartidos, definidos en [US-000](../US-000-fundamentos/README.md) para que Proyectos, Tareas e Historial de registros los consuman sin depender directamente entre sí, ADR-005), y mostrarlos en una tabla del historial completo (fecha, Tarea, Proyecto y duración), degradando a un estado vacío legible tanto cuando no existen Registros como cuando el dato persistido no es válido (JSON corrupto o campos con tipo inválido), sin interrumpir el render de la aplicación ni producir excepciones no controladas.

## Dependencias

- [US-000 TK-001: Dominio, persistencia local, store raíz y helper de fecha compartidos](../US-000-fundamentos/TK-001-dominio-persistencia-store-y-fecha.md) — tipos `Project`, `Task`, `TimeEntry`; `useHasHydrated()` como gate de hidratación antes de leer los selectores del store; su adaptador (`read()` devuelve `null` ante datos no parseables) es la primera línea de defensa frente al caso de JSON corrupto de TC-002; selectores `useProjects()`, `useTasks()`, `useTimeEntries()`; contratos `TaskTotal`/`ProjectTotal`/`MonthTotal` y funciones `indexById`, `isValidTimeEntry`, `calculateTotalByTask`, `calculateTotalByMonth` (`src/shared/reports/`, IT-23 a IT-30 de ese TK) — este TK las consume, no las redefine.
- [US-000 TK-002: Layout, navegación, tema de Tailwind y rutas placeholder](../US-000-fundamentos/TK-002-layout-navegacion-y-rutas-placeholder.md) — esta tarea provee los componentes que [TK-003: UI y diseño de la pantalla de Historial de registros](TK-003-ui-diseno-historial.md) usa para reemplazar el placeholder `src/app/historial/page.tsx`.

## Referencias

- **Arquitectura:** [ADR-004: Uso de Zustand para manejo de estado](../../../adr/ADR-004-uso-de-zustand.md) (naturaleza de los selectores consumidos), [ADR-005: Arquitectura del proyecto basada en features](../../../adr/ADR-005-arquitectura-feature-based.md) (`indexById`/`isValidTimeEntry`/`calculateTotalByTask`/`calculateTotalByMonth` viven en `src/shared/reports/`, US-000, no en `features/historial/`, porque también los consumen Proyectos y Tareas), [ADR-006: Documentación de código con TSDoc](../../../adr/ADR-006-documentacion-con-tsdoc.md), [ADR-007: Estrategia de pruebas unitarias](../../../adr/ADR-007-estrategia-pruebas-unitarias.md), [ADR-008: Uso de Playwright para las pruebas E2E](../../../adr/ADR-008-uso-de-playwright-para-e2e.md) (TC-001/TC-002/TC-003 son E2E), [ADR-013: Convenciones de código según la Google TypeScript Style Guide](../../../adr/ADR-013-convenciones-de-codigo-google-style-guide.md) (`HistoryRow` como interfaz, no alias de tipo).
- **Investigación:** [RS-002: Viabilidad técnica de localStorage vs. IndexedDB](./research/RS-002-persistencia-local-localstorage-vs-indexeddb.md) — confirma que la hidratación es síncrona (`useHasHydrated` basta, sin manejo de storage asíncrono) y que el costo de lectura para hasta 1000 Registros es del orden de milisegundos. La regla de asignación de mes en cruces de fin de mes ([RS-001](./research/RS-001-regla-cruce-de-mes.md)) la implementa `calculateTotalByMonth` en US-000 TK-001.

## Archivos afectados

```text
exercise-time-tracker/
├── e2e/
│   └── + us-003-history-read.spec.ts       # TC-001 (happy), TC-002 (datos corruptos), TC-003 (vacío)
└── src/
    └── features/
        └── historial/
            ├── domain/
            │   ├── + build-history-rows.ts       # buildHistoryRows(): une Registro+Tarea+Proyecto, filtra inválidos
            │   └── + build-history-rows.test.ts
            ├── hooks/
            │   ├── + use-history.ts                   # useHistory(): gate de hidratación + selectores crudos + filas
            │   └── + use-history.test.ts
            └── components/
                ├── + history-table.tsx                # tabla de Registros (fecha, Tarea, Proyecto, duración), agrupada por mes
                ├── + history-table.test.tsx
                ├── + empty-history.tsx                # estado vacío / degradado (con aviso opcional)
                └── + empty-history.test.tsx
```

## Plan de implementación

- [ ] **IT-01** — Definir en `build-history-rows.ts` la interfaz `HistoryRow extends TimeEntry { task: Task | undefined; project: Project | undefined }` (ADR-013) y la función `buildHistoryRows(entries: TimeEntry[], tasks: Task[], projects: Project[]): { rows: HistoryRow[]; discardedEntries: number }`, que: (a) descarta los registros que no cumplan `isValidTimeEntry` (US-000 TK-001, IT-24), contabilizándolos en `discardedEntries`; (b) resuelve `task` con `indexById(tasks)` (US-000 TK-001, IT-25) por `entry.taskId`, dejando `undefined` sin lanzar excepción si el Registro quedó huérfano; (c) resuelve `project` con `indexById(projects)` por `task?.projectId`, dejando `undefined` si la Tarea no tiene Proyecto válido (aplicación a nivel de fila del caso cubierto por TC-008).
- [ ] **IT-02** — Ordenar `rows` por `date` ascendente y anotar cada fila con el total acumulado de su Tarea (`calculateTotalByTask`, US-000 TK-001 IT-26) y el total acumulado de su mes (`calculateTotalByMonth`, US-000 TK-001 IT-28), de modo que `history-table.tsx` (IT-04) pueda mostrar ambos valores sin recalcularlos por su cuenta. AC-002 y AC-004 quedan calculados aquí; su presentación visual final la ajusta [TK-003: UI y diseño de la pantalla de Historial de registros](TK-003-ui-diseno-historial.md).
- [ ] **IT-03** — Implementar `useHistory()` en `use-history.ts`: gatea con `useHasHydrated()` (US-000 TK-001) devolviendo `status: "loading"` mientras no hidrató; luego lee `useProjects()`, `useTasks()`, `useTimeEntries()` (US-000 TK-001) e invoca `buildHistoryRows`; devuelve `status: "empty"` si `rows.length === 0` (incluye el caso de datos corruptos que el adaptador de US-000 TK-001 no pudo parsear, dado que su `read()` devuelve `null`) o `status: "with-data"` en caso contrario, junto con `rows` y `discardedEntries`.
- [ ] **IT-04** — Implementar `HistoryTable` (`history-table.tsx`): tabla HTML semántica (`<table>`) con columnas Fecha, Tarea (+ total acumulado de la Tarea), Proyecto (o "Sin proyecto" si `undefined`) y Duración; agrupa visualmente las filas por mes calendario (clave ya calculada en cada fila desde IT-02), mostrando una fila de subtítulo con el total de ese mes.
- [ ] **IT-05** — Implementar `EmptyHistory` (`empty-history.tsx`): recibe `message?: string` (default `"Aún no registraste tiempo"`) y lo muestra sin filas fantasma ni valores `NaN`/`undefined` (TC-003); `use-history.ts` (IT-03) le pasa un mensaje de aviso distinto cuando `discardedEntries > 0` mientras `rows.length === 0`, cubriendo la degradación controlada exigida por TC-002.
- [ ] **IT-06** — Cubrir con pruebas Vitest + Testing Library (ADR-007): `build-history-rows.test.ts` (join correcto, exclusión de inválidos, Tarea/Proyecto huérfanos sin excepción), `use-history.test.ts` (estados `loading`/`empty`/`with-data` mockeando `useHasHydrated` y los selectores del store), `history-table.test.tsx` (renderiza filas con Tarea/Proyecto/duración correctos) y `empty-history.test.tsx` (mensaje por defecto y mensaje de aviso).
- [ ] **IT-07** — Escribir `e2e/us-003-history-read.spec.ts` (Playwright, ADR-008) cubriendo TC-001 (siembra 3 Registros en localStorage y verifica que los 3 aparecen sin omisiones ni duplicados), TC-002 (siembra un valor no parseable bajo la clave de Registros de Tiempo y verifica que la pantalla no crashea y no hay excepción no controlada en consola) y TC-003 (localStorage vacío y verifica el estado vacío sin `NaN`/`undefined`).

## Observaciones

Sin pendientes documentados. El cálculo de totales (`calculateTotalByTask`/`calculateTotalByProject`/`calculateTotalByMonth`) y sus contratos (`TaskTotal`/`ProjectTotal`/`MonthTotal`) se movieron a [US-000 TK-001](../US-000-fundamentos/TK-001-dominio-persistencia-store-y-fecha.md) (IT-23 a IT-30) para que Proyectos y Tareas puedan consumirlos sin depender directamente de `features/historial/` (ADR-005); ver [TK-001 de US-001](../US-001-proyectos/TK-001-crear-editar-y-listar-proyectos.md) y [TK-002 de US-002](../US-002-tareas/TK-002-ui-pantalla-tareas-y-meta-semanal.md) para esas integraciones.
