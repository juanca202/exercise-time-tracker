# TC-018 — Dado el prototipo de alta fidelidad en Figma, cuando se compara con la implementación de la pantalla de Tareas y su modal, entonces ambos son visualmente fieles en layout, colores, tipografía, espaciado y componentes

**Perspectiva**: Happy Path
**Automatización**: Automatizable (Visual Test)
**Prioridad**: Baja
**Criterio de aceptación**: AC-016 — Fidelidad visual de la pantalla de Tareas y el modal respecto al prototipo Figma
**Artefacto padre**: US-002
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La aplicación está corriendo en entorno local de desarrollo, sin backend.
- El prototipo de alta fidelidad en Figma (pantalla Tareas y modal Nueva Tarea) está disponible como referencia.
- Existen datos de ejemplo (Proyectos, Tareas, Registros de Tiempo) que permitan poblar la pantalla de forma representativa.

## Datos de prueba

N/A

## Pasos de ejecución

| #   | Actor   | Acción                                                                                                        | Resultado esperado del paso                                                                                                           |
| --- | ------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | usuario | Captura una imagen de la pantalla de Tareas implementada y la compara contra el diseño de referencia en Figma | El layout, los colores, la tipografía, el espaciado y los componentes coinciden con el prototipo, sin diferencias visuales relevantes |
| 2   | usuario | Captura una imagen del modal "Nueva Tarea" implementado y la compara contra el diseño de referencia en Figma  | El layout, los colores, la tipografía, el espaciado y los componentes coinciden con el prototipo, sin diferencias visuales relevantes |

## Resultado esperado final

La pantalla de Tareas y el modal de creación/edición replican fielmente el prototipo de alta fidelidad en Figma, sin desviaciones visuales significativas.

## Observaciones

Se recomienda automatizar mediante pruebas de regresión visual (snapshot testing) con Playwright. Complementa a TC-006 (AC-005), que valida adherencia al sistema de diseño DESIGN.md a nivel de tokens/componentes, no la fidelidad pixel-a-pixel con Figma.
