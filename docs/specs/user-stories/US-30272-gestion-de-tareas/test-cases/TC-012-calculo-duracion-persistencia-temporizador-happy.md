# TC-012 — Dado que el temporizador de "Diseñar wireframes" está activo con Hora Inicio registrada, Cuando el usuario hace clic en "Detener Sesión", Entonces el sistema calcula la Duración y persiste el Registro de Tiempo de forma inmediata

Perspectiva: Happy Path
Automatización: Automatizable (Integration)
Prioridad: Alta
Criterio de aceptación: AC-007 (Procesamiento de datos) — Cálculo y persistencia inmediata del Registro de Tiempo
Artefacto padre: US-30272
Estado: Ready
Creado por: juanca202
Fecha: 2026-07-08

## Precondiciones

- La aplicación está abierta en el entorno de desarrollo local, en la pantalla principal "Tareas".
- El temporizador de la Tarea "Diseñar wireframes" está activo, con Hora Inicio registrada.

## Datos de prueba

N/A

## Pasos de ejecución

| #   | Actor   | Acción                                                                             | Resultado esperado del paso                              |
| --- | ------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------- |
| 1   | Usuario | Hace clic en "Detener Sesión" sobre el temporizador activo de "Diseñar wireframes" | El sistema registra la Hora Fin                          |
| 2   | Sistema | Calcula la Duración como Hora Fin − Hora Inicio                                    | La Duración calculada corresponde al tiempo transcurrido |
| 3   | Sistema | Persiste el Registro de Tiempo en el almacenamiento local                          | El Registro de Tiempo queda guardado inmediatamente      |

## Resultado esperado final

El nuevo Registro de Tiempo de "Diseñar wireframes" queda visible en el historial de la Tarea, con la Duración correctamente calculada, y persiste tras recargar la aplicación.

## Observaciones

Ninguna.
