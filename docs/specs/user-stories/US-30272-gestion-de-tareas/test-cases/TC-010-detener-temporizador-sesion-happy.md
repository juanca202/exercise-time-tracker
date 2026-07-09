# TC-010 — Detener el temporizador activo mediante "Detener Sesión"

Tipo: Happy Path
Prioridad: Alta
Criterio de aceptación: AC-006 (Casos de uso) — Detener el temporizador activo
Artefacto padre: US-30272
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Objetivo

Validar que el usuario puede detener el temporizador activo mediante la acción "Detener Sesión".

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
