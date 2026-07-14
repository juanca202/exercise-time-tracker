# TC-005 — Dada una Tarea existente, cuando el usuario edita su Nombre desde el modal reutilizado, entonces el sistema actualiza la Tarea con el nuevo Nombre

**Perspectiva**: Happy Path
**Automatización**: Automatizable (E2E)
**Prioridad**: Media
**Criterio de aceptación**: AC-004 — Editar Nombre de Tarea existente reutilizando el modal de creación
**Artefacto padre**: US-002
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La aplicación está corriendo en entorno local de desarrollo, sin backend.
- Existe una Tarea previamente creada: "Diseñar wireframes", asociada a "Proyecto Alpha".

## Datos de prueba

| Campo           | Valor                                              | Notas                                  |
| --------------- | -------------------------------------------------- | -------------------------------------- |
| Nombre original | "Diseñar wireframes" [propuesto]                   | Tarea existente                        |
| Nombre nuevo    | "Diseñar wireframes de alta fidelidad" [propuesto] | Cadena no vacía distinta a la original |

## Pasos de ejecución

| #   | Actor   | Acción                                                             | Resultado esperado del paso                                                                                |
| --- | ------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| 1   | usuario | Selecciona la acción de editar sobre la Tarea "Diseñar wireframes" | Se abre el mismo modal de creación, precargado con Proyecto "Proyecto Alpha" y Nombre "Diseñar wireframes" |
| 2   | sistema | Muestra el título del modal y la etiqueta del botón principal      | Ambos indican "Editar Tarea" en lugar de "Nueva Tarea"                                                     |
| 3   | usuario | Modifica el campo Nombre a "Diseñar wireframes de alta fidelidad"  | El campo Nombre refleja el nuevo valor                                                                     |
| 4   | usuario | Hace clic en el botón principal ("Editar Tarea")                   | El sistema guarda el cambio y cierra el modal                                                              |

## Resultado esperado final

El listado de Tareas muestra "Diseñar wireframes de alta fidelidad" en lugar del nombre anterior, manteniendo la misma asociación al Proyecto "Proyecto Alpha".

## Observaciones

La validación de Nombre vacío durante la edición se considera cubierta por la misma lógica de validación de AC-002 (modal compartido) y no genera un TC adicional aquí para evitar duplicar cobertura.
