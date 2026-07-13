# TC-006 — Dado el prototipo Figma de referencia, cuando se implementa la pantalla de Tareas y el modal de creación/edición, entonces la interfaz respeta el sistema de diseño DESIGN.md (tema Precision Focus)

**Perspectiva**: Happy Path
**Automatización**: Automatizable (Visual Test)
**Prioridad**: Baja
**Criterio de aceptación**: AC-005 — Implementar el diseño de la pantalla de Tareas y el modal según Figma y DESIGN.md
**Artefacto padre**: US-002
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La aplicación está corriendo en entorno local de desarrollo, sin backend.
- El prototipo Figma de referencia (pantalla Tareas y modal Nueva Tarea) está disponible para comparación.
- El archivo DESIGN.md del proyecto está disponible como referencia del sistema de diseño (tema Precision Focus).

## Datos de prueba

N/A

## Pasos de ejecución

| #   | Actor   | Acción                              | Resultado esperado del paso                                                                                                                              |
| --- | ------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | usuario | Navega al panel principal de Tareas | Los componentes (listado, temporizador, ingreso manual, widgets de meta semanal) usan los tokens de color, tipografía y espaciado definidos en DESIGN.md |
| 2   | usuario | Abre el modal "Nueva Tarea"         | El modal usa los mismos tokens de diseño (colores, tipografía, espaciado, componentes base) que el resto de la aplicación                                |

## Resultado esperado final

La pantalla de Tareas y el modal de creación/edición se renderizan usando exclusivamente componentes y tokens del sistema de diseño DESIGN.md (tema Precision Focus), sin estilos ad-hoc que lo contradigan.

## Observaciones

Este TC valida adherencia al sistema de diseño (nivel de tokens/componentes). La fidelidad pixel-a-pixel respecto al prototipo Figma se cubre en TC-018 (AC-016).
