## Why

Un Proyecto es la unidad organizativa base de Time Tracker: agrupa las Tareas relacionadas y permite ver de un vistazo el tiempo total invertido en cada uno ([SRS-001](../../../docs/specs/requirements/SRS-001-timetracker-app/README.md)). US-30273 no depende de ninguna otra historia — al contrario, US-30272 (Tareas) necesita que existan Proyectos para poder asociarles Tareas — por lo que conviene implementarla primero. Ya está en `Estado: Ready`, sin decisiones técnicas pendientes (ADR-011 resolvió el mecanismo de persistencia local).

## What Changes

- Modal "Nuevo Proyecto" / "Crear Nuevo Proyecto": crear un Proyecto con Nombre (obligatorio) y Descripción (opcional).
- Persistencia de Proyectos en `localStorage` vía el middleware `persist` de Zustand (ADR-011).
- Listado de Proyectos existentes en tarjetas con Nombre, Descripción y Tiempo Registrado, conforme al prototipo de alta fidelidad.
- Acción visible para iniciar la creación de un Proyecto.
- Cálculo y visualización del tiempo total registrado por Proyecto, como la suma de los tiempos de sus Tareas.

## Capabilities

### New Capabilities

- `project-management`: creación y listado de Proyectos, incluyendo el cálculo del tiempo total registrado por Proyecto (suma de los tiempos de sus Tareas) y su persistencia local.

### Modified Capabilities

(ninguna — no hay capacidades existentes en `openspec/specs/` todavía)

## Impact

- Código nuevo en `src/features/` (feature de proyectos, según ADR-005 arquitectura feature-based) y su store de Zustand con persistencia `localStorage` (ADR-011).
- Es la base de la que dependen `task-time-tracking` (change `gestion-de-tareas`, US-30272 — una Tarea requiere un Proyecto existente) y la capability de historial (change `historial-de-registros`, US-30274 — totales por Proyecto).
- El cálculo del tiempo total registrado por Proyecto lee los Registros de Tiempo que produce `task-time-tracking`; sin Tareas ni Registros, el Proyecto muestra el tiempo total en cero.
- UI conforme al prototipo de alta fidelidad en Figma (frames "Proyectos" y "Diálogo Nuevo proyecto") referenciado en US-30273.
