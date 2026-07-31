## Why

Time Tracker no tiene todavía una estructura de navegación: sin un shell común (barra lateral + encabezado), ninguna de las pantallas del producto (Tareas, Proyectos, Historial de registros) tiene dónde montarse ni una forma consistente de indicar en qué sección está el usuario. Esta es la historia inicial del backlog (US-001) precisamente porque el resto de las pantallas dependen de este layout.

## What Changes

- Se añade una barra lateral de navegación con acceso a las secciones "Tareas", "Proyectos" e "Historial de registros".
- La barra lateral indica visualmente cuál sección está activa.
- Cada pantalla muestra en su encabezado el nombre del producto ("TimeTracker") y el título de la sección activa.
- La interfaz adopta la paleta, tipografía, espaciado y patrones de componentes de `DESIGN.md` (tema Precision Focus).

## Capabilities

### New Capabilities

- `app-layout`: shell de navegación de la aplicación (barra lateral + encabezado) compartido por todas las pantallas del producto.

### Modified Capabilities

_Ninguna — es la primera capability del producto; no hay specs existentes que modificar._

## Impacto

- Repositorio: `exercise-time-tracker` (monorepo, Next.js App Router).
- Introduce el layout raíz de la app (`src/app/`) y los componentes de navegación en `src/shared/` o `src/features/` según la convención feature-based del proyecto (ver ADR-005).
- No afecta persistencia ni modelo de datos: es puramente de presentación.
- Fuente funcional: [US-001 — Layout de la Aplicación](../../../docs/specs/user-stories/US-001-layout-de-la-aplicacion/README.md), derivada de [SRS-001](../../../docs/specs/requirements/SRS-001-timetracker-app/README.md) (RIU-001, RIU-002, RIU-003, RD-001, RD-003).
