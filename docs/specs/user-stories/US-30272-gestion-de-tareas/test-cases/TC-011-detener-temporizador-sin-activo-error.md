# TC-011 — Intentar detener un temporizador cuando no hay ninguno activo

Tipo: Error
Prioridad: Media
Criterio de aceptación: AC-006 (Casos de uso) — Detener el temporizador activo
Artefacto padre: US-30272
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Objetivo

Validar que el sistema maneja de forma controlada la ausencia de un temporizador activo cuando no existe ninguna sesión en ejecución para detener.

## Precondiciones

- La aplicación está abierta en el entorno de desarrollo local, en la pantalla principal "Tareas".
- No hay ningún temporizador activo en la aplicación.

## Datos de prueba

N/A

## Pasos de ejecución

| #   | Actor   | Acción                                                    | Resultado esperado del paso                                            |
| --- | ------- | --------------------------------------------------------- | ---------------------------------------------------------------------- |
| 1   | Usuario | Observa el panel de Tareas sin ningún temporizador activo | La acción "Detener Sesión" no se muestra disponible para ninguna Tarea |

## Resultado esperado final

No existe ninguna acción "Detener Sesión" disponible en el panel de Tareas mientras no haya un temporizador activo; el sistema no genera ningún Registro de Tiempo.

## Observaciones

Ninguna.
