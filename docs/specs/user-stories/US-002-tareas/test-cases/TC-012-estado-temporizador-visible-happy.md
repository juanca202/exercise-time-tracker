# TC-012 — Dada una Tarea con temporizador activo o inactivo, cuando el usuario observa el panel de Tareas, entonces la interfaz muestra claramente el estado del temporizador y la Tarea asociada

**Perspectiva**: Happy Path
**Automatización**: Automatizable (E2E)
**Prioridad**: Media
**Criterio de aceptación**: AC-011 — Mostrar claramente el estado del temporizador (activo/inactivo) y la Tarea asociada
**Artefacto padre**: US-002
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La aplicación está corriendo en entorno local de desarrollo, sin backend.
- Existe la Tarea "Diseñar wireframes" en el listado "Tareas Recientes", sin temporizador activo al inicio.

## Datos de prueba

| Campo | Valor                            | Notas           |
| ----- | -------------------------------- | --------------- |
| Tarea | "Diseñar wireframes" [propuesto] | Tarea existente |

## Pasos de ejecución

| #   | Actor   | Acción                                                             | Resultado esperado del paso                                                                   |
| --- | ------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| 1   | usuario | Observa el panel de Tareas antes de iniciar cualquier temporizador | La interfaz indica que no hay temporizador activo (estado inactivo)                           |
| 2   | usuario | Inicia el temporizador de "Diseñar wireframes" (ícono ▷)           | La interfaz muestra el estado "En Ejecución" junto al nombre de la Tarea "Diseñar wireframes" |
| 3   | usuario | Detiene el temporizador de "Diseñar wireframes"                    | La interfaz vuelve a mostrar el estado inactivo para esa Tarea                                |

## Resultado esperado final

En todo momento la interfaz refleja de forma inequívoca si hay un temporizador activo y, de haberlo, a qué Tarea corresponde.

## Observaciones

N/A
