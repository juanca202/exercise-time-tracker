## Why

El listado de "Tareas Recientes" aún no muestra el icono con fondo de color del prototipo Figma (nodo 1:1452 / `figma-tareas.png`), lo que deja la fila incompleta respecto al diseño de referencia. Además, hace falta una utilidad reutilizable que derive un color estable a partir de un string (nombre de Tarea o Proyecto) para pintar fondos y acentos decorativos sin persistir colores por entidad. En Proyectos, la barra lateral de cada tarjeta hoy usa un color fijo (`secondary`) y debe pasar a ser dinámica según el nombre del Proyecto.

## What Changes

- Cada fila de "Tareas Recientes" muestra un cuadro de icono (documento con check, como en el prototipo) a la izquierda del nombre.
- El fondo de ese cuadro se calcula con una utilidad `colorFromString(input: string): string` alimentada con el nombre de la Tarea, de forma determinista (mismo nombre → mismo color).
- La barra lateral izquierda de cada tarjeta de Proyecto usa la misma utilidad con el nombre del Proyecto (en lugar del color fijo actual).
- La utilidad vive en `src/shared/` para compartirse entre Tareas y Proyectos.

## Capabilities

### New Capabilities

- `string-color`: utilidad pura que genera un color a partir de un string de forma determinista y adecuada como fondo o acento de UI.

### Modified Capabilities

- `task-management`: el listado de "Tareas Recientes" SHALL incluir el icono con fondo derivado del nombre de la Tarea, fiel al prototipo.
- `project-management`: la tarjeta de Proyecto SHALL usar el color derivado del nombre del Proyecto en su barra lateral izquierda.

## Impact

- UI: `src/features/tasks/components/recent-tasks-list.tsx`, `src/features/projects/components/project-card.tsx` y sus pruebas.
- Shared: nueva utilidad en `src/shared/` (p. ej. `color-from-string.ts`) con pruebas unitarias.
- Icono: componente SVG alineado al glifo del prototipo Figma (nodo 1:1452).
- No cambia el modelo de datos ni la persistencia; el color no se almacena.
- Referencia visual: [figma-tareas.png](../../../docs/specs/requirements/SRS-001-timetracker-app/assets/figma-tareas.png) (nodo `1:1452`) y [figma-proyectos.png](../../../docs/specs/requirements/SRS-001-timetracker-app/assets/figma-proyectos.png) (barra de tarjeta).
- Extiende el alcance visual de `gestion-de-tareas-y-registro-de-tiempo` y `gestion-de-proyectos`.
