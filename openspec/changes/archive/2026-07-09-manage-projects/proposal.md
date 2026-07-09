## Why

Time Tracker necesita una forma de agrupar el trabajo del usuario en unidades con sentido de negocio antes de poder registrar tiempo sobre ellas. Hoy no existe ningún código de features (`src/app` solo tiene el scaffold por defecto de Next.js): esta es la primera pieza del dominio y la base de la que dependen la gestión de tareas y el historial de registros.

## What Changes

- Crear un nuevo Proyecto ingresando un Nombre (obligatorio) y una Descripción (opcional).
- Persistir cada Proyecto en el almacenamiento local del dispositivo (`localStorage` vía Zustand `persist`, según ADR-011).
- Listar los Proyectos existentes en tarjetas con Nombre, Descripción y Tiempo Registrado, incluyendo el estado vacío (sin proyectos).
- Ofrecer una acción visible ("Nuevo Proyecto" / "Crear Nuevo Proyecto") para iniciar la creación.
- Calcular y mostrar el tiempo total registrado por Proyecto como la suma de los tiempos de sus Tareas (0 si el proyecto no tiene tareas o registros).

## Capabilities

### New Capabilities

- `project-management`: creación, almacenamiento local y listado de Proyectos, incluyendo el cálculo del tiempo total registrado por proyecto.

### Modified Capabilities

(ninguna — es la primera capability del dominio)

## Impact

- Código nuevo: feature `projects` bajo `src/features/` (ADR-005), incluyendo su store de Zustand persistido con `localStorage` (ADR-011).
- UI: componentes bajo Base UI (ADR-003) y estilos Tailwind (ADR-002), conforme al prototipo Figma de Proyectos y al modal "Nuevo Proyecto".
- El cálculo de "Tiempo Registrado" por proyecto depende de los Registros de Tiempo que introducirá el change `track-task-time`; hasta que ese change se implemente, el total se muestra como 0 para todo proyecto.
- No hay dependencias previas: esta es la capability base sobre la que se apoyan `track-task-time` y `view-time-history`.

## Referencias

- Historia de origen: [US-30273 — Gestión de Proyectos](../../../docs/specs/user-stories/US-30273-gestion-de-proyectos/README.md)
- Especificación de origen: [SRS-001: Time Tracker](../../../docs/specs/requirements/SRS-001-timetracker-app/README.md)
- Diseño / prototipo (alta fidelidad) — Proyectos: [Figma — Proyectos](https://www.figma.com/design/K6uQLWg82KsCSpHJVXSf6L/exercise-time-tracker?node-id=1-1571)
- Diseño / prototipo (alta fidelidad) — Modal Nuevo Proyecto: [Figma — Proyectos / Diálogo Nuevo proyecto](https://www.figma.com/design/K6uQLWg82KsCSpHJVXSf6L/exercise-time-tracker?node-id=1-1642)
- [ADR-011: Uso de localStorage vía Zustand persist para el almacenamiento local](../../../docs/adr/ADR-011-persistencia-local-con-localstorage.md)
