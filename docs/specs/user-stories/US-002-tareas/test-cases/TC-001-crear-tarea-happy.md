# TC-001 — Dado un Proyecto existente, cuando el usuario crea una Tarea con Nombre y la asocia a ese Proyecto, entonces el sistema la crea exitosamente

**Perspectiva**: Happy Path
**Automatización**: Automatizable (E2E)
**Prioridad**: Media
**Criterio de aceptación**: AC-001 — Crear Tarea asociada a Proyecto existente con Nombre
**Artefacto padre**: US-002
**Estado**: Ready
**Creado por**: juanca202
**Fecha**: 2026-07-13

## Precondiciones

- La aplicación está corriendo en entorno local de desarrollo (`npm run dev`), sin backend, con persistencia en almacenamiento local del navegador.
- Existe al menos un Proyecto previamente creado (ver US-001) al que la nueva Tarea pueda asociarse.
- El panel principal de Tareas está visible.

## Datos de prueba

| Campo           | Valor                            | Notas                                             |
| --------------- | -------------------------------- | ------------------------------------------------- |
| Proyecto        | "Proyecto Alpha" [propuesto]     | Proyecto existente, creado previamente vía US-001 |
| Nombre de Tarea | "Diseñar wireframes" [propuesto] | Cadena no vacía                                   |

## Pasos de ejecución

| #   | Actor   | Acción                                                                               | Resultado esperado del paso                                        |
| --- | ------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| 1   | usuario | Abre el panel principal de Tareas y hace clic en el botón para crear una nueva Tarea | Se abre el modal "Nueva Tarea" con campos Proyecto y Nombre vacíos |
| 2   | usuario | Selecciona el Proyecto "Proyecto Alpha" en el campo Proyecto                         | El campo Proyecto queda con "Proyecto Alpha" seleccionado          |
| 3   | usuario | Ingresa "Diseñar wireframes" en el campo Nombre                                      | El campo Nombre muestra el texto ingresado                         |
| 4   | usuario | Hace clic en el botón principal para confirmar la creación                           | El sistema crea la Tarea y cierra el modal                         |

## Resultado esperado final

La nueva Tarea "Diseñar wireframes" aparece en el listado de Tareas Recientes, asociada visualmente al Proyecto "Proyecto Alpha", sin errores en pantalla.

## Observaciones

Este TC cubre exclusivamente la capacidad de creación (AC-001). La persistencia en almacenamiento local se valida en TC-004 (AC-003) y las validaciones de datos faltantes en TC-002/TC-003 (AC-002).
