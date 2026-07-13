## Why

[US-001](../../../docs/specs/user-stories/US-001-proyectos/README.md) (Ready, 9 criterios de aceptación) especifica la gestión de Proyectos: crear, editar y listar Proyectos. El change `fundamentos` ya provee los tipos compartidos, la persistencia, el CRUD crudo de Proyecto y el shell de la app (sidebar, layout) del que este change depende — este change construye la pantalla y el modal de Proyectos, más la validación específica de Proyecto, sobre esa base.

## What Changes

- Agregar la creación de Proyecto: Nombre (obligatorio) + Descripción (opcional), con validación `isValidProjectName`.
- Agregar la edición de Proyecto, reutilizando el modal "Nuevo Proyecto" precargado con los datos existentes (título/botón intercambiados a "Editar Proyecto") — el prototipo de Figma no tiene una pantalla de edición separada.
- Agregar la pantalla de listado de Proyectos (tarjetas de proyecto + tarjeta de estado vacío "Crear Nuevo Proyecto").
- Conectar la creación/edición de Proyecto al CRUD crudo `addProject`/`updateProject`/`listProjects` provisto por el change `fundamentos` (offline-first, sin backend), sobreviviendo a recarga/reinicio.
- Implementar la UI según DESIGN.md "Precision Focus" y el prototipo de Figma, con un criterio de aceptación explícito de fidelidad visual.

No hay cambios **BREAKING** — primera implementación, greenfield.

## Capacidades

### Capacidades Nuevas

- `project-management`: Crear, editar y listar Proyectos, persistidos localmente. Fuente: [US-001](../../../docs/specs/user-stories/US-001-proyectos/README.md), AC-001 a AC-007 y AC-009 (AC-008 — navegación del sidebar — vive en el change `fundamentos`).

### Capacidades Modificadas

- Ninguna.

## Impacto

- **Código afectado**: solo `src/features/projects` — pantalla, modal y validación específica de Proyecto. Reutiliza (sin modificar) el shell/sidebar de la app y el CRUD crudo de Proyecto de `src/shared`, ambos provistos por `fundamentos`.
- **Dependencias**: sin nuevas dependencias en tiempo de ejecución; almacenamiento vía `localStorage` nativo + Zustand `persist` ([ADR-004](../../../docs/adr/ADR-004-uso-de-zustand.md)), ya conectado por `fundamentos`; UI vía Base UI ([ADR-003](../../../docs/adr/ADR-003-uso-de-base-ui.md)) y Tailwind CSS ([ADR-002](../../../docs/adr/ADR-002-uso-de-tailwind-css.md)).
- **Sistemas**: ninguno externo — totalmente del lado del cliente, offline-first (SRS-001 §2.1, §2.4).
- **Sistema de diseño**: debe coincidir con el prototipo de Figma (`https://www.figma.com/design/K6uQLWg82KsCSpHJVXSf6L/exercise-time-tracker`, frames "Proyectos" y "Proyectos - Diálogo Nuevo proyecto").
- **Secuenciación**: depende únicamente del change `fundamentos`. Una vez que `fundamentos` esté mergeado, este change no tiene dependencia con — ni toca ningún archivo compartido con — `tareas` o `historial-de-registros`, por lo que los tres pueden implementarse en paralelo.
