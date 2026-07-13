## Contexto

App greenfield Next.js 16 (App Router) + React 19 + TypeScript, offline-first, sin backend (SRS-001 §2.1, §2.4). El change `fundamentos` ya establece los tipos compartidos, el adaptador de persistencia, el store raíz de Zustand con el CRUD crudo de Proyecto, y el shell/sidebar de la app (las 3 rutas activas). Este change construye la pantalla y el modal de Proyectos sobre esa base y agrega la validación específica de Proyecto — no toca ningún archivo compartido. Sigue [ADR-005](../../../docs/adr/ADR-005-arquitectura-feature-based.md) (arquitectura feature-based), [ADR-004](../../../docs/adr/ADR-004-uso-de-zustand.md) (Zustand), [ADR-003](../../../docs/adr/ADR-003-uso-de-base-ui.md) (Base UI), [ADR-002](../../../docs/adr/ADR-002-uso-de-tailwind-css.md) (Tailwind).

## Objetivos / No-Objetivos

**Objetivos:**

- Implementar la creación/edición/listado de Proyecto según US-001, invocando las acciones crudas `addProject`/`updateProject`/`listProjects` de `fundamentos` y añadiendo encima la validación `isValidProjectName`.
- Coincidir con el prototipo de Figma y el sistema de diseño de DESIGN.md.

**No-Objetivos:**

- Tipos compartidos, persistencia, store raíz, o shell/sidebar de la app — cubierto por el change `fundamentos`; este change solo los consume.
- Gestión de Tareas o Registros de Tiempo — cubierto por el change `tareas`.
- Historial/reportes — cubierto por el change `historial-de-registros`.
- Cualquier mecanismo de almacenamiento más allá de `localStorage` (sin IndexedDB) — decidido en `fundamentos`.
- Una pantalla dedicada "Editar Proyecto" — el prototipo de Figma solo tiene "Nuevo Proyecto"; la edición lo reutiliza.

## Decisiones

1. **La edición reutiliza el modal de creación.** El modal "Nuevo Proyecto" recibe una prop opcional `initialValues`; cuando está presente se renderiza como "Editar Proyecto" con los campos precargados. Confirmado contra Figma — no existe una pantalla de edición distinta.
2. **La validación vive acá, no en el store compartido.** `isValidProjectName` (no vacío después de trim) está implementada en `src/features/projects`, invocada por el modal antes de llamar al `addProject`/`updateProject` crudo de `fundamentos` — manteniendo los AC-001/AC-002 propios de este change trazables a su propio diff, y evitando cualquier edición al módulo del store compartido (según el diseño de `fundamentos`, Decisión 2).
3. **El gating de hidratación se reutiliza tal cual.** Las lecturas del estado de Proyecto pasan por el hook `useHasHydrated()` provisto por `fundamentos`; no se necesita manejo de hidratación nuevo acá.

## Riesgos / Compromisos

- **[Riesgo] Acoplamiento a la firma del CRUD crudo de `fundamentos`.** → Mitigación: el diseño de `fundamentos` documenta `addProject`/`updateProject`/`listProjects` como superficie de API estable que no debe ser modificada por changes downstream; si alguna vez se necesita un cambio de firma, ocurre en `fundamentos`, no acá.

## Plan de Migración

No aplica — greenfield, sin datos existentes. `schemaVersion` ya está establecido por `fundamentos`.

## Preguntas Abiertas

Ninguna bloqueante. Todas las ambigüedades ya fueron resueltas durante `work-define`/`work-research` (ver las Observaciones de US-001 y las notas de investigación).
