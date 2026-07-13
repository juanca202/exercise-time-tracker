## Why

`project-management`, `task-management`, `time-tracking` y `time-history` necesitan una misma base técnica: tipos de dominio, persistencia local, un store raíz con operaciones CRUD reales por entidad, y la navegación de la aplicación. Levantar esa base como su propio change, antes que cualquiera de esas features, es lo que permite que cada una se implemente de forma completamente independiente: cada una consume datos reales desde el primer commit (no tipos vacíos ni fixtures) y ninguna necesita tocar el store raíz, la persistencia o el sidebar para agregar su propia lógica.

Este change deja fijados esos archivos compartidos de una sola vez, de modo que `proyectos`, `tareas` e `historial-de-registros` dependen únicamente de él — no hay dependencia funcional ni de archivos entre ellas.

## What Changes

- Definir los tipos de dominio completos (`Project`, `Task`, `TimeRecord`, `activeTimer`) en `src/shared/types`, sin placeholders — todas las specs consumidoras los usan desde el día uno.
- Implementar el adaptador de persistencia local en `src/shared/persistence` (wrapper de `localStorage` con `get`/`set`/`subscribe` y `schemaVersion`).
- Crear el store raíz de Zustand con `persist` middleware sobre ese adaptador, más `useHasHydrated()` y la llamada a `navigator.storage.persist()` en el arranque de la app.
- Exponer CRUD crudo (sin reglas de negocio ni validación) por entidad en el store: `addProject`/`updateProject`/`listProjects`, `addTask`/`updateTask`/`listTasks`, `addTimeRecord`/`listTimeRecords`. Las reglas de negocio (validaciones, máquina de estados del timer, meta semanal, selectores de totales) siguen siendo responsabilidad de cada spec dueña.
- Construir el app shell: layout de nivel superior y sidebar de navegación con las 3 rutas (Tareas / Proyectos / Historial de registros) activas, más una página stub para cada ruta, según el frame Figma "Aside - SideNavBar".
- Implementar `getRecordMonth(record: TimeRecord)` en `src/shared` como helper compartido, porque lo consumen tanto `tareas` como `historial-de-registros` y no debe duplicarse ni crear dependencia entre esas dos specs.
- Scaffold de carpetas de features (`src/features/projects`, `src/features/tasks`, `src/features/history`) según ADR-005.

No **BREAKING** changes — primera implementación, greenfield.

## Capacidades

### Capacidades Nuevas

- `shared-state`: Tipos de dominio, adaptador de persistencia local, store raíz de Zustand con CRUD crudo por entidad, hidratación y helper `getRecordMonth`. Consumido por `project-management`, `task-management`, `time-tracking` y `time-history`.
- `app-shell`: Layout de nivel superior y navegación lateral con las 3 rutas del producto activas desde el inicio, más las páginas stub que cada spec de feature completa.

### Capacidades Modificadas

- Ninguna.

## Impacto

- **Código afectado**: `src/shared/types` (nuevo), `src/shared/persistence` (nuevo), `src/shared/store` o equivalente (nuevo, store raíz), `src/shared/time` o equivalente (nuevo, `getRecordMonth`), el app shell (layout + sidebar), y el scaffold vacío de `src/features/projects`, `src/features/tasks`, `src/features/history`.
- **Dependencias**: sin nueva dependencia de runtime; persistencia vía `localStorage` nativo + Zustand `persist` ([ADR-004](../../../docs/adr/ADR-004-uso-de-zustand.md)); UI vía Base UI ([ADR-003](../../../docs/adr/ADR-003-uso-de-base-ui.md)) y Tailwind CSS ([ADR-002](../../../docs/adr/ADR-002-uso-de-tailwind-css.md)); arquitectura feature-based ([ADR-005](../../../docs/adr/ADR-005-arquitectura-feature-based.md)).
- **Sistemas**: ninguno externo — totalmente client-side, offline-first (SRS-001 §2.1, §2.4).
- **Sistema de diseño**: sidebar debe coincidir con el prototipo Figma (`https://www.figma.com/design/K6uQLWg82KsCSpHJVXSf6L/exercise-time-tracker`, frame "Aside - SideNavBar").
- **Secuenciación**: este change debe implementarse y mergearse **antes** que `proyectos`, `tareas` e `historial-de-registros`. Una vez mergeado, esas tres specs quedan sin dependencia funcional ni de archivos entre sí y pueden implementarse en paralelo.
- **Nota de alcance**: este change deliberadamente NO incluye reglas de negocio (`isValidProjectName`, `isValidTask`, `isValidDuration`, máquina de estados del timer, meta semanal, selectores de totales por Task/Project/Mes) — esas permanecen en cada spec dueña para preservar la trazabilidad de sus AC-XXX y evitar contención de archivos innecesaria.
