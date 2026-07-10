# TC-010 — Dado que el temporizador de la Tarea "Diseñar wireframes" está activo, Cuando el usuario hace clic en "Detener Sesión", Entonces el temporizador se detiene y la Tarea queda en estado inactivo

Perspectiva: Happy Path
Automatización: Automatizable (E2E)
Prioridad: Alta
Criterio de aceptación: AC-006 (Casos de uso) — Detener el temporizador activo
Artefacto padre: US-30272
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Precondiciones

- La aplicación está abierta en el entorno de desarrollo local, en la pantalla principal "Tareas".
- El temporizador de la Tarea "Diseñar wireframes" está activo ("En Ejecución") desde hace varios minutos.

## Datos de prueba

N/A

## Pasos de ejecución

| #   | Actor   | Acción                                                                                       | Resultado esperado del paso        |
| --- | ------- | -------------------------------------------------------------------------------------------- | ---------------------------------- |
| 1   | Usuario | Hace clic en la acción "Detener Sesión" sobre el temporizador activo de "Diseñar wireframes" | El sistema detiene el temporizador |

## Resultado esperado final

El panel de Tareas ya no muestra ningún temporizador activo; la Tarea "Diseñar wireframes" queda en estado inactivo.

## Observaciones

Ninguna.
