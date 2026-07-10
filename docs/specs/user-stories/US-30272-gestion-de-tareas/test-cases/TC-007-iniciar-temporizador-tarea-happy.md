# TC-007 — Dado que existe la Tarea "Diseñar wireframes" sin ningún temporizador activo, Cuando el usuario inicia el temporizador sobre esa Tarea, Entonces el panel de Tareas muestra el temporizador en estado "En Ejecución"

Perspectiva: Happy Path
Automatización: Automatizable (E2E)
Prioridad: Alta
Criterio de aceptación: AC-004 (Casos de uso) — Iniciar temporizador para una Tarea específica
Artefacto padre: US-30272
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Precondiciones

- La aplicación está abierta en el entorno de desarrollo local, en la pantalla principal "Tareas".
- Existe la Tarea "Diseñar wireframes" asociada al "Proyecto Alfa".
- No hay ningún temporizador activo en la aplicación.

## Datos de prueba

N/A

## Pasos de ejecución

| #   | Actor   | Acción                                                                             | Resultado esperado del paso                                                                             |
| --- | ------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 1   | Usuario | Hace clic en la acción de iniciar temporizador sobre la Tarea "Diseñar wireframes" | El sistema registra el estado "En Ejecución" junto con la hora de inicio y el identificador de la Tarea |

## Resultado esperado final

El panel de Tareas muestra el temporizador activo para la Tarea "Diseñar wireframes", indicando el estado "En Ejecución".

## Observaciones

Ninguna.
